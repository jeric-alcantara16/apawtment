require('dotenv').config();
const express = require('express');
const cors = require('cors');

const testLogsRouter = require('./testlogs');
const printSettingsRouter = require('./printsettings');

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors({
    origin: true
}));
app.use(express.json());

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