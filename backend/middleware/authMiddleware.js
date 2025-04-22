import jwt from "jsonwebtoken";

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
