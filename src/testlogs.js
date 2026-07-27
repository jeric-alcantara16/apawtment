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

const defaultSeedLogs = [
    {
        id: "tc-001",
        datetime: "2026-03-23 08:00:00",
        module: "Login Form",
        scenario: "Verify login with valid credentials",
        steps: "1. Enter valid username & password\n2. Click \"Login\"",
        expected: "User should successfully log in and go to dashboard",
        user: "Admin",
        status: "PASS",
        comments: ""
    },
    {
        id: "tc-002",
        datetime: "2026-03-23 08:15:00",
        module: "Login Form",
        scenario: "Verify login with invalid credentials",
        steps: "1. Enter wrong username/password\n2. Click \"Login\"",
        expected: "System should display error message",
        user: "Fur Parent",
        status: "FAIL",
        comments: "Message should say: \"Invalid Username or Password\""
    },
    {
        id: "tc-003",
        datetime: "2026-03-23 08:30:00",
        module: "Sign up form",
        scenario: "User account creation",
        steps: "1. Tap sign up button\n2. Enter email, password and retype the password then tap proceed button.\n3. Enter personal information such as first name, last name, middle name, suffix, cellphone number, and gender. Tap proceed button.\n4. Enter user address such as region, province, city, barangay, postal code, and street. Then tap the proceed button.\n5. Enter user age; to enter user age, swipe left or right to choose the user's age. Then tap proceed button.\n6. Confirm information, if the user's information is correct tap complete signup button, if no tap back button to edit the wrong user information.",
        expected: "The system should add the new account to the database.",
        user: "Fur Parent",
        status: "PASS",
        comments: ""
    },
    {
        id: "tc-004",
        datetime: "2026-03-23 09:00:00",
        module: "Dashboard",
        scenario: "Overview of the app functionality",
        steps: "1. After login, swipe up and down to see the dashboard.",
        expected: "System should display the events overview, search your Fur Friend, Lost and Found, and the donate buttons.",
        user: "Fur Parent",
        status: "PASS",
        comments: ""
    },
    {
        id: "tc-005",
        datetime: "2026-03-23 09:30:00",
        module: "Events",
        scenario: "Verify events viewer",
        steps: "1. Tap selected event\n2. Tap close button",
        expected: "System must display the created event from the sub-admin and admin side.",
        user: "Admin",
        status: "PASS",
        comments: ""
    },
    {
        id: "tc-006",
        datetime: "2026-03-23 10:00:00",
        module: "Search your Fur Friend",
        scenario: "Verify list of pets that are ready to adopt",
        steps: "1. Tap Fur Friends Button.\n2. Tap pet card\n3. Tap Adopt\n4. Check 'I accept all terms and conditions'\n5. Tap Proceed\n6. Tap Submit\n7. Tap Submit\n8. Tap pet card\n9. Tap 'No, Thanks'",
        expected: "The system should display the list of pets that are ready for adoption.",
        user: "Fur Parent",
        status: "FAIL",
        comments: "Bugs in the suggested pets with disabilities, navigation issue"
    },
    {
        id: "tc-007",
        datetime: "2026-03-23 10:30:00",
        module: "Lost and Found",
        scenario: "Verify list of pets that are reported missing.",
        steps: "1. Tap Lost and Found button\n2. Tap selected pet\n3. Tap contact button\n4. Tap mark as found button\n5. Tap \"Yes, Mark as Found\"",
        expected: "The system should display the list of the missing pets. The system should display the information about the missing pet. The system should mark the pet as found.",
        user: "Fur Parent",
        status: "PASS",
        comments: ""
    },
    {
        id: "tc-008",
        datetime: "2026-03-23 11:00:00",
        module: "Donate",
        scenario: "Verify functionality for donation",
        steps: "1. Tap donate button",
        expected: "The system should display an image that contains a QR code for faster and seamless donation.",
        user: "Fur Parent",
        status: "PASS",
        comments: ""
    },
    {
        id: "tc-009",
        datetime: "2026-03-23 11:30:00",
        module: "Pending adoption",
        scenario: "Verify list of pending adoption.",
        steps: "1. Tap drop down menu\n2. Tap pending\n3. Tap approved\n4. Tap declined\n5. Tap cancel\n6. Tap pet name",
        expected: "The system should display the list of pets that are currently pending, approved and declined. The system should display the pet's information and the adopter's information.",
        user: "Sub-Admin (Staff)",
        status: "PASS",
        comments: ""
    },
    {
        id: "tc-010",
        datetime: "2026-03-23 13:00:00",
        module: "Reports",
        scenario: "Verify viewing of user-submitted reports",
        steps: "1. Tap report a pet button\n2. Tap drop down\n3. Tap camera icon\n4. Tap take a photo\n5. Choose from gallery\n6. Take a photo\n7. Upload a photo\n8. Enter pet information\n9. Enter age\n10. Enter personality\n11. Enter contact number\n12. Other details of pet\n13. Health condition\n14. Add location\n15. Add date and time\n16. Tap proceed button\n17. Tap done button\n18. Tap 'My Reports'",
        expected: "The system should display two buttons (report a pet, and my reports). The system should add the reported pet on the database. The system should display the user submitted reports.",
        user: "Fur Parent",
        status: "PASS",
        comments: ""
    },
    {
        id: "tc-011",
        datetime: "2026-03-23 13:30:00",
        module: "Profile screen",
        scenario: "Verify the profile screen functionality",
        steps: "1. Tap profile picture\n2. Tap edit button\n3. Tap sign out button",
        expected: "System should display the personal information of the user including their name, sex, age, phone number, email, and their address. System should return to login screen.",
        user: "Fur Parent",
        status: "PASS",
        comments: ""
    },
    {
        id: "tc-012",
        datetime: "2026-03-23 14:00:00",
        module: "AI Page",
        scenario: "Send plain text, image, and video to the chatbot, and an interactive dog that can give pet tips",
        steps: "1. Click the dog\n2. Send plain text\n3. Click suggested response\n4. Send image\n5. Send video.\n6. Tap thumbs up icon\n7. Tap thumbs down icon\n8. Tap positive feedback buttons\n9. Submit Feedback\n10. Tap negative feedback\n11. Submit Feedback",
        expected: "The system should display tips of the interactive dog, send text, image, suggested response and video. The system should have feedback based on the given response.",
        user: "Fur Parent",
        status: "PASS",
        comments: ""
    },
    {
        id: "tc-013",
        datetime: "2026-03-23 14:30:00",
        module: "Adoption Page",
        scenario: "Overview of list of adoption request of pets in Pending, Approved and Declined status",
        steps: "1. Tap Pending\n2. Tap Cancel\n3. Tap pet card\n4. Tap dropdown and tap Approved\n5. Tap Update\n6. Tap Add Icon\n7. Tap to add image or video\n8. Tap 'Post'\n9. Tap 'Cancel'",
        expected: "The system should display 'Pending', 'Approved' and 'Declined' pets and should display the information of the pet.",
        user: "Sub-Admin (Staff)",
        status: "PASS",
        comments: ""
    },
    {
        id: "tc-014",
        datetime: "2026-03-23 15:00:00",
        module: "Verifications Page",
        scenario: "Verify the identity of Fur Parent to access adoption",
        steps: "1. Tap Not Verified card\n2. Tap List of IDs\n3. Upload front ID\n4. Upload back ID\n5. Upload face image",
        expected: "The system should upload files and transition correctly.",
        user: "Fur Parent",
        status: "FAIL",
        comments: "Message should say; 'Invalid ID' and navigation issue"
    },
    {
        id: "tc-015",
        datetime: "2026-03-23 15:30:00",
        module: "Notifications Page",
        scenario: "Overview of list of notifications",
        steps: "1. Tap bell icon\n2. Tap Adoption request notification\n3. Tap report notification\n4. Tap donation notification",
        expected: "The system should display notifications and when if clicked, it should navigate to their destination.",
        user: "Fur Parent",
        status: "FAIL",
        comments: "Message should say: 'Temporary Ban'"
    },
    {
        id: "tc-016",
        datetime: "2026-03-23 16:00:00",
        module: "QR Scanner",
        scenario: "Scan the QR Code to show pet information",
        steps: "1. Tap QR floating button\n2. Scan Pet QR Code",
        expected: "The system should display pet information after successfully scanned the QR Code of the pet",
        user: "Sub-Admin (Staff)",
        status: "FAIL",
        comments: "Message should say: 'Failed to scan pet. Pet not found.'"
    },
    {
        id: "tc-017",
        datetime: "2026-03-23 16:30:00",
        module: "Shelter Projects",
        scenario: "Overview of listed posts of the shelter, adoption and others.",
        steps: "1. Tap Shelter Projects\n2. Tap post",
        expected: "The system should display posts of the shelter",
        user: "Fur Parent",
        status: "PASS",
        comments: ""
    },
    {
        id: "tc-018",
        datetime: "2026-03-23 17:00:00",
        module: "Adoption Journey",
        scenario: "Overview of listed posts of the fur parent's adoption updates",
        steps: "1. Tap Adoption Journey\n2. Tap Add button\n3. Tap 'Add Image or Video'\n4. Tap 'Post'",
        expected: "The system should display fur parent's adoption updates",
        user: "Fur Parent",
        status: "PASS",
        comments: ""
    }
];

router.post('/reset', async (req, res) => {
    const conn = await pool.getConnection();
    try {
        await conn.beginTransaction();
        await conn.query('DELETE FROM test_logs');

        for (const log of defaultSeedLogs) {
            await conn.query(
                `INSERT INTO test_logs
                 (test_logs_id, datetime, module, scenario, steps, expected, user_role, status, comments)
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [
                    log.id,
                    log.datetime,
                    log.module,
                    log.scenario,
                    log.steps,
                    log.expected,
                    log.user,
                    log.status,
                    log.comments
                ]
            );
        }

        await conn.commit();
        const [rows] = await pool.query('SELECT * FROM test_logs ORDER BY datetime ASC');
        res.json(rows.map(dbToApi));
    } catch (err) {
        await conn.rollback();
        console.error(err);
        res.status(500).json({ error: 'Reset failed' });
    } finally {
        conn.release();
    }
});

module.exports = router;