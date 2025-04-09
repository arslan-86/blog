require('dotenv').config();
const express = require('express');
const path = require('path');
const cors = require('cors');
const cookieParser = require('cookie-parser')
const mongoose = require('mongoose')
const userRouter = require('./routes/userRoutes.js')  
const blogRouter = require('./routes/blogRoutes.js')  
const { verifyUser } = require('./utils/authentication.js');
const {Blog} = require('./models/blog.js');

const app = express();
const PORT = process.env.PORT || 8000;

app.use(cors())
app.use(cookieParser())
app.use(express.static('public')); 
app.use(express.urlencoded({extended: false}));

app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'));

app.use(verifyUser);

app.get("/", async (req, res) => {
    const allBlogs = await Blog.find({}).populate('author');
    // console.log(allBlogs);
    
    res.render('index.ejs', { user: req.user, allBlogs })
})

app.use("/user", userRouter);
app.use("/blog", blogRouter);


mongoose.connect("mongodb://127.0.0.1:27017/blog")
.then(() => console.log('DB Connected'))
.catch((e) => console.log(e)) 
   

app.listen(PORT, () => {
    console.log(`Sever is listening at http://localhost:${PORT}`);
})