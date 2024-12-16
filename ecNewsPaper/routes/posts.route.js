import express from 'express';
import postService from "../services/post.service.js";
import categoryService from "../services/category.service.js";
import commentService from '../services/comment.service.js';
import tagService from '../services/tag.service.js';
import moment from 'moment';
import { fileURLToPath } from 'url';

import { decode } from 'html-entities'; 
import path from 'path';

//middlewares
import auth from '../middlewares/auth.mdw.js';
import fs from 'fs';
import puppeteer from 'puppeteer';
const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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
  for (let post of posts) {
      // Định dạng thời gian cho từng post
      post.TimePublic = moment(post.TimePublic).format('DD/MM/YYYY HH:mm:ss');
      // Truy vấn các tag của bài viết
      const tags = await tagService.findTagByPostID(post.PostID); 
      // Thêm tags vào bài viết
      post.Tags = tags.map(tag => ({
        TagID: tag.TagID,
        TName: tag.TName
      }));
    }
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
  for (let post of posts) {
    // Định dạng thời gian cho từng post
    post.TimePublic = moment(post.TimePublic).format('DD/MM/YYYY HH:mm:ss');
    // Truy vấn các tag của bài viết
    const tags = await tagService.findTagByPostID(post.PostID); 
    // Thêm tags vào bài viết
    post.Tags = tags.map(tag => ({
      TagID: tag.TagID,
      TName: tag.TName
    }));
  }
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

  
});

router.get('/byTag', async function(req, res) {
  const tagID = req.query.id || 0;
  const tag = await tagService.findTagBytagID(tagID);
  const nRows = await tagService.countByTagId(tagID);
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

  const posts = await tagService.findPostByTagID(tagID, limit, offset);
  for (let post of posts) {
    // Định dạng thời gian cho từng post
    post.TimePublic = moment(post.TimePublic).format('DD/MM/YYYY HH:mm:ss');
    // Truy vấn các tag của bài viết
    const tags = await tagService.findTagByPostID(post.PostID); 
    // Thêm tags vào bài viết
    post.Tags = tags.map(tag => ({
      TagID: tag.TagID,
      TName: tag.TName
    }));
   }
   res.render('vwPost/byTag', {
    title: tag.TName,
    pageNumbers:pageNumbers,
    needPagination: nPages > 1,
    current_page: current_page,
    posts: posts,
    totalPages: nPages,
    TagID: tagID,
  });

});

router.get('/bySearch', async function(req, res) {
  const keyword = req.query.keyword;
  const nRows = await postService.countBySearch(keyword);
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

  const posts = await postService.searchPosts(keyword, limit, offset)
  for (let post of posts) {
    // Định dạng thời gian cho từng post
    post.TimePublic = moment(post.TimePublic).format('DD/MM/YYYY HH:mm:ss');
    // Truy vấn các tag của bài viết
    const tags = await tagService.findTagByPostID(post.PostID); 
    // Thêm tags vào bài viết
    post.Tags = tags.map(tag => ({
      TagID: tag.TagID,
      TName: tag.TName
    }));
   }
   res.render('vwPost/bySearch', {
    title: `Tìm kiếm: ${keyword}`,
    pageNumbers:pageNumbers,
    needPagination: nPages > 1,
    current_page: current_page,
    posts: posts,
    totalPages: nPages,
    keyword: keyword
  });

});

