const router = require('express').Router();
const postModel = require('../models/Post.js');

// Create A Post
router.post('/', async (req, res)=> {
	try {
		const newPost = new postModel(req.body);
		const savedPost = await newPost.save();
		res.status(200).json(savedPost);
	} catch(err) {
		res.status(500).json(err)
	}
});

// Update A Post
router.put('/:id', async (req, res)=> {
	try {
		const userPost = await postModel.findById(req.params.id);
		if(userPost.userId === req.body.userId) {
			await userPost.updateOne({$set: req.body});
			res.status(200).json("Post updated successfully!")
		} else {
			return res.status(403).json("You can only update your own post")
		}
	} catch(err) {
		res.status(500).json(err);
	}
});

// Delete A Post
router.delete('/:id', async (req, res)=> {
	try {
		const deletePost = await postModel.findById(req.params.id);
		if(deletePost.userId === req.body.userId) {
			await deletePost.delete();
			res.status(200).json("Your post has been deleted.")
		} else {
			res.status(403).json("You can only delete your own post.")
		}
	} catch(err) {
		res.status(500).json(err)
	}
});

// Like Unlike A Post
router.put('/:id/like', async (req, res)=> {
	try {
		const likePost = await postModel.findById(req.params.id);
		if(likePost.likes.includes(req.body.userId)) {
			await likePost.updateOne({$pull: {likes: req.body.userId}})
			res.status(200).json("Post has been unliked.");
		} else {
			await likePost.updateOne({$push: {likes: req.body.userId}})
			res.status(200).json("The post has been liked.");
		}
	} catch(err) {
		res.status(500).json(err);
	}
});

// Retrieve All Post (for development)
router.get('/retrieve/all', async (req, res)=> {
	try {
		const allPost = await postModel.find({});
		res.status(200).json(allPost);
	} catch(err) {
		res.status(500).json(err)
	}
});

// Retrieve A Post
router.get('/:id', async (req, res)=> {
	try {
		const retrievePost = await postModel.findById(req.params.id)
		res.status(200).json(retrievePost);
	} catch(err) {
		res.status(500).json(err)
	}
});

// Retrieve Post of Followers for Timeline
router.get('/timeline', async (req, res)=> {
	try {
		const loginUser = await userPost.findById(req.body.userId);
		const userPost = await postModel.find({userId: loginUser._id});
		const friendPost = await Promise.all(loginUser.followings.map((friendId)=> {
			postModel.find({userId: friendId})
		}));
		res.json(userPost.concat(...friendPost))
	} catch(err) {
		res.status(500).json(err);
	}
});

module.exports = router;