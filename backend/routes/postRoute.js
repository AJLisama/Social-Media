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

// Retrieve All Post (for development)
router.get('/retrieveAllPost', async (req, res)=> {
	try {
		const allPost = await postModel.find({});
		res.status(200).json(allPost);
	} catch(err) {
		res.status(500).json(err)
	}
});

module.exports = router;