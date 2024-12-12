import express from 'express';
import postService from "../services/post.service.js";
import categoryService from "../services/category.service.js";

const router = express.Router();

router.get('/bySubcategory', async function (req, res) {
  const subCategoryId = req.query.id || 0;
  const subCategory = await categoryService.findSubCategoriesBySCID(subCategoryId);
  const nRows = await postService.countBySubCatId(subCategoryId);
  const limit = parseInt(2);
  const nPages = Math.ceil(nRows.total / limit);
  //current page
  const current_page =  Math.max(1, parseInt(req.query.page) || 1);
  //offset
  const offset = (current_page - 1) * limit;  
  // Xác định dải trang hiển thị
  const startPage = Math.max(1, current_page - 1); // Trang bắt đầu
  const endPage = Math.min(nPages, current_page + 1); // Trang kết thúc

  const pageNumbers = [];    
  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push({
        value: i,
        active:i === +current_page
    });
  }

  const posts = await postService.findPostsBySCID(subCategoryId, limit, offset);
  res.render('vwPost/byCat', {
    title: subCategory.SCName,
    pageNumbers:pageNumbers,
    needPagination: nPages > 1,
    current_page: current_page,
    posts: posts,
    totalPages: nPages,
    catID: subCategoryId,
    isBySubCat: true
  });
});

router.get('/byCategory', async function( req, res) {
  const categoryId = req.query.id || 0;
  const category = await categoryService.findCategoriesByCID(categoryId);
  const nRows = await postService.countByCatId(categoryId);
  const limit = parseInt(2);
  const nPages = Math.ceil(nRows.total / limit);
  //current page
  const current_page =  Math.max(1, parseInt(req.query.page) || 1);
  //offset
  const offset = (current_page - 1) * limit;  
  // Xác định dải trang hiển thị
  const startPage = Math.max(1, current_page - 1); // Trang bắt đầu
  const endPage = Math.min(nPages, current_page + 1); // Trang kết thúc

  const pageNumbers = [];    
  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push({
        value: i,
        active:i === +current_page
      });
  }
  const posts = await postService.findPostsByCID(categoryId, limit, offset);
  res.render('vwPost/byCat', {
    title: category.CName,
    pageNumbers:pageNumbers,
    needPagination: nPages > 1,
    current_page: current_page,
    posts: posts,
    totalPages: nPages,
    catID: categoryId,
    isBySubCat: false
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