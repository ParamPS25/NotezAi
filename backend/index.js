import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import notesRoute from './routes/notesRoute.js';
import pdfRoute from './routes/pdfRoute.js';

dotenv.config();

const app = express();
app.use(cors({
    origin: 'http://localhost:5173', //  frontend URL
}));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use('/api/generate', notesRoute);
app.use('/api/download-pdf',pdfRoute);

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
