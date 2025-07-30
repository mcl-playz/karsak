// --- Import Core Modules ---
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Friends = require("../models/Friends")
const apiUtil = require('../utils/api');
const bcrypt = require("bcryptjs");
const path = require("path");
const fs = require('fs');

const userIconPath = path.join(process.cwd(), "/public/assets/icons")

// --- API Routes ---
// http://localhost:3000/api/{route}
router.get('/user/:userIdentifier', async (req, res) => {
	const { userIdentifier } = req.params;
	
	var user = await User.getUser(userIdentifier)

	if (!user) {
        return res.status(404).json(apiUtil.error("User not found"));
    }
    res.json(apiUtil.success({ user }));
});

router.post('/login', async (req, res) => {
    const { email, password } = req.body;

	const credentials = await User.getCredentials(email);
	if(!credentials){
		return res.status(422).json(apiUtil.error("There is no account registered to that email"))
	}

	const passwordMatch = await bcrypt.compare(password, credentials.password);
	if(!passwordMatch){
		return res.status(401).json(apiUtil.error("Incorrect password"));
	}

	const user = await User.getUserByEmail(email);
	req.session.user = user;
	return res.json(apiUtil.success({ user }))
});

router.post('/user/create', async (req, res) => {
    const { username, firstName, lastName, email, password } = req.body;

	if(!/^[a-zA-Z0-9._-]+$/.test(username)){
		return res.status(409).json(apiUtil.error("Your username is malformed"))
	} else if(await User.getUserByUsername(username)){
		return res.status(409).json(apiUtil.error("An account with that username already exists"))
	} else if(await User.getUserByEmail(email)){
		return res.status(409).json(apiUtil.error("An account with that email already exists"))
	}

	const user = await User.createUser(firstName, lastName, username, email, password)

	req.session.user = user;
	return res.status(201).json(apiUtil.success({ user }))
});

router.post('/friend/add', async (req, res) => {
	const { targetID } = req.body;

	// TODO: verify user actually exists
	if(!req.session.user){
		return res.status(401).json(apiUtil.error("You are not logged in"))
	}

	await Friends.sendFriendRequest(req.session.user.id, targetID)
});

router.get('/user/:userIdentifier/icon', async (req, res) => {
	const { userIdentifier } = req.params;

	const user = await User.getUser(userIdentifier);
	if(!user){
		return res.status(404).json(apiUtil.error("That user doesn't exist"))
	}
	var iconPath = path.join(userIconPath, user.id.toString() + ".png");
	if(!fs.existsSync(iconPath)){
		iconPath = path.join(userIconPath, "default.png")
	}

	return res.sendFile(iconPath)
});

module.exports = router;