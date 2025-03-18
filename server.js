const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

app.get('/next-minyan', (req, res) => {
    const filePath = path.join(__dirname, 'minyanim.txt');
    const now = new Date();
    const currentTime = now.getHours() * 60 + now.getMinutes();

    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) return res.status(500).send('Error reading file');

        const lines = data.trim().split('\n');
        let nextMinyan = null;

        for (const line of lines) {
            const [time, attendees, location] = line.split('|');
            const [hour, minute] = time.split(':').map(Number);
            const minyanTime = hour * 60 + minute;

            if (minyanTime > currentTime) {
                nextMinyan = { hour, minute, attendees, location };
                break;
            }
        }

        if (!nextMinyan) return res.send('No more minyans today.');

        const remainingMinutes = nextMinyan.minute - now.getMinutes();
        const remainingSeconds = 60 - now.getSeconds();

        res.json({
            message: `המניין הבא בשעה ${nextMinyan.hour}:${String(nextMinyan.minute).padStart(2, '0')}, בעוד ${remainingMinutes} דקות ו-${remainingSeconds} שניות, ב${nextMinyan.location}`
        });
    });
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
