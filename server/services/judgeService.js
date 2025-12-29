const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const TEMP_DIR = path.join(__dirname, '../temp_submissions');
if (!fs.existsSync(TEMP_DIR)) {
    fs.mkdirSync(TEMP_DIR, { recursive: true });
}

// Helper: Generate Unique Directory
const createUniqueDir = () => {
    const id = crypto.randomUUID ? crypto.randomUUID() : crypto.randomBytes(8).toString('hex');
    const dir = path.join(TEMP_DIR, id);
    fs.mkdirSync(dir, { recursive: true });
    return { dir, id };
};

// Helper: Run Docker using spawn (Secure, no shell injection)
const runContainer = (image, cmdArgs, workDir, timeLimit = 3000) => {
    return new Promise((resolve) => {
        // Enforce resource limits
        // Check if we are running in a container and need to map paths for the host daemon
        let hostMountDir = workDir;
        if (process.env.JUDGE_HOST_PATH) {
            // workDir is inside the container (e.g. /app/temp_submissions/uuid)
            // TEMP_DIR is /app/temp_submissions
            // We want: /Users/Host/.../server/temp_submissions/uuid
            const relativePart = path.relative(TEMP_DIR, workDir);
            hostMountDir = path.join(process.env.JUDGE_HOST_PATH, relativePart);
        }

        const dockerArgs = [
            'run',
            '--rm',
            '--network', 'none',    // No internet
            '--memory', '128m',     // Max 128MB RAM
            '--cpus', '0.5',        // Max 0.5 CPU
            '-v', `${hostMountDir}:/mnt`,
            image,
            ...cmdArgs
        ];

        const child = spawn('docker', dockerArgs);

        let stdout = '';
        let stderr = '';
        let killed = false;

        // Timeout Timer
        const timer = setTimeout(() => {
            killed = true;
            child.kill('SIGKILL'); // Force kill
        }, timeLimit);

        // Cap output size to prevent DoS (1MB limit)
        const MAX_OUTPUT = 1024 * 1024;

        child.stdout.on('data', (data) => {
            if (stdout.length < MAX_OUTPUT) {
                stdout += data.toString();
            }
        });

        child.stderr.on('data', (data) => {
            if (stderr.length < MAX_OUTPUT) {
                stderr += data.toString();
            }
        });

        child.on('close', (code) => {
            clearTimeout(timer);
            if (killed) {
                resolve({ stdout: stdout.trim(), stderr: 'Time Limit Exceeded', time: '> ' + (timeLimit / 1000) + 's' });
            } else {
                resolve({ stdout: stdout.trim(), stderr: stderr.trim(), time: '0.1s' }); // Mock time measurement could be better
            }
        });

        child.on('error', (err) => {
            clearTimeout(timer);
            resolve({ stdout: '', stderr: 'System Error: ' + err.message });
        });
    });
};

const executePython = async (code, input) => {
    const { dir } = createUniqueDir();
    const solutionFile = 'solution.py';
    const inputFile = 'input.txt';

    try {
        fs.writeFileSync(path.join(dir, solutionFile), code);
        fs.writeFileSync(path.join(dir, inputFile), input || '');

        // Command: sh -c "python /mnt/solution.py < /mnt/input.txt"
        // Note: Using sh -c is safe here because paths are hardcoded and not user-controlled
        const args = ['sh', '-c', `python /mnt/${solutionFile} < /mnt/${inputFile}`];

        const result = await runContainer('python:3.9-alpine', args, dir);
        return result;

    } catch (err) {
        return { stdout: '', stderr: err.message };
    } finally {
        fs.rmSync(dir, { recursive: true, force: true });
    }
};

const executeCpp = async (code, input) => {
    const { dir } = createUniqueDir();
    const sourceFile = 'solution.cpp';
    const exeFile = 'solution.out';
    const inputFile = 'input.txt';

    try {
        fs.writeFileSync(path.join(dir, sourceFile), code);
        fs.writeFileSync(path.join(dir, inputFile), input || '');

        // Uploaded code might fail compilation, so we separate compile and run?
        // For simplicity in one go: g++ src -o out && ./out < input
        const args = ['sh', '-c', `g++ /mnt/${sourceFile} -o /mnt/${exeFile} && /mnt/${exeFile} < /mnt/${inputFile}`];

        const result = await runContainer('gcc:latest', args, dir, 5000); // Give GCC more time
        return result;

    } catch (err) {
        return { stdout: '', stderr: err.message };
    } finally {
        fs.rmSync(dir, { recursive: true, force: true });
    }
};

const executeJava = async (code, input) => {
    const { dir } = createUniqueDir();
    const sourceFile = 'Main.java'; // Java requirement
    const inputFile = 'input.txt';

    try {
        fs.writeFileSync(path.join(dir, sourceFile), code);
        fs.writeFileSync(path.join(dir, inputFile), input || '');

        const args = ['sh', '-c', `javac /mnt/${sourceFile} && java -cp /mnt Main < /mnt/${inputFile}`];

        const result = await runContainer('amazoncorretto:17-alpine', args, dir, 5000);
        return result;

    } catch (err) {
        return { stdout: '', stderr: err.message };
    } finally {
        fs.rmSync(dir, { recursive: true, force: true });
    }
};

module.exports = { executePython, executeCpp, executeJava };
