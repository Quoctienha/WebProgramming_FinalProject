import express from 'express';
import { engine } from 'express-handlebars';

import categoryService from './services/category.service.js';
import postService from './services/post.service.js';
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
app.get('/', async function(req, res) {
  const top3post = await postService.top3PostsLastWeek();
  const lastPost = top3post.pop();
  res.render('home',{
    top2post: top3post,
    lastPost:lastPost
  });
  //console.log(top3post);
})

app.listen(port, function() {
  console.log(`ecNewsPaper app listening at http://localhost:${port}`)
})