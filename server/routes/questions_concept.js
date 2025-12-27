const express = require('express');
const router = express.Router();
const db = require('../db');

// GET all questions
router.get('/', async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM questions_concept ORDER BY id ASC');
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

// POST create question
router.post('/', async (req, res) => {
    const { title, content, code_snippet, options, answer_index, explanation } = req.body;
    try {
        const result = await db.query(
            'INSERT INTO questions_concept (title, content, code_snippet, options, answer_index, explanation) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
            [title, content, code_snippet, JSON.stringify(options), answer_index, explanation]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

// GET one question
router.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await db.query('SELECT * FROM questions_concept WHERE id = $1', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Question not found' });
        }
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
