const localStrategy = require("passport-local").Strategy;
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

// User Model
require("../models/User");
const User = mongoose.model("user");

module.exports = function(passport) {
    passport.use(new localStrategy({  usernameField: "email" }, (email, password, done) => {
        User.findOne({ email: email })
            .then((user) => {
                if (!user) {
                    return done(null, false, { message: "This account doesn't exists!" });
                }
                bcrypt.compare(password, user.password, (error, match) => {
                    if (match) {
                        return done(null, user);
                    } else {
                        return done(null, false, { message: "Incorrect password!" })
                    }
                })
            })
    }));

    // Salvar os dados do user em uma sessão
    passport.serializeUser((user, done) => {
        done(null, user.id);
    });

    // Procurar um user pelo seu id
    passport.deserializeUser((id, done) => {
        User.findById(id, (error, user) => {
            done(error, user);
        })
    });

}