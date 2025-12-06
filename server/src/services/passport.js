import passport from 'passport';
import GoogleStrategy from 'passport-google-oauth20';
import User from "../models/user.model.js"


passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id).then(user => {
    done(null, user);
  });
});

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: '/api/auth/google/callback',
    },
    (accessToken, refreshToken, profile, done) => {
      console.log(profile);
      
      // User.findOne({ googleId: profile.id }).then(existingUser => {
      //   if (existingUser) {
      //     done(null, existingUser);
      //   } else {
      //     new User({ googleId: profile.id })
      //       .save()
      //       .then(user => done(null, user));
      //   }
      // });
    }
  )
);