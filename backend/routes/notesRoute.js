import express from 'express';
import multer from 'multer';
import { generateNotes ,getUserNotes ,saveUserNotes , updateNoteTitle , deleteNote} from '../controllers/notesController.js';
import {authenticateUser,rateLimitNotes} from '../middleware/authMiddleware.js';

const router = express.Router();

const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});
const upload = multer({ storage });

router.post('/', authenticateUser, rateLimitNotes, upload.array('images'), generateNotes);
router.get('/history', authenticateUser, getUserNotes);
router.post('/save/:noteId', authenticateUser, saveUserNotes); 
router.post('/update/:noteId', authenticateUser, updateNoteTitle); 
router.delete('/delete/:noteId', authenticateUser, deleteNote);
export default router;
