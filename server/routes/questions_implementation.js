const express = require('express');
const router = express.Router();
const db = require('../db');

// GET all implementation questions
router.get('/', async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM questions_implementation ORDER BY id ASC');
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

// POST create implementation question
router.post('/', async (req, res) => {
    const { title, description, time_limit, memory_limit, test_cases } = req.body;

    const client = await db.pool.connect();
    try {
        await client.query('BEGIN');
        const qResult = await client.query(
            'INSERT INTO questions_implementation (title, description, time_limit, memory_limit) VALUES ($1, $2, $3, $4) RETURNING id',
            [title, description, time_limit || 1000, memory_limit || 256]
        );
        const qId = qResult.rows[0].id;

        if (test_cases && test_cases.length > 0) {
            for (const tc of test_cases) {
                await client.query(
                    'INSERT INTO implementation_test_cases (question_id, input_data, output_data, is_sample) VALUES ($1, $2, $3, $4)',
                    [qId, tc.input, tc.output, tc.is_sample || false]
                );
            }
        }
        await client.query('COMMIT');
        res.status(201).json({ id: qId, message: 'Created successfully' });
    } catch (err) {
        await client.query('ROLLBACK');
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    } finally {
        client.release();
    }
});

// GET one implementation question with sample content
router.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const qResult = await db.query('SELECT * FROM questions_implementation WHERE id = $1', [id]);
        if (qResult.rows.length === 0) {
            return res.status(404).json({ error: 'Question not found' });
        }

        // Get sample test cases for display
        const tcResult = await db.query('SELECT * FROM implementation_test_cases WHERE question_id = $1 AND is_sample = TRUE', [id]);

        const question = qResult.rows[0];
        question.samples = tcResult.rows;
        res.json(question);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
