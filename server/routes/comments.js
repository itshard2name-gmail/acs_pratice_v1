const express = require('express');
const router = express.Router();
const db = require('../db');
const { authenticateToken } = require('../middleware/auth');

// Get comments for a specific question
router.get('/:questionId', async (req, res) => {
    const { questionId } = req.params;
    try {
        const result = await db.query(
            `SELECT c.id, c.content, c.created_at, u.email 
             FROM comments c 
             JOIN users u ON c.user_id = u.id 
             WHERE c.question_id = $1 
             ORDER BY c.created_at DESC`,
            [questionId]
        );
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch comments' });
    }
});

// Post a new comment
router.post('/', authenticateToken, async (req, res) => {
    const { questionId, content } = req.body;
    const userId = req.user.id;

    if (!content || !content.trim()) {
        return res.status(400).json({ error: 'Content is required' });
    }

    try {
        const result = await db.query(
            'INSERT INTO comments (user_id, question_id, content) VALUES ($1, $2, $3) RETURNING *',
            [userId, questionId, content]
        );

        // Return with user email for immediate UI update
        const newComment = result.rows[0];
        const userRes = await db.query('SELECT email FROM users WHERE id = $1', [userId]);
        newComment.email = userRes.rows[0].email;

        res.status(201).json(newComment);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to post comment' });
    }
});

module.exports = router;
