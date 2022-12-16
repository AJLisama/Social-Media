const router = require('express').Router();
const userModel = require('../models/User.js');
const bcrypt = require('bcrypt');

// Register User
router.post('/register', async (req, res)=> {
	try {
		const salt = await bcrypt.genSalt(10);
		const hashedPassword = await bcrypt.hash(req.body.password, salt);
		
		const regUser = new userModel({
			username: req.body.username,
			email: req.body.email,
			password: hashedPassword
		});

		const user = await regUser.save();
		res.status(200).json(user);
	} catch(err) {
		return res.status(500).json(err)
	}
	
});

module.exports = authRoute