//Note: không gọi trực tiếp /detail nếu không cần thiết, gọi /IncreaseView để tăng view cho post
router.get('/detail', async function (req, res) {
    const postId = req.query.id || 0;
    const post = await postService.findPostsByPostID(postId); 

    // Định dạng thời gian cho từng post
    post.TimePublic = moment(post.TimePublic).format('DD/MM/YYYY HH:mm:ss');
    // Truy vấn các tag của bài viết
    const tags = await tagService.findTagByPostID(post.PostID); 
    // Thêm tags vào bài viết
    post.Tags = tags.map(tag => ({
      TagID: tag.TagID,
      TName: tag.TName
    }));
    const limit = parseInt(2);
    const totalComments = await commentService.countByPostID(postId);
    const nPages = Math.ceil(totalComments.total / limit);
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

    const comments = await commentService.findCommentByPostID(postId, limit, offset);
    // Định dạng thời gian cho từng bình luận
    comments.forEach(comment => {
      comment.Date = moment(comment.Date).format('DD/MM/YYYY HH:mm:ss');
    });

    // Kiểm tra nếu bài viết là premium
    if (post.Premium) {
      auth(req, res, async () => {
        res.render('vwPost/detail', {
        post: post,
        current_page:current_page,
        pageNumbers: pageNumbers,
        needPagination: nPages > 1,
        totalPages: nPages,
        comments: comments
        });
      });
    } 
    else {
      // Bài viết không phải premium
      res.render('vwPost/detail', {
      post: post,
      current_page:current_page,
      pageNumbers: pageNumbers,
      needPagination: nPages > 1,
      totalPages: nPages,
      comments: comments
      });
    }
    
});

router.get('/IncreaseView', async function( req, res) {
  const postId = req.query.id || 0;
  //update view
  await postService.IncreaseView(postId);
   // Chuyển hướng tới trang chi tiết bài viết
   res.redirect(`/posts/detail?id=${postId}`);
});

router.post('/addComment',auth, async function(req, res) {
  const PostID = req.body.PostID;
  const UID = req.body.UID;
  const Comment = req.body.Comment;  

  // Lấy thời gian hiện tại với moment
  const Date = moment().format('YYYY-MM-DD HH:mm:ss');

  const entity = { UID, PostID, Comment, Date};

  const ret = await commentService.add(entity);
  res.redirect(`/posts/detail?id=${PostID}`);
});
router.get('/downloadPDF', async (req, res) => {
  const postId = req.query.id || 0;

  // Fetch the post by ID
  const post = await postService.findPostsByPostID(postId);
  if (!post) {
    return res.status(404).send('Post not found');
  }

  // Decode HTML entities in content
  post.Content = decode(post.Content);

  // Format the post's public time
  post.TimePublic = moment(post.TimePublic).format('DD/MM/YYYY HH:mm:ss');

  // Fetch the tags for the post
  const tags = await tagService.findTagByPostID(post.PostID);
  post.Tags = tags.map(tag => ({
    TagID: tag.TagID,
    TName: tag.TName,
  }));

  // Read the image as base64
  const imagePath = path.resolve(__dirname, `../static/imgs/posts/${post.PostID}/${post.PostID}_1.jpg`);

  const imageBase64 = fs.readFileSync(imagePath, 'base64');
  const imageSrc = `data:image/jpg;base64,${imageBase64}`;

  // HTML Content for the main PDF
  const htmlContent = `
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; }
          h1 { text-decoration: underline; font-size: 24px; }
          .info { font-size: 14px; margin-bottom: 10px; }
        </style>
      </head>
      <body>
        <h1>${post.PostTitle}</h1>
        <p class="info">Published on: ${post.TimePublic}</p>
        <p class="info">Category: ${post.CName} > ${post.SCName}</p>
        <p class="info">Tags: ${post.Tags.map(tag => tag.TName).join(', ')}</p>
        <p class="info">Views: ${post.view}</p>
        <div>${post.Content}</div>
        <!-- Embed the image as base64 -->
        <img src="${imageSrc}" alt="Post image" style="max-width:100%; height:auto; margin-top: 20px;">
      </body>
    </html>
  `;

  try {
    // Launch Puppeteer
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    // Generate the PDF with the HTML content (including base64 image)
    await page.setContent(htmlContent, { waitUntil: 'load' });
    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
    });

    // Close Puppeteer
    await browser.close();

    // Set headers for downloading the PDF
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=post_${post.PostID}.pdf`);

    // Send the PDF buffer
    res.end(pdfBuffer);
  } catch (error) {
    console.error('Error generating PDF with Puppeteer:', error);
    res.status(500).send('Error generating PDF');
  }
});



export default router;