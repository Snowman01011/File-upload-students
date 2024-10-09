// server.js
const express = require('express');
const nodemailer = require('nodemailer');
const multer = require('multer');
const path = require('path');
require('dotenv').config();

const app = express();
const port = 3000;

// In-memory storage for uploads
const uploads = [];

// Multer setup for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Uploads folder
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Append timestamp to the file name
    },
});

const upload = multer({ storage: storage });

// Middleware to serve static files
app.use(express.static('public'));

// Middleware to parse JSON
app.use(express.json());

// File upload and email sending route
app.post('/upload', upload.single('file'), (req, res) => {
    const { originalname } = req.file;
    const email = req.body.email;

    // Save upload info to in-memory storage
    uploads.push({
        fileName: originalname,
        userEmail: email,
        uploadedAt: new Date(),
    });

    // Set up Nodemailer transporter
    const transporter = nodemailer.createTransport({
        service: 'gmail', // Use your email provider
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    // Email options
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email, // Send to the provided email
        subject: 'File Upload',
        text: `You have uploaded the file: ${originalname}`,
        attachments: [
            {
                filename: originalname,
                path: req.file.path, // Path to the uploaded file
            },
        ],
    };

    // Send email with the uploaded file
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return res.status(500).send('Error sending email: ' + error.message);
        }
        res.send('File uploaded and sent to ' + email);
    });
});

// Leaderboard route
app.get('/leaderboard', (req, res) => {
    res.json(uploads);
});

// Start server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
