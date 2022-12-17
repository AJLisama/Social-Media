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

// Login User
router.post('/login', async (req, res)=> {
	try {
		const checkUserEmail = await userModel.findOne({email: req.body.email});

		if(checkUserEmail === null) {
			res.status(404).json("User not found");
		} else {
			const validPassword = await bcrypt.compare(req.body.password, checkUserEmail.password);
			if(validPassword === false) {
				res.status(400).json("Invalid password");
			} else {
				res.status(200).json("login successful!");
			}
		}
	} catch(err) {
		return res.status(500).json(err);
	}
});

module.exports = router