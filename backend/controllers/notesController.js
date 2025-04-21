import { readFileSync } from 'fs';
import { generateSummaryFromImages } from '../utils/gemini.js';

import fs from 'fs';
import path from 'path';


export const generateNotes = async (req, res) => {
  try {
    const images = req.files.map((file) => ({
      buffer: readFileSync(file.path),
      mimeType: file.mimetype
    }));

    const summary = await generateSummaryFromImages(images);

    // console.log('Generated summary:', summary);

    // remove all asterisks from the content
    const cleanedSummary = summary.replace(/\*/g, '');

    // trim any leading or trailing whitespace
    const cleanedSummaryWithoutNewLines = cleanedSummary.trim()
    console.log('Cleaned summary:', cleanedSummaryWithoutNewLines);

    clearUploadFolder();                                // Clear the upload folder after processing
    return res.json({ notes: cleanedSummaryWithoutNewLines });
  
  } catch (err) {
    console.error('Error generating notes:', err.message);
    res.status(500).json({ error: 'Failed to generate notes' });
  }
};

import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Function to clear uploads folder
const clearUploadFolder = () => {
    const directory = path.join(__dirname,'..','uploads');
    fs.readdir(directory, (err, files) => {
      if (err) throw err;
      for (const file of files) {
        fs.unlink(path.join(directory, file), err => {
          if (err) throw err;
        });
      }
    });
};