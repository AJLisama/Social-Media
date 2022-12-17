const router = require("express").Router();
const userModel = require('../models/User.js');
const bcrypt = require('bcrypt');

// Retrieve All User
router.get("/allUser", async (req, res)=> {
	try {
		const retrieveUsers = await userModel.find({})
		const {password, updatedAt, isAdmin, ...other} = retrieveUser._doc
		res.status(200).json(other);
	} catch(err) {
		res.status(500).json(err)
	}
})

// Retrieve A User
router.get('/:id', async (req, res)=> {
	try {
		const retrieveUser = await userModel.findById(req.params.id)
		const {password, updatedAt, isAdmin, ...other} = retrieveUser._doc
		res.status(200).json(other)
	} catch(err) {
		res.status(500).json(err)
	}
});


// Follow A User
router.put('/:id/follow', async (req, res)=> {
	if(req.body.userId === req.params.id) {
		res.status(403).json("You can't follow your own profile.");
	} else {
		try {
			const userToFollow = await userModel.findById(req.params.id);
			const loginUser = await userModel.findById(req.body.userId);
			if(userToFollow.followers.includes(req.body.userId)) {
				res.status(403).json("You already following this user.");
			} else {
				await userToFollow.updateOne({$push: {followers: req.body.userId}})
				await loginUser.updateOne({$push: {following: req.params.id}})
				res.status(200).json("User has been followed.")
			}
		} catch(err) {
			return res.status(500).json(err);
		}
	}
});

// Unfollow A User
router.put('/:id/unfollow', async (req, res)=> {
	if(req.body.userId === req.params.id) {
		res.status(403).json("You can't unfollow your own profile.");
	} else {
		try {
			const userToUnfollow = await userModel.findById(req.params.id);
			const loginUser = await userModel.findById(req.body.userId);
			if(userToUnfollow.followers.includes(req.body.userId)) {
				await userToUnfollow.updateOne({$pull: {followers: req.body.userId}})
				await loginUser.updateOne({$pull: {following: req.params.id}})
				res.status(200).json("You successfuly unfollow this user.")
			} else {
				res.status(403).json("You are not following this user.")
			}

		} catch(err) {
			return res.status(500).json(err)
		}
	}
});

module.exports = router;