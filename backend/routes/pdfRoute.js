import express from 'express';
import PDFDocument from 'pdfkit';

const router = express.Router();

router.post('/',(req, res) => {
  const { notes } = req.body;

  if (!notes || typeof notes !== 'string') {
    return res.status(400).json({ error: 'Notes content is required and must be a string.' });
  }

  const doc = new PDFDocument();

  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', 'attachment; filename=notes.pdf');

  doc.pipe(res);
  doc.fontSize(12).text(notes, { align: 'left' });
  doc.end();
});

export default router;
