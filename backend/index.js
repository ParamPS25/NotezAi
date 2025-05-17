import './config/passport.js';
import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import session from 'express-session';
import passport from 'passport';
import cookieParser from 'cookie-parser';

import notesRoute from './routes/notesRoute.js';
import pdfRoute from './routes/pdfRoute.js';
import authRoute from './routes/authRoute.js';



const app = express();
app.use(cors({
    origin: process.env.CLIENT_URL,  //  frontend URL
    credentials : true,              // allow session cookie from browser to pass through
}));

app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(session({
    secret : process.env.SESSION_SECRET,
    resave : false,                          // do not save session if unmodified
    saveUninitialized : false,              // do not create session until something stored
    cookie: {
        secure: process.env.NODE_ENV === 'production', 
        httpOnly: true,
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax', 
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    }

}));

app.use(passport.initialize());     // initialize passport
app.use(passport.session());        // persistent login sessions

// mongodb connection
mongoose.connect(process.env.MONGO_URI)
    .then(()=>console.log('connected to MongoDB'))
    .catch((err)=>console.log(err));

// routes
app.use('/api/generate', notesRoute);
app.use('/api/download-pdf', pdfRoute);
app.use('/auth', authRoute);

app.get('/', (req, res) => {
    res.send('API is running');
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
