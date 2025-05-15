import jwt from "jsonwebtoken";
import dayjs from "dayjs"
import Note from "../models/NoteModel.js";

export const authenticateUser = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ message: "Unauthorized. No token provided." });
  }
  // console.log(token);

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Attach decoded user to the request
    next();             // Proceed to the next middleware or route handler

  } catch (err) {
    return res.status(401).json({ message: "Unauthorized. Invalid token." });
  }
};

export const rateLimitNotes = async (req, res, next) => {
  try{
    const todayStart = dayjs().startOf('day').toDate(); 
    const todayEnd = dayjs().endOf('day').toDate();
    
    // Find notes created today
    const notesToday = await Note.find({
      user : req.user.id,
      createdAt: {
        $gte: todayStart,
        $lt: todayEnd
      }
    });  

    if (notesToday.length >= 5) {
      return res.status(429).json({ 
        message: "Daily note generation limit reached (5 per day)." 
      });
    }

    next();
  } catch (err) {
    console.error("Error in rate limiting:", err);
    return res.status(500).json({ message: "Internal server error." });
  }
};