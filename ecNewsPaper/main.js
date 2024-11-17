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
const port = 3000


app.engine('hbs', engine({
  extname: 'hbs',
  defaultLayout: 'main_layout',
}));
app.set('view engine', 'hbs');
app.set('views', './views');

//khai báo các đường dẫn cho tập tin tĩnh
//http://localhost:3000/static/imgs/1.jpg
app.use('/static', express.static('static'));

//middleware
app.use( async function(req,res,next){
  const categories = await categoryService.findAll();
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