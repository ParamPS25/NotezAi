import { readFileSync } from 'fs';
import { generateSummaryFromImages } from '../utils/gemini.js';
import Note from '../models/NoteModel.js';

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
    const cleanedSummary = summary.replace(/\*/g, '').trim();

    // console.log('Cleaned summary:', cleanedSummary);

    // save to Db
    const savedNote = new Note({
      user: req.user.id,
      content: cleanedSummary,
    });

    await savedNote.save();

    clearUploadFolder();                                // Clear the upload folder after processing

    return res.json({ notes: cleanedSummary });
  
  } catch (err) {
    console.error('Error generating notes:', err.message);
    res.status(500).json({ error: 'Failed to generate notes' });
  }
};

import { fileURLToPath } from 'url';
import { dirname } from 'path';
import NoteModel from '../models/NoteModel.js';

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


export const getUserNotes = async (req, res) => {
  try {
    const userId = req.user.id; 

    const notes = await Note.find({ user: userId }).sort({ createdAt: -1 });

    res.status(200).json({ success: true, notes });
  } catch (err) {
    console.error("Error fetching notes:", err.message);
    res.status(500).json({ success: false, error: "Failed to fetch notes" });
  }
};


export const saveUserNotes = async (req,res) => {
  try {
    const { notes } = req.body;
    const noteId = req.params.noteId; 
    const userId = req.user.id;  

    if (!notes) {
      return res.status(400).json({ success: false, message: "Notes content is required" });
    }

    if (!noteId) {
      return res.status(400).json({ success: false, message: "Note ID is required" });
    }

    const note = await NoteModel.findById(noteId); 
    if (!note) {
      return res.status(404).json({ success: false, message: "Note not found" });
    }

    const updatedNote = await NoteModel.findByIdAndUpdate(
      noteId,
      { content: notes },
      { new: true } 
    );

    if (!updatedNote) {
      return res.status(500).json({ success: false, message: "Failed to update note" });
    }

    const savedNote = await updatedNote.save();

    res.status(200).json({ 
      success: true, 
      message: "Notes saved successfully", 
      note: updatedNote 
    });

  } catch (err) {
    console.error("Error saving notes:", err);
    res.status(500).json({ success: false, message: "Server error" });
  };

};
