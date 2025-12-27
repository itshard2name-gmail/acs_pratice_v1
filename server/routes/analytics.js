const express = require('express');
const router = express.Router();
const db = require('../db');
const { authenticateToken } = require('../middleware/auth');

router.get('/stats', authenticateToken, async (req, res) => {
    const userId = req.user.id;
    try {
        // 1. Submission Status Distribution
        const statusRes = await db.query(
            'SELECT status, COUNT(*) as count FROM submissions WHERE user_id = $1 GROUP BY status',
            [userId]
        );

        // 2. Language Usage
        const langRes = await db.query(
            'SELECT language, COUNT(*) as count FROM submissions WHERE user_id = $1 GROUP BY language',
            [userId]
        );

        // 3. Total Solved (Unique Problems with AC)
        const solvedRes = await db.query(
            'SELECT COUNT(DISTINCT question_id) as count FROM submissions WHERE user_id = $1 AND status = $2',
            [userId, 'Accepted']
        );

        res.json({
            statusDistribution: statusRes.rows,
            languageUsage: langRes.rows,
            totalSolved: parseInt(solvedRes.rows[0].count)
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch analytics' });
    }
});

module.exports = router;
