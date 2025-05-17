// import express from "express";
// import passport from "passport";
// import jwt from "jsonwebtoken";

// const router = express.Router();

// router.get('/google',passport.authenticate('google',{scope : ['profile','email']}));

// router.get('/google/callback',
//     passport.authenticate('google', {
//         successRedirect : `${process.env.CLIENT_URL}`,
//         failureRedirect : `${process.env.CLIENT_URL}`
//     }),
// );

// router.get('/success', (req, res) => {
//     if (!req.user) {
//         return res.status(401).json({ success: false, message: 'No user authenticated' });
//     }

//     const token = jwt.sign(
//         {
//             id: req.user._id,
//             name: req.user.name,
//             email: req.user.email,
//         },
//         process.env.JWT_SECRET,
//         { expiresIn: '7d' } 
//     );

//     // send token in secure cookie
//     res.cookie('token',token,{
//         httpOnly : true,                                    // only accessible by the web server
//         secure : process.env.NODE_ENV === 'production',     // set to true if using https
//         sameSite : 'Lax',                                   // protect against CSRF attacks
//         maxAge : 7 * 24 * 60 * 60 * 1000,                   // 7 days
//     })

//     res.status(200).json({
//         success : true,
//         message : 'Google Sign-In Successful',
//         user : req.user,                                  // send the user data back to the frontend
//         // token : token,                                    // send the JWT back to the frontend
//     });
    
// });

// router.get('/failure', (req, res) => {
//     res.status(401).json({
//         success : false,
//         message : 'Google Sign-In Failed',
//     });
// });


// // logout -> logout the user from the session and clear the cookie
// router.get('/logout', (req, res) => {
//     req.logout(() => {                                  // logout the user from the session
//       res.clearCookie("token", {                        // clear the cookie from the browser
//         httpOnly: true,
//         secure: process.env.NODE_ENV === "production",
//         sameSite: "Lax",
//       });
  
//       res.status(200).json({
//         success: true,
//         message: "Logout Successful",
//       });
//     });
//   });
  
// export default router;

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

//**********************************************************************************************************************

import express from "express";
import passport from "passport";
import jwt from "jsonwebtoken";
import User from "../models/userModel";

const router = express.Router();

router.get('/google',passport.authenticate('google',{scope : ['profile','email']}));

router.get('/google/callback',
    passport.authenticate('google', {
     // successRedirect : `${process.env.CLIENT_URL}`,
        failureRedirect : `${process.env.CLIENT_URL}`
    }),
    (req,res) => {
        // generate Jwt token
        const token = jwt.sign(
            {
                id: req.user._id,
                name: req.user.name,
                email: req.user.email,
            },
            process.env.JWT_SECRET,
            { expiresIn : '7d' }
        );

        // Set the token in cookie
        res.cookie("token",token ,{
            httpOnly: true,                                                        // only accessible by the web server
            secure: process.env.NODE_ENV === 'production',                        // set to true if using https
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',    // protect against CSRF attacks
            maxAge: 7 * 24 * 60 * 60 * 1000                                     // 7days
        });

        // !! Redirect to the client URL with a success parameter -> authContext -> useEffect
        res.redirect(`${process.env.CLIENT_URL}/auth-success`)
    }
);

router.get('/success', (req, res) => {
    const token = req.cookies.token;
     
    if(!token){
        return res.status(401).json({
            success: false,
            message: 'No token found'
        })
    }

    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        User.findById(decoded.id)
            .then( user => {

                if(!user){
                    return res.status(404).json({
                        success : false,
                        message : 'user not found'
                    })
                }

                res.status(200).json({
                    success : true,
                    message : "Authentication successful",
                    user: {
                        id: user._id,                           // db->user not req.user that was in session
                        name: user.name,
                        email: user.email,
                        photo: user.photo
                    }
                });
            })
            .catch( err => {
                res.status(500).json({
                    success : "false",
                    message : 'server-error',
                    error : "err.message"
                });
            });
    } catch(err) {
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: err.message
        });
    }

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
        sameSite: "Lax",
      });
  
      res.status(200).json({
        success: true,
        message: "Logout Successful",
      });
    });
  });

export default router;
