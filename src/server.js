require('dotenv').config();
const path = require('path');
const express = require('express');
const cors = require('cors');

const testLogsRouter = require('./testlogs');
const printSettingsRouter = require('./printsettings');

const app = express();
const PORT = process.env.PORT || 4000;

const allowedOrigins = process.env.CORS_ORIGIN
    ? process.env.CORS_ORIGIN.split(',').map(o => o.trim())
    : [];

app.use(cors({
    origin: (origin, callback) => {
        if (!origin) return callback(null, true);
        if (allowedOrigins.includes(origin)) {
            return callback(null, true);
        }
        try {
            const hostname = new URL(origin).hostname;
            if (
                hostname === 'localhost' ||
                hostname === '127.0.0.1' ||
                hostname.startsWith('192.168.') ||
                hostname.startsWith('10.') ||
                /^172\.(1[6-9]|2[0-9]|3[0-1])\./.test(hostname)
            ) {
                return callback(null, true);
            }
        } catch (e) {}
        callback(new Error('Not allowed by CORS'));
    }
}));
app.use(express.json());

// Serve static frontend files (index.html, style.css, src/*)
app.use(express.static(path.join(__dirname, '..')));

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

app.use('/api/test-logs', testLogsRouter);
app.use('/api/print-settings', printSettingsRouter);

app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, () => {
    console.log(`APawtMent API running on http://localhost:${PORT}`);
});