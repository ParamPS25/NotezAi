import express from 'express';
import multer from 'multer';
import { generateNotes } from '../controllers/notesController.js';

const router = express.Router();

const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});
const upload = multer({ storage });

router.post('/', upload.array('images'), generateNotes);

export default router;
