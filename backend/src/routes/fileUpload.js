// Import dependencies
const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const File = require('../db').File;

const router = express.Router();

// Configure storage settings for multer
const storage = multer.diskStorage({
  destination: './uploads/', // Folder to save files
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}_${file.originalname}`); // Unique filename
  }
});

// Initialize multer with file size limit and type filter
const upload = multer({
  storage: storage,
  limits: { fileSize: 10000000 }, // Max 10MB
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|pdf|docx|pptx|ppt/;
    const mimeTypes = /image\/jpeg|image\/jpg|image\/png|application\/pdf|application\/vnd.openxmlformats-officedocument.wordprocessingml.document|application\/vnd.ms-powerpoint|application\/vnd.openxmlformats-officedocument.presentationml.presentation/;

    const isValidExtension = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const isValidMime = mimeTypes.test(file.mimetype);
    
    // If both the extension and MIME type are valid
    if (isValidExtension && isValidMime) {
      cb(null, true); // Accept the file
    } else {
      cb(new Error('Only images, PDFs, and document files are allowed!')); // Reject the file
    }
  }
}).single('file'); // Handle single file uploads


// Route to upload file
router.post('/:groupId/upload', (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      console.error("Upload error:", err);
      return res.status(400).json({ error: `Upload error: ${err}` });
    }
    if (!req.file) {
      console.error("No file received");
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // Extract the title from req.body
    const { title } = req.body;

    // Check if title is provided
    if (!title) {
      return res.status(400).json({ error: 'Title is required' });
    }

    try {
      const fileData = new File({
        filename: req.file.filename,
        path: req.file.path,
        groupId: req.params.groupId,
        title: title,
        size: req.file.size,
        timestamp: Date.now(),
      });

      await fileData.save();
      res.status(200).json({
        message: 'File uploaded and metadata saved successfully',
        file: req.file.filename,
      });
    } catch (error) {
      console.error("Database error while saving file metadata:", error);
      res.status(500).json({ error: 'Database error while saving file metadata', details: error.message });
    }
  });
});

// Route to list files for a specific group
router.get('/:groupId/view', async (req, res) => {
  try {
    const files = await File.find({ groupId: req.params.groupId });
    res.status(200).json(files);
  } catch (error) {
    res.status(500).json({ error: 'Error retrieving files' });
  }
});

// Route to delete a file
router.delete('/:fileId', async (req, res) => {
  try {
    const result = await File.findByIdAndDelete(req.params.fileId);
    
    if (!result) {
      return res.status(404).json({ error: 'File not found' });
    }

    res.status(200).json({ message: 'File deleted successfully' });
  } catch (error) {
    console.error("Error deleting file:", error);
    res.status(500).json({ error: 'Error deleting file', details: error.message });
  }
});


// Search Files API
router.get("/search", async (req, res) => {
  try {
    const { query } = req.query;

    if (!query) {
      return res.status(400).json({ message: "Search query is required" });
    }

    // Search by filename or title
    const results = await File.find({
      $or: [
        { filename: { $regex: query, $options: "i" } }, // Search in filename
        { title: { $regex: query, $options: "i" } }, // Search in title
      ],
    });

    res.json(results);
  } catch (error) {
    console.error("Search Error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
