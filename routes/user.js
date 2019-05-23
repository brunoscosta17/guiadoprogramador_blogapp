const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
require("../models/User");
const User = mongoose.model("user");
const bcrypt = require("bcryptjs");

router.get("/register", (req, res) => {
    res.render("users/register");
});

router.post("/register", (req, res) => {

    var errors = [];

    if (!req.body.name || typeof req.body.name == undefined || req.body.name == null) {
        errors.push({ error: "Invalid name!" });
    }

    if (!req.body.email || typeof req.body.email == undefined || req.body.email == null) {
        errors.push({ error: "Invalid email!" });
    }

    if (!req.body.password1 || typeof req.body.password1 == undefined || req.body.password1 == null) {
        errors.push({ error: "Invalid password!" });
    }

    if (req.body.password1.length < 8) {
        errors.push({ error: "Password must be at least 8 characters long!" });
    }

    if (req.body.password1 != req.body.password2) {
        errors.push({ error: "Different passwords! Try again" });
    }

    if (errors.length > 0) {
        res.render("users/register", { error: errors })
    } else {
        User.findOne({ email: req.body.email })
            .then((user) => {
                if (user) {
                    req.flash("error_msg", "This email already exists. Try another!");
                    res.redirect("/users/register");
                } else {
                    const newUser = new User({
                        name: req.body.name,
                        email: req.body.email,
                        password: req.body.password1
                    });

                    bcrypt.genSalt(10, (error, salt) => {
                        bcrypt.hash(newUser.password, salt, (error, hash) => {
                            if (error) {
                                req.flash("error_msg", "There was an error during the password encrypt!");
                                res.redirect("/");
                            }

                            newUser.password = hash;

                            newUser.save()
                                .then(() => {
                                    req.flash("success_msg", "User created successfuly!");
                                    res.redirect("/");
                                }).catch((error) => {
                                    console.log(error);
                                    req.flash("error_msg", "There was an error on create user. Try again!");
                                    res.redirect("/users/register");
                                });
                        });
                    });

                }
            })
            .catch((error) => {
                console.log(error);
                req.flash("error_msg", "There was an internal error");
                res.redirect("/");
            });
    }

});


module.exports = router;