import express from 'express';
import { engine } from 'express-handlebars';

import categoryService from './services/category.service.js';
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
      subCategories: await categoryService.findSubCategoriesByID(categorieslV1[i].CID)
    });
  
   
  }
  
  res.locals.lcCategories = categories;

  next();
});

//route
app.get('/', function(req, res) {
  //res.send('Hello ecNewsPaper')
  res.render('home')
})

app.listen(port, function() {
  console.log(`ecNewsPaper app listening at http://localhost:${port}`)
})
app.get('/subcategory/:id', async function (req, res) {
  const subCategoryId = req.params.id;
  const posts = await categoryService.findPostsByCID(subCategoryId);
  
  res.render('page_layouts', {
    title: `Subcategory ${subCategoryId}`,
    content: `Posts for Subcategory ${subCategoryId}`,
    posts,
  });
});


app.get('/subcategory/:id', async function (req, res) {
  const subCategoryId = req.params.id;
  const posts = await categoryService.findPostsByCID(subCategoryId);

  res.render('page_layouts', {
    title: `Subcategory ${subCategoryId}`,
    content: `Posts for Subcategory ${subCategoryId}`,
    posts,
    layout: 'main_layout', // Explicitly set the layout here
  });
});
app.get('/post/:id', async function (req, res) {
  const postId = req.params.id;
  
  // Fetch the post from the database by PostID
  const post = await categoryService.findPostsByPostID(postId);

  if (!post || post.length === 0) {
    return res.status(404).send('Post not found');
  }

  // Assuming post is an array and you want the first element
  const postData = post[0];

  res.render('post_details', {
    PostTitle: postData.PostTitle,   // Pass PostTitle
    Content: postData.Content,       // Pass Content
    SCID: postData.SCID,             // Pass SCID for the "Back to Subcategory" link
    title: postData.PostTitle,       // Pass the title for the page
  });
});
