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
const QUICK_TASKS_FILE = path.join(__dirname, 'src/utils/quickTasksData.json');

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Ensure quickTasksData.json exists
if (!fs.existsSync(QUICK_TASKS_FILE)) {
    fs.writeFileSync(QUICK_TASKS_FILE, JSON.stringify({ tasks: [] }, null, 2));
}

// POST: Upload image
app.post('/api/upload', (req, res) => {
    const { image } = req.body;
    if (!image) return res.status(400).json({ error: 'No image data provided' });

    // Remove header (data:image/png;base64,)
    const base64Data = image.replace(/^data:image\/\w+;base64,/, "");
    const extension = image.match(/^data:image\/(\w+);base64,/)[1];
    const fileName = `bg_${Date.now()}.${extension}`;
    const filePath = path.join(__dirname, 'uploads', fileName);

    fs.writeFile(filePath, base64Data, 'base64', (err) => {
        if (err) {
            console.error('Upload error:', err);
            return res.status(500).json({ error: 'Failed to save image' });
        }
        res.json({ url: `http://localhost:5175/uploads/${fileName}` });
    });
});

// GET: List uploaded images
app.get('/api/uploads', (req, res) => {
    fs.readdir(path.join(__dirname, 'uploads'), (err, files) => {
        if (err) return res.status(500).json({ error: 'Failed to list uploads' });
        const urls = files.filter(f => /\.(jpg|jpeg|png|gif|webp)$/i.test(f))
            .map(f => `http://localhost:5175/uploads/${f}`);
        res.json(urls);
    });
});

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

// GET: Read quick tasks
app.get('/api/quick-tasks', (req, res) => {
    fs.readFile(QUICK_TASKS_FILE, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading quick tasks file:', err);
            return res.status(500).json({ error: 'Failed to read quick tasks' });
        }
        res.json(JSON.parse(data));
    });
});

// POST: Save quick tasks
app.post('/api/quick-tasks', (req, res) => {
    const newData = req.body;
    if (!newData || !Array.isArray(newData.tasks)) {
        return res.status(400).json({ error: 'Invalid data format' });
    }

    fs.writeFile(QUICK_TASKS_FILE, JSON.stringify(newData, null, 2), (err) => {
        if (err) {
            console.error('Error writing quick tasks file:', err);
            return res.status(500).json({ error: 'Failed to save quick tasks' });
        }
        res.json({ success: true });
    });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log(`Database File: ${DATA_FILE}`);
});
