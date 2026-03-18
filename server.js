import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 5175;
const DATA_FILE = path.join(__dirname, 'src/utils/appData.json');

app.use(cors());
app.use(express.json());

// GET: Read data
app.get('/api/tasks', (req, res) => {
    fs.readFile(DATA_FILE, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading file:', err);
            return res.status(500).json({ error: 'Failed to read data' });
        }
        res.json(JSON.parse(data)); // Return the whole JSON object
    });
});

// POST: Save data (overwrite)
app.post('/api/tasks', (req, res) => {
    const newData = req.body;
    // Basic validation
    if (!newData || !Array.isArray(newData.tasks)) {
        return res.status(400).json({ error: 'Invalid data format' });
    }

    fs.writeFile(DATA_FILE, JSON.stringify(newData, null, 2), (err) => {
        if (err) {
            console.error('Error writing file:', err);
            return res.status(500).json({ error: 'Failed to save data' });
        }
        console.log('Data saved to file successfully');
        res.json({ success: true });
    });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log(`Database File: ${DATA_FILE}`);
});
