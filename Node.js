const express = require('express');
const multer = require('multer');
const { exec } = require('child_process');

const app = express();
const upload = multer();

app.post('/convertToMP4', upload.single('video'), async (req, res) => {
    if (!req.file) {
        return res.status(400).send('Tidak ada file yang diunggah');
    }

    const inputFile = req.file.path;
    const outputFile = 'converted-video.mp4';

    const command = `ffmpeg -i ${inputFile} ${outputFile}`;
    exec(command, async (error, stdout, stderr) => {
        if (error) {
            console.error(`Error: ${error.message}`);
            return res.status(500).send('Konversi gagal');
        }
        console.log(`Konversi berhasil`);

        const convertedBuffer = await fs.promises.readFile(outputFile);
        res.set({
            'Content-Type': 'video/mp4',
            'Content-Disposition': 'attachment; filename=converted-video.mp4',
        });
        res.send(convertedBuffer);
    });
});

// ...
