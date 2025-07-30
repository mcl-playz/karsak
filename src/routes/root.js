const express = require('express');
const User = require("../models/User")
const router = express.Router();

router.get("/", (req, res) => {
    res.render("index");
});
router.get("/login", (req, res) => {
    res.render("login");
});
router.get("/logout", (req, res) => {
    req.session.destroy();
    res.redirect("/login");
});
router.get("/signup", (req, res) => {
    res.render("signup");
});
router.get("/friends", (req, res) => {
    res.render("friends");
});
router.get("/profile", (req, res) => {
    if(!req.session.user){
        res.redirect("/login")
    }
    res.redirect("/user/@" + req.session.user.username)
});
router.get("/user/@:username", async (req, res) => {
    const { username } = req.params;

    const user = await User.getUserByUsername(username);
    if(!user){
        return res.redirect("/404")
    }

    var isSelf = false
    if(req.session.user && req.session.user.username == user.username){
        isSelf = true
    }

    res.render("profile", { user, isSelf });
})

module.exports = router;