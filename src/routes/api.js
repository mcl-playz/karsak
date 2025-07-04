// --- Import Core Modules ---
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const apiUtil = require('../utils/api');
const bcrypt = require("bcryptjs");

// --- API Routes ---
// http://localhost:3000/api/{route}
router.get('/user/:email', async (req, res) => {
	const { email } = req.params; // Extract the data within the request

	const user = await User.getUserByEmail(email);

	// Return an error if the user could not be found
	if(user === null){
		res.status(404).json(apiUtil.error("User not found"));
	}

	res.json(apiUtil.success({ user }))
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

	const user = User.getUserByEmail(email);
	req.session.user = user;
	return res.json(apiUtil.success({ user }))
});

router.post('/signup', async (req, res) => {
    const { username, firstName, lastName, email, password } = req.body;

	if(await User.getUserByUsername(username)){
		return res.status(409).json(apiUtil.error("An account with that username already exists"))
	} else if(await User.getUserByEmail(email)){
		return res.status(409).json(apiUtil.error("An account with that email already exists"))
	}

	const user = User.createUser(firstName, lastName, username, email, password)

	req.session.user = user;
	return res.status(201).json(apiUtil.success({ user }))
});

module.exports = router;