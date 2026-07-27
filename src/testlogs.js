const express = require('express');
const router = express.Router();
const pool = require('./db');

// --- Helpers to map between DB rows <-> frontend log objects ---

// DB 'datetime' is 'YYYY-MM-DD HH:MM:SS' (dateStrings:true). Frontend wants 'YYYY-MM-DDTHH:MM'.
function dbToApi(row) {
    return {
        id: row.test_logs_id,
        datetime: row.datetime ? row.datetime.slice(0, 16).replace(' ', 'T') : '',
        module: row.module,
        scenario: row.scenario,
        steps: row.steps,
        expected: row.expected,
        user: row.user_role,
        status: row.status,
        comments: row.comments || ''
    };
}

// Frontend sends 'YYYY-MM-DDTHH:MM'. MySQL DATETIME wants 'YYYY-MM-DD HH:MM:SS'.
function apiDatetimeToDb(datetime) {
    if (!datetime) return new Date().toISOString().slice(0, 19).replace('T', ' ');
    const normalized = datetime.length === 16 ? `${datetime}:00` : datetime;
    return normalized.replace('T', ' ');
}

function generateId() {
    return 'tc-' + Date.now() + '-' + Math.floor(Math.random() * 100000);
}

// GET /api/test-logs - list all
router.get('/', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM test_logs ORDER BY datetime ASC');
        res.json(rows.map(dbToApi));
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch test logs' });
    }
});

// POST /api/test-logs - create one
router.post('/', async (req, res) => {
    try {
        const { datetime, module, scenario, steps, expected, user, status, comments } = req.body;

        if (!module || !scenario || !steps || !expected) {
            return res.status(400).json({ error: 'module, scenario, steps, and expected are required' });
        }

        const id = generateId();
        await pool.query(
            `INSERT INTO test_logs
             (test_logs_id, datetime, module, scenario, steps, expected, user_role, status, comments)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                id,
                apiDatetimeToDb(datetime),
                module,
                scenario,
                steps,
                expected,
                user || 'Fur Parent',
                status === 'FAIL' ? 'FAIL' : 'PASS',
                comments || ''
            ]
        );

        const [rows] = await pool.query('SELECT * FROM test_logs WHERE test_logs_id = ?', [id]);
        res.status(201).json(dbToApi(rows[0]));
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to create test log' });
    }
});

// PUT /api/test-logs/:id - update one (full row, e.g. modal editor)
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { datetime, module, scenario, steps, expected, user, status, comments } = req.body;

        const [result] = await pool.query(
            `UPDATE test_logs SET
                datetime = ?, module = ?, scenario = ?, steps = ?, expected = ?,
                user_role = ?, status = ?, comments = ?
             WHERE test_logs_id = ?`,
            [
                apiDatetimeToDb(datetime),
                module,
                scenario,
                steps,
                expected,
                user || 'Fur Parent',
                status === 'FAIL' ? 'FAIL' : 'PASS',
                comments || '',
                id
            ]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Test log not found' });
        }

        const [rows] = await pool.query('SELECT * FROM test_logs WHERE test_logs_id = ?', [id]);
        res.json(dbToApi(rows[0]));
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to update test log' });
    }
});

// PATCH /api/test-logs/:id/status - quick status-only update (dashboard dropdown)
router.patch('/:id/status', async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        if (status !== 'PASS' && status !== 'FAIL') {
            return res.status(400).json({ error: "status must be 'PASS' or 'FAIL'" });
        }

        const [result] = await pool.query(
            'UPDATE test_logs SET status = ? WHERE test_logs_id = ?',
            [status, id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Test log not found' });
        }

        res.json({ id, status });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to update status' });
    }
});

// DELETE /api/test-logs/:id
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const [result] = await pool.query('DELETE FROM test_logs WHERE test_logs_id = ?', [id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Test log not found' });
        }

        res.status(204).send();
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to delete test log' });
    }
});

// POST /api/test-logs/bulk-replace - replace entire table (spreadsheet sync, import-replace, reset)
router.post('/bulk-replace', async (req, res) => {
    const logs = req.body.logs;
    if (!Array.isArray(logs)) {
        return res.status(400).json({ error: 'logs must be an array' });
    }

    const conn = await pool.getConnection();
    try {
        await conn.beginTransaction();
        await conn.query('DELETE FROM test_logs');

        for (const log of logs) {
            const id = log.id || generateId();
            await conn.query(
                `INSERT INTO test_logs
                 (test_logs_id, datetime, module, scenario, steps, expected, user_role, status, comments)
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [
                    id,
                    apiDatetimeToDb(log.datetime),
                    log.module,
                    log.scenario,
                    log.steps,
                    log.expected,
                    log.user || 'Fur Parent',
                    log.status === 'FAIL' ? 'FAIL' : 'PASS',
                    log.comments || ''
                ]
            );
        }

        await conn.commit();
        const [rows] = await pool.query('SELECT * FROM test_logs ORDER BY datetime ASC');
        res.json(rows.map(dbToApi));
    } catch (err) {
        await conn.rollback();
        console.error(err);
        res.status(500).json({ error: 'Bulk replace failed' });
    } finally {
        conn.release();
    }
});

module.exports = router;