const express = require('express');
const {Blog, Comments} = require('../models/blog');
const multer = require('multer');
const path = require('path');

const router = express.Router();


const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, path.resolve("public/uploads"));
    },
    filename: function(req, file, cb) {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
})

const upload = multer({ storage });



router.get('/addNew', (req, res) => {
    res.render('addNewBlog', { user: req.user });
})

router.get('/:id', async (req, res) => {
    const id = req.params.id;
    const blog = await Blog.findById({_id: id}).populate('author');
    const comments = await Comments.find({blog: blog._id}).populate('author');
    // console.log(comments.length === 0)
    if(comments === 0){
     return res.render('viewBlog', {blog, user: req.user})
    }
    res.render('viewBlog', {blog, user: req.user, comments})
})

router.post('/addNew', upload.single('coverImage'),async (req, res) => {
    const newBlog = await Blog.create({
        title: req.body.title,
        body: req.body.body,
        author: req.user._id,
        coverImage: req.file.filename
    })
    res.send(newBlog);
})


router.post('/comment/:id', async (req, res) => {
    const id = req.params.id;
    const blog = await Blog.findById({_id: id});

    await Comments.create({
        content: req.body.content,
        author: req.user._id,
        blog: blog._id
    })
   

    res.redirect(`/blog/${blog._id}`);

})



module.exports = router;