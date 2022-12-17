const router = require("express").Router();
const userModel = require('../models/User.js');
const bcrypt = require('bcrypt');

// Update User
router.put('/:id', async (req, res)=> {
	if(req.body.userId === req.params.id || req.body.isAdmin === true) {
		if(req.body.password) {
			try {
				const salt = await bcrypt.genSalt(10);
				req.body.password = await bcrypt.hash(req.body.password, salt);
			} catch(err) {
				res.status(500).json(err)
			}
		}
		try {
			const user = await userModel.findByIdAndUpdate(req.params.id, {$set: req.body});
			res.status(200).json("Account has been updated");
		} catch(err) {
			res.status(500).json(err)
		}
	} else {
		return res.status(403).json("You can only update your own profile")
	}
});

// Delete User
router.delete('/:id', async (req, res)=> {
	if(req.body.userId === req.params.id || req.body.isAdmin === true) {
		try {
			await userModel.findByIdAndDelete(req.params.id);
			res.status(200).json("Account has been deleted!");
		} catch(err) {
			res.status(500).json(err);
		}
	} else {
		return res.status(500).json("You only delete your own account!");
	}
});

// Retrieve All User
router.get("/allUser", async (req, res)=> {
	try {
		const retrieveUsers = await userModel.find({})
		res.status(200).json(retrieveUsers);
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
