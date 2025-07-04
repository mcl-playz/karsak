const { db } = require('../modules/database');
const bcrypt = require("bcryptjs");

const createUser = async (firstName, lastName, username, email, password) => {
	try {
		const encryptedPassword = await bcrypt.hash(password, 15);
		const [userResult] = await db.query("INSERT INTO users (first_name, last_name, username, email, password) VALUES (?, ?, ?, ?, ?)", [firstName, lastName, username, email, encryptedPassword]);
		const user = userResult[0];

		return user;
	} catch (err) {
		throw err;
	}
};

const getUserByEmail = async (email) => {
	try {
		// Get information about the user
		const [userResult] = await db.query("SELECT id, first_name, last_name, username, email FROM users WHERE email = ?", [email]);
		const user = userResult[0]; // user is null if there is no account registered to the email

		return user;
	} catch (err) {
		throw err;
	}
};

const getUserByUsername = async (username) => {
	try {
		// Get information about the user
		const [userResult] = await db.query("SELECT id, first_name, last_name, username, email FROM users WHERE username = ?", [username]);
		const user = userResult[0]; // user is null if there is no account registered to the email

		return user;
	} catch (err) {
		throw err;
	}
};

const getCredentials = async (email) => {
	try {
		const [credentialsResult] = await db.query("SELECT email, password FROM users WHERE email = ?", [email]);
		const credentials = credentialsResult[0]; // credentials is null if there is no account registered to the email

		return credentials;
	} catch (err) {
		throw err;
	}
};

module.exports = { createUser, getUserByEmail, getUserByUsername, getCredentials };