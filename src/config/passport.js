const passport      = require('passport');
const LocalStrategy = require('passport-local').Strategy;

//console.log(" que hay en passport", passport)

const mongoose = require('mongoose');

const User = require('../models/User');

//autenticar el usuario en la aplicasion
passport.use(new LocalStrategy({
    usernameField: 'email'
}, async (email, password, done) => {
    //console.log("que llega a passport", email,password)
    // Match Email's User 
    const user = await User.findOne({ email: email });
    //console.log("que usuario encuentra",user)
    if (!user) {
  //      console.log("Entro pero no encuentra usuario", user)
        return done(null, false, { message: 'No se encontro el usuario o usuario incorrecto.' });
    } else {
        // Match Password's User
        try {
            const match = await user.matchPassword(password);
    //        console.log("que hay en match",match);
            if (match) {
      //          console.log("SI hizo match",done);
                return done(null, user);  
            } else {
        //        console.log("NO hizo match");
                return done(null, false, { message: 'Verifique su password, es incorrecto.' });
            }
        } catch (error) {
            console.error("Error al comparar contraseñas:", error);
            return done(error);  // En caso de error, pasa el error al callback
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
