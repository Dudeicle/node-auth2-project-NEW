const bcryptjs = require("bcryptjs");

const jwt = require("jsonwebtoken");

const router = require("express").Router();

// importing other files
const Users = require("../users/users-model.js");
const { isValid } = require("../users/users-service.js");
const constants = require("../config/constants.js");

// REGISTER A NEW USER
router.post("/register", (req, res) => {
	const credentials = req.body;

	if (isValid(credentials)) {
		const rounds = procees.env.BCRYPT_ROUNDS || 8;

		// hash the password
		const hash = bcryptjs.hashSync(credentials.password, rounds);

		credentials.password = hash;

		// save the user to the database
		Users.add(credentials)
			.then((user) => {
				res.status(201).json({ data: user });
			})
			.catch((error) => {
				res.status(404).json({ message: error.message });
			});
	} else {
		res.status(400).json({
			message: "Please provide username and password and the password should be alphanumeric",
		});
	}
});

// LOGIN AN EXISTING USER -- NO LOGOUT IS REQUIRED SINCE LOGOUT IS CLIENT SIDE
router.post("/login", (req, res) => {
	const { username, password } = req.body;

	if (isValid(req.body)) {
		Users.findby({ username: username })
			.then(([user]) => {
				// compare the password and the hash stored in the database
				if (user && bcryptjs.compareSync(password, user.password)) {
					const token = signToken(user);

					res.status(201).json({
						message: "Welcome to our API!",
						token,
					});
				} else {
					res
						.status(401)
						.json({ message: "Invalid LOGIN credendials! Ensure that the user is registered!" });
				}
			})
			.catch((error) => {
				res.status(500).json({ message: error.message }, "Database error!");
			});
	} else {
		res.status(400).json({
			message: "Please provide username and password, and the password should be alphanumeric",
		});
	}
});

function signToken(user) {
	const payload = {
		subject: user.id,
		username: user.username,
		role: user.role,
	};

	const secret = constants.jwtSecret;

	const options = {
		expiresIn: "1d",
	};

	return jwt.sign(payload, secret, options);
}

module.exports = router;
