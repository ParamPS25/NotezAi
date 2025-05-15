import express from "express";
import passport from "passport";
import jwt from "jsonwebtoken";

const router = express.Router();

router.get('/google',passport.authenticate('google',{scope : ['profile','email']}));

router.get('/google/callback',
    passport.authenticate('google', {
        successRedirect : `${process.env.CLIENT_URL}/auth/success`,
        failureRedirect : `${process.env.CLIENT_URL}/auth/failure`,
    }),
);

router.get('/success', (req, res) => {
    if (!req.user) {
        return res.status(401).json({ success: false, message: 'No user authenticated' });
    }

    const token = jwt.sign(
        {
            id: req.user._id,
            name: req.user.name,
            email: req.user.email,
        },
        process.env.JWT_SECRET,
        { expiresIn: '7d' } 
    );

    // send token in secure cookie
    res.cookie('token',token,{
        httpOnly : true,                                    // only accessible by the web server
        secure : process.env.NODE_ENV === 'production',     // set to true if using https
        sameSite : 'None',                                   // protect against CSRF attacks
        maxAge : 7 * 24 * 60 * 60 * 1000,                   // 7 days
    })

    res.status(200).json({
        success : true,
        message : 'Google Sign-In Successful',
        user : req.user,                                  // send the user data back to the frontend
        // token : token,                                    // send the JWT back to the frontend
    });
    
});

router.get('/failure', (req, res) => {
    res.status(401).json({
        success : false,
        message : 'Google Sign-In Failed',
    });
});


// logout -> logout the user from the session and clear the cookie
router.get('/logout', (req, res) => {
    req.logout(() => {                                  // logout the user from the session
      res.clearCookie("token", {                        // clear the cookie from the browser
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "None",
      });
  
      res.status(200).json({
        success: true,
        message: "Logout Successful",
      });
    });
  });
  
export default router;

// req.user is already available in /success without decoding the JWT manually

// That’s because this route:
// router.get('/google/callback', passport.authenticate('google', {
//     successRedirect: '/auth/success',
//     failureRedirect: '/auth/failure'
//   }));

// calls this one on successful Google login:
// router.get('/success', (req, res) => {
//     // req.user is already populated here
//   });

// What’s happening under the hood?
// passport.authenticate('google') internally calls your passport.serializeUser() and stores the user in the session.

// So in your /success route, req.user comes from Passport's session, not from JWT.

// You're using passport middleware, so at this point you don’t need to decode JWT — you haven't even created it yet!

// Think of it like this: Google OAuth => Passport sets req.user =>  You now generate JWT from this req.user and send it to frontend.




