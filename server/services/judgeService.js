const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const util = require('util');
const execPromise = util.promisify(exec);

const TEMP_DIR = path.join(__dirname, '../temp_submissions');
if (!fs.existsSync(TEMP_DIR)) {
    fs.mkdirSync(TEMP_DIR, { recursive: true });
}

// Helper to escape input for shell command (basic protection)
const escapeShell = (cmd) => {
    return cmd.replace(/"/g, '\\"');
};

const executePython = async (code, input) => {
    const filename = `sub_${Date.now()}_${Math.floor(Math.random() * 1000)}.py`;
    const filepath = path.join(TEMP_DIR, filename);

    try {
        fs.writeFileSync(filepath, code);

        // Use timeout -s SIGKILL to force kill if it hangs
        // Mount temp dir to /mnt in container
        // echo input | python file
        const safeInput = input ? input.replace(/'/g, "'\\''") : '';
        const dockerCmd = `docker run --rm --network none -v "${TEMP_DIR}:/mnt" python:3.9-alpine sh -c "echo '${safeInput}' | python /mnt/${filename}"`;

        const { stdout, stderr } = await execPromise(dockerCmd, { timeout: 3000 });
        return { stdout: stdout.trim(), stderr: stderr.trim(), time: '0.1s' }; // Mock time for now

    } catch (error) {
        // If timeout or runtime error
        if (error.killed) {
            return { stdout: '', stderr: 'Time Limit Exceeded' };
        }
        return { stdout: '', stderr: error.stderr || error.message };
    } finally {
        // Cleanup
        if (fs.existsSync(filepath)) fs.unlinkSync(filepath);
    }
};

const executeCpp = async (code, input) => {
    const filenameSource = `sub_${Date.now()}_${Math.floor(Math.random() * 1000)}.cpp`;
    const filenameExe = filenameSource.replace('.cpp', '.out');
    const filepathSource = path.join(TEMP_DIR, filenameSource);

    try {
        fs.writeFileSync(filepathSource, code);

        // Command: g++ source.cpp -o source.out && echo input | ./source.out
        const safeInput = input ? input.replace(/'/g, "'\\''") : '';
        const dockerCmd = `docker run --rm --network none -v "${TEMP_DIR}:/mnt" gcc:latest sh -c "g++ /mnt/${filenameSource} -o /mnt/${filenameExe} && echo '${safeInput}' | /mnt/${filenameExe}"`;

        const { stdout, stderr } = await execPromise(dockerCmd, { timeout: 5000 }); // Give C++ a bit more time for compilation
        return { stdout: stdout.trim(), stderr: stderr.trim(), time: '0.05s' };

    } catch (error) {
        if (error.killed) {
            return { stdout: '', stderr: 'Time Limit Exceeded' };
        }
        // Compilation error usually comes in stderr
        return { stdout: '', stderr: error.stderr || error.message };
    } finally {
        if (fs.existsSync(filepathSource)) fs.unlinkSync(filepathSource);
        // Clean up executable if it exists
        const filepathExe = path.join(TEMP_DIR, filenameExe);
        if (fs.existsSync(filepathExe)) fs.unlinkSync(filepathExe);
    }
};

const executeJava = async (code, input) => {
    // Java requires the class name to match the file name. 
    // We enforce "public class Main" so we save as Main.java.
    // To avoid collisions in concurrent requests, we use a unique folder for each submission.
    const uniqueId = `${Date.now()}_${Math.floor(Math.random() * 1000)}`;
    const workDir = path.join(TEMP_DIR, uniqueId);

    if (!fs.existsSync(workDir)) {
        fs.mkdirSync(workDir, { recursive: true });
    }

    const filename = 'Main.java';
    const filepath = path.join(workDir, filename);

    try {
        fs.writeFileSync(filepath, code);

        // Command: javac Main.java && echo 'input' | java Main
        // We mount the workDir to /mnt in the container
        const safeInput = input ? input.replace(/'/g, "'\\''") : '';
        const dockerCmd = `docker run --rm --network none -v "${workDir}:/mnt" amazoncorretto:17-alpine sh -c "cd /mnt && javac Main.java && echo '${safeInput}' | java Main"`;

        const { stdout, stderr } = await execPromise(dockerCmd, { timeout: 5000 }); // Java JVM startup might take a bit
        return { stdout: stdout.trim(), stderr: stderr.trim(), time: '0.1s' };

    } catch (error) {
        if (error.killed) {
            return { stdout: '', stderr: 'Time Limit Exceeded' };
        }
        return { stdout: '', stderr: error.stderr || error.message };
    } finally {
        // Cleanup the whole directory
        if (fs.existsSync(workDir)) {
            fs.rmSync(workDir, { recursive: true, force: true });
        }
    }
};

module.exports = { executePython, executeCpp, executeJava };
