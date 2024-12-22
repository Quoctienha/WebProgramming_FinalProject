import express from 'express';
import postService from '../services/post.service.js';
import moment from 'moment';
import auth from '../middlewares/auth.mdw.js';
import multer  from 'multer'
import db from "../utils/db.js"

const router = express.Router();
router.use(express.json());
// Route to display all posts for a writer
router.get('/',  async (req, res) => {
    const userUID = req.session.authUser.UserID;  // Get the UID stored in session during login
    console.log(userUID);  // Logging the UID to check if it’s correct

    // Fetch posts by UID
   const posts = await postService.findPostsByUserID(userUID);
   posts.forEach(post => {
        post.TimePost = moment(post.TimePost).format('DD/MM/YYYY HH:mm:ss');
    });
    res.render('vwWriter/posts', { posts });

});



// Display form to add a new post
router.get('/add',  async (req, res) => {
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


router.use(express.urlencoded({ extended: true }));



// Handle adding a new post
router.post('/add',  async (req, res) => {
    const newPost = {
        PostTitle: req.body.PostTitle,
        CID: req.body.CID,
        SCID: req.body.SCID || null,
        UID: req.session.authUser.UserID, // Retrieve UID from session
        TimePost: new Date(),
        SumContent: req.body.SumContent,
        Content: req.body.Content,
        source: "",
        linksource: "",
        view: 0,
        StatusPost: 'Chờ duyệt',
        Reason: req.body.Reason || null,
        TimePublic: req.body.TimePublic || null,
        Premium: req.body.Premium || 0,
    };


  
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
router.post('/edit',  async (req, res) => {
    try {
        console.log("Request body:", req.body); // Debugging line to check incoming data

        const updatedPost = {
            PostID: req.body.PostID,
            PostTitle: req.body.PostTitle,
            CID: req.body.CID,
            SCID: req.body.SCID || null,
            UID: req.session.authUser.UserID, // Retrieve UID from session
            TimePost: req.body.TimePost,
            SumContent: req.body.SumContent,
            Content: req.body.Content, // Ensure this field is properly received
            source: req.body.source,
            linksource: req.body.linksource,
            view: req.body.view,
            StatusPost: 'Chờ duyệt',
            Reason: req.body.Reason || null,
            TimePublic: req.body.TimePublic || null,
            Premium: req.body.Premium || 0,
        };
        console.log(req.body.Content);
        console.log("memaybeo");
        console.log("Updated post data:", updatedPost); // Debugging line

        await postService.updatePost(updatedPost);

        res.redirect('/writer');
    } catch (error) {
        console.error("Error updating post:", error);
        res.status(500).send("An error occurred while updating the post.");
    }
});

// Route to display the form for editing a post
router.get('/edit/:PostID',  async (req, res) => {
    const { PostID } = req.params;
    const post = await postService.findPostById(PostID);
    const categories = await postService.findAllCategories();
    const subcategories = await postService.findAllSubcategories();
    const tags = await postService.findAllTags();

 

    if (!post) {
        return res.status(404).send('Post not found');
    }

    res.render('vwWriter/editPost', { post, categories, subcategories, tags });
});


// Delete a post
router.post('/delete',  async (req, res) => {
    const { PostID } = req.body;
    await postService.deletePost(PostID);
    res.redirect('/writer');
});

export default router;
