import express from 'express';
import postService from "../services/post.service.js";
import categoryService from "../services/category.service.js";

const router = express.Router();

router.get('/bySubcategory', async function (req, res) {
    const subCategoryId = req.query.id || 0;
    const posts = await postService.findPostsBySCID(subCategoryId);
    const subCategory = await categoryService.findSubCategoriesBySCID(subCategoryId);
    
    res.render('vwPost/byCat', {
      title: subCategory.SCName,
      posts: posts,
    });
  });

router.get('/byCategory', async function( req, res) {
  const categoryId = req.query.id || 0;
  const posts = await postService.findPostsByCID(categoryId);
  const category = await categoryService.findCategoriesByCID(categoryId);

  res.render('vwPost/byCat', {
    title: category.CName,
    posts: posts,
  });

  
})

router.get('/detail', async function (req, res) {
    const postId = req.query.id || 0;
    const post = await postService.findPostsByPostID(postId); 

    //update view
    await postService.IncreaseView(postId);
    
    res.render('vwPost/detail', {
      post: post
    });
});


export default router;