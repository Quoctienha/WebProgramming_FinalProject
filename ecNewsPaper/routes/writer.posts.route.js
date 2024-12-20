import express from 'express';
import postService from '../services/post.service.js';
import auth from '../middlewares/auth.mdw.js';

const router = express.Router();

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
        Duyet: 0,
        StatusPost: 'Chưa được duyệt',
        Reason: req.body.Reason || null,
        TimePublic: req.body.TimePublic || null,
        Premium: req.body.Premium || 0, 
        xoa: 0
    };

    const post = await postService.addPost(newPost);

    // // Handle tags (if any are selected)
    // if (req.body.Tags && req.body.Tags.length > 0) {
    //     await postService.addTagsToPost(post.PostID, req.body.Tags); // Assuming you have a method to save tags for a post
    // }

    res.redirect('/writer/posts');
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
        Duyet: 0,
        StatusPost: 'Chưa được duyệt',
        Reason: req.body.Reason || null,
        TimePublic: req.body.TimePublic || null,
        Premium: req.body.Premium || 0,
        xoa: 0
    };

    await postService.updatePost(updatedPost);

    // // Handle tags (if any are selected)
    // if (req.body.Tags && req.body.Tags.length > 0) {
    //     await postService.updateTagsForPost(updatedPost.PostID, req.body.Tags); // Assuming you have a method to update tags for a post
    // }

    res.redirect('/writer/posts');
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
    res.redirect('/writer/posts');
});

export default router;
