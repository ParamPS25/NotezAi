import dotenv from "dotenv";
dotenv.config(); 
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import User from "../models/userModel.js";

passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: `${process.env.BASE_URL}/auth/google/callback`,
        },
        async(accessToken, refreshToken, profile, done) => {
            try{
                const existingUser = await User.findOne({ googleId: profile.id });
                if (existingUser) {
                    // console.log("User already exists:", existingUser);
                    return done(null, existingUser);           // existing user found, return the user 
                }
                const newUser = await new User({
                    googleId: profile.id,
                    name: profile.displayName,
                    email: profile.emails[0].value,
                    photo: profile.photos[0].value,
                }).save();

                // console.log("New user created:", newUser);
                done(null, newUser);                           // new user created, return the new user    

            } catch(err) {
                console.error(err);
                done(err, null);                               // error occurred, return null user
            }
        }
    )
);

passport.serializeUser((user, done) => {    
    done(null, user.id);                                       // serialize the user id to the session
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);                 // find the user by id from the session
        done(null, user);                                     // return the user
    } catch (err) {
        console.error(err);
        done(err, null);                                      // error occurred, return null user
    }
});
