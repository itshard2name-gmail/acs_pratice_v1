const express = require('express');
const router = express.Router();
const { executePython, executeCpp, executeJava } = require('../services/judgeService');
const { authenticateToken } = require('../middleware/auth');
const db = require('../db');


// Run Code (Sample Test)
router.post('/execute', async (req, res) => {
    const { code, language, input } = req.body;

    try {
        let result;
        if (language === 'python') {
            result = await executePython(code, input);
        } else if (language === 'c' || language === 'cpp') {
            result = await executeCpp(code, input);
        } else if (language === 'java') {
            result = await executeJava(code, input); // Now supported
        } else {
            result = { stdout: '', stderr: `Language ${language} not supported yet` };
        }

        res.json({
            stdout: result.stdout,
            stderr: result.stderr,
            status: result.stderr ? { id: 11, description: 'Runtime Error' } : { id: 3, description: 'Accepted' },
            time: result.time || '0.000',
            memory: '0'
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Judge Error' });
    }
});

// Submit Code (Full Evaluation)
router.post('/submit', authenticateToken, async (req, res) => {
    const { question_id, code, language } = req.body;
    const userId = req.user.id;

    try {
        // 1. Get Test Cases
        const tcResult = await db.query('SELECT * FROM implementation_test_cases WHERE question_id = $1', [question_id]);
        const testCases = tcResult.rows;

        if (testCases.length === 0) {
            return res.status(404).json({ error: 'No test cases found for this problem' });
        }

        let finalStatus = 'Accepted';
        let log = [];

        // 2. Run against each test case
        const normalize = (str) => {
            if (!str) return '';
            return str
                .split('\n')
                .map(line => line.trimEnd())
                .join('\n')
                .trim();
        };

        for (const tc of testCases) {
            let result;
            if (language === 'python') {
                result = await executePython(code, tc.input_data);
            } else if (language === 'c' || language === 'cpp') {
                result = await executeCpp(code, tc.input_data);
            } else if (language === 'java') {
                result = await executeJava(code, tc.input_data);
            } else {
                return res.status(400).json({ error: 'Language not supported' });
            }

            // 3. Verdict
            if (result.stderr) {
                finalStatus = 'Runtime Error';
                log.push(`Case ${tc.id}: RE`);
                break; // Stop on first error
            } else {
                const studentOut = normalize(result.stdout);
                const expectedOut = normalize(tc.output_data);

                if (studentOut !== expectedOut) {
                    finalStatus = 'Wrong Answer';
                    // Show diff in log for debugging (limit length)
                    const showGot = studentOut.length > 50 ? studentOut.substring(0, 50) + '...' : studentOut;
                    const showExp = expectedOut.length > 50 ? expectedOut.substring(0, 50) + '...' : expectedOut;
                    log.push(`Case ${tc.id}: WA (Exp: "${showExp}", Got: "${showGot}")`);
                    break;
                } else {
                    log.push(`Case ${tc.id}: AC`);
                }
            }
        }

        // 4. Save Submission
        await db.query(
            'INSERT INTO submissions (user_id, question_id, code, language, status, output_log) VALUES ($1, $2, $3, $4, $5, $6)',
            [userId, question_id, code, language, finalStatus, log.join('\n')]
        );

        res.json({ status: finalStatus, log });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error during submission' });
    }
});

module.exports = router;
