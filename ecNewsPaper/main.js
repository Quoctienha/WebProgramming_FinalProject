import express from 'express';
import { engine } from 'express-handlebars';
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


//route
app.get('/', function(req, res) {
  //res.send('Hello ecNewsPaper')
  res.render('home')
})

app.listen(port, function() {
  console.log(`ecNewsPaper app listening at http://localhost:${port}`)
})