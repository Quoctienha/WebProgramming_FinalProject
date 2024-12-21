import express from 'express';
import postService from '../services/post.service.js';
import auth from '../middlewares/auth.mdw.js';
import multer  from 'multer'
import db from "../utils/db.js"

import { ensureWriter } from '../middlewares/auth.mdw.js';
const router = express.Router();
router.use(ensureWriter);
router.use(express.json());
// Route to display all posts for a writer
router.get('/', auth, async (req, res) => {
    const userUID = req.session.authUserUID;  // Get the UID stored in session during login
    console.log(userUID);  // Logging the UID to check if it’s correct

    // Fetch posts by UID
    const posts = await postService.findPostsByUserUID(userUID);
    res.render('vwWriter/posts', { posts });
});



// Display form to add a new post
router.get('/add', auth, async (req, res) => {
    const categories = await postService.findAllCategories();
    const subcategories = await postService.findAllSubcategories();
    const tags = await postService.findAllTags();
    res.render('vwWriter/addPost', { categories, subcategories, tags });
});


// Thêm upload ảnh 
router.get('/upload', function(req,res){
    res.render('vwWriter/addPost');
})
//const upload = multer({ dest: 'uploads/' })
router.post('/upload', function(req, res){
   // console.log(req.body);

   const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './static/imgs/posts')
    },
        filename: function (req, file, cb) {
        cb(null, file.originalname);
        }
    });

   
    const upload = multer({storage});
    upload.array('avatar, 5') (req, res, function(err){
        console.log(req.body);
        if(err){
            console.error(err);
        } else {
            res.render('vwWriter/addPost');
        }
    });
    

});





// Handle adding a new post
router.post('/add', auth, async (req, res) => {
    const newPost = {
        PostTitle: req.body.PostTitle,
        CID: req.body.CID,
        SCID: req.body.SCID || null,
        UID: req.session.authUserUID, // Retrieve UID from session
        TimePost: new Date(),
        SumContent: req.body.SumContent,
        Content: req.body.Content,
        source: req.body.source,
        linksource: req.body.linksource,
        view: 0,
        StatusPost: 'Chờ duyệt',
        Reason: req.body.Reason || null,
        TimePublic: req.body.TimePublic || null,
        Premium: req.body.Premium || 0,
    };

    const query = `
        INSERT INTO posts (PostTitle, CID, SCID, UID, TimePost, SumContent, Content, source, linksource, view, StatusPost, Reason, TimePublic, Premium)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [
        newPost.PostTitle,
        newPost.CID,
        newPost.SCID,
        newPost.UID,
        newPost.TimePost,
        newPost.SumContent,
        newPost.Content,
        newPost.source,
        newPost.linksource,
        newPost.view,
        newPost.StatusPost,
        newPost.Reason,
        newPost.TimePublic,
        newPost.Premium,
    ];

    try {
        // Execute the SQL query to insert the post
        await postService.addPost(newPost);

        // Redirect to the writer page after successful insertion
        res.redirect('/writer');
    } catch (error) {
        console.error('Error inserting post:', error);
        res.status(500).send('Internal Server Error');
    }
});




// Route for updating a post
router.post('/edit', auth, async (req, res) => {
    const updatedPost = {
        PostID: req.body.PostID,
        PostTitle: req.body.PostTitle,
        CID: req.body.CID,
        SCID: req.body.SCID || null,
        UID: req.session.authUserUID, // Retrieve UID from session
        TimePost: req.body.TimePost,
        SumContent: req.body.SumContent,
        Content: req.body.Content,
        source: req.body.source,
        linksource: req.body.linksource,
        view: 0,
        StatusPost: 'Chờ duyệt',
        Reason: req.body.Reason || null,
        TimePublic: req.body.TimePublic || null,
        Premium: req.body.Premium || 0,
    };

    await postService.updatePost(updatedPost);

    // // Handle tags (if any are selected)
    // if (req.body.Tags && req.body.Tags.length > 0) {
    //     await postService.updateTagsForPost(updatedPost.PostID, req.body.Tags); // Assuming you have a method to update tags for a post
    // }

    res.redirect('/writer');
});


// Route to display the form for editing a post
router.get('/edit/:PostID', auth, async (req, res) => {
    const { PostID } = req.params;
    const post = await postService.findPostById(PostID);
    const categories = await postService.findAllCategories();
    const subcategories = await postService.findAllSubcategories();
    const tags = await postService.findAllTags();

    console.log(post.Content);

    if (!post) {
        return res.status(404).send('Post not found');
    }

    res.render('vwWriter/editPost', { post, categories, subcategories, tags });
});


// Delete a post
router.post('/delete', auth, async (req, res) => {
    const { PostID } = req.body;
    await postService.deletePost(PostID);
    res.redirect('/writer');
});

export default router;
