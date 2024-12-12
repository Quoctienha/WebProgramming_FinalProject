import express from 'express';
import { engine } from 'express-handlebars';

import categoryService from './services/category.service.js';
import postService from './services/post.service.js';

import postsRouter from './routes/posts.route.js';

/*
//Xác định thư mục hiện tại của tệp
import { dirname, format } from 'path';
import { fileURLToPath } from 'url';
const __dirname = dirname(fileURLToPath(import.meta.url));
*/

const app = express()
const port = 3030


app.engine('hbs', engine({
  extname: 'hbs',
  defaultLayout: 'main_layout',
  helpers: {
    Equal(a, b){
      return Number(a) === Number(b);
    },

    Increment(value){
      return value +1;
    },

    Decrement(value){
      return Math.max(1, value - 1);
    },

  }
}));
app.set('view engine', 'hbs');
app.set('views', './views');

//khai báo các đường dẫn cho tập tin tĩnh
//http://localhost:3030/static/imgs/1.jpg
app.use('/static', express.static('static'));

//middleware
app.use( async function(req,res,next){
  const categorieslV1 = await categoryService.findAllCategories();
  const categories =[];

  for(let i = 0; i < categorieslV1.length; i++){
    categories.push({
      CID: categorieslV1[i].CID,
      CName: categorieslV1[i].CName,
      subCategories: await categoryService.findSubCategoriesByCID(categorieslV1[i].CID)
    });
  
   
  }
  
  res.locals.lcCategories = categories;

  next();
});

//route
app.get('/', async function(req, res) {
  //top 3 posts of last week
  const top3post = await postService.top3PostsLastWeek();
  const lastPost = top3post.pop();

  const limit = parseInt(2);
  const nPages = parseInt(5);
  //current pages
  const current_pageMV =  (parseInt(req.query.pageMV) || 1);// top 10 Most Views
  const current_pageNP =  (parseInt(req.query.pageNP) || 1);// top 10 Newest Posts
  const current_pageTC = (parseInt(req.query.pageTC) || 1); // top 10 Categories By Views
  
  //offset
  const offsetMV = (current_pageMV - 1) * limit;  // top 10 Most Views
  const offsetNP =(current_pageNP - 1) * limit;  // top 10 Newest Posts
  const offsetTC =(current_pageTC - 1) * limit; // top 10 Categories By Views

  const top10MostView = await postService.top10MostView(limit, offsetMV);
  const top10NewestPost = await postService.top10NewestPost(limit, offsetNP);
  const top10CategoriesByView = await postService.top10CategoriesByView(limit, offsetTC);
  const newestPostsOfTop10Cat = [];

  for(let i=0; i<top10CategoriesByView.length;i++){
    newestPostsOfTop10Cat.push(await postService.findNewestPostByCID(top10CategoriesByView[i].CID));
  }

  //page numbers
  const pageNumbersMV = [];
  for (let i = 0; i < nPages; i++) {
    pageNumbersMV.push({
      value: i + 1,
      active: (i + 1) === +current_pageMV,
      
    });
  }

  const pageNumbersNP = [];
  for (let i = 0; i < nPages; i++) {
    pageNumbersNP.push({
      value: i + 1,
      active: (i + 1) === +current_pageNP,
      
    });
  }

  const pageNumbersTC = [];
  for (let i = 0; i < nPages; i++) {
    pageNumbersTC.push({
      value: i + 1,
      active: (i + 1) === +current_pageTC,
      
    });
  }

  res.render('home',{
    top2post: top3post,
    lastPost: lastPost,
    top10MostView: top10MostView,
    top10NewestPost: top10NewestPost,
    newestPostsOfTop10Cat: newestPostsOfTop10Cat,

    pageNumbersMV: pageNumbersMV,
    current_pageMV: current_pageMV,

    pageNumbersNP: pageNumbersNP,
    current_pageNP: current_pageNP,

    pageNumbersTC: pageNumbersTC,
    current_pageTC: current_pageTC,
    
    totalPages: nPages
  });
  //console.log(top10CategoriesByView);
  //console.log(newestPostsOfTop10Cat);
})

app.use('/posts', postsRouter);

app.listen(port, function() {
  console.log(`ecNewsPaper app listening at http://localhost:${port}`)
});




