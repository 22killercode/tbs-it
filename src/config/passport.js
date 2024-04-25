const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const mongoose = require('mongoose');

const User = require('../models/User');


//autenticar el usuario en la aplicasion
passport.use(new LocalStrategy({
    usernameField: 'email'
}, async (email, password, done) => {
    // Match Email's User 
    const user = await User.findOne({ email: email });
    if (!user) {
        return done(null, false, { message: 'No se encontro el usuario o usuario incorrecto.' });
    } else {
        // Match Password's User
        const match = await user.matchPassword(password);
        if (match) {
            return done(null, user);
        } else {
            return done(null, false, { message: 'Verifique su password es incorrecto.' });
        }
    }
}));

passport.serializeUser((user, done) => {
    done(null, user.id);
});
passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
        done(err, user);
    });
});
