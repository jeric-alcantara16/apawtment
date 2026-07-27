const express = require('express');
const router = express.Router();
const pool = require('./db');

function dbToApi(row) {
    return {
        groupName: row.group_name,
        systemTitle: row.system_title,
        adviserName: row.adviser_name,
        researchers: row.researchers,
        reportDate: row.report_date,
        preparedLeader: row.prepared_leader,
        preparedProgrammer: row.prepared_programmer,
        checkedAdviser: row.checked_adviser
    };
}
// GET /api/print-settings
router.get('/', async (req, res) => {
    try {
        const [rows
        ] = await pool.query('SELECT * FROM print_settings WHERE print_settings_id = 1');
        if (rows.length === 0) {
            return res.status(404).json({ error: 'Print settings not found'
            });
        }
        res.json(dbToApi(rows[
            0
        ]));
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch print settings'
        });
    }
});

// PUT /api/print-settings
router.put('/', async (req, res) => {
    try {
        const {
            groupName, systemTitle, adviserName, researchers,
            reportDate, preparedLeader, preparedProgrammer, checkedAdviser
        } = req.body;

        await pool.query(
            `INSERT INTO print_settings
                (print_settings_id, group_name, system_title, adviser_name, researchers, report_date, prepared_leader, prepared_programmer, checked_adviser)
             VALUES (1, ?, ?, ?, ?, ?, ?, ?, ?)
             ON DUPLICATE KEY UPDATE
                group_name = VALUES(group_name),
                system_title = VALUES(system_title),
                adviser_name = VALUES(adviser_name),
                researchers = VALUES(researchers),
                report_date = VALUES(report_date),
                prepared_leader = VALUES(prepared_leader),
                prepared_programmer = VALUES(prepared_programmer),
                checked_adviser = VALUES(checked_adviser)`,
        [groupName, systemTitle, adviserName, researchers, reportDate, preparedLeader, preparedProgrammer, checkedAdviser
        ]
        );

        const [rows
        ] = await pool.query('SELECT * FROM print_settings WHERE print_settings_id = 1');
        res.json(dbToApi(rows[
            0
        ]));
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to update print settings'
        });
    }
});

module.exports = router;