import express from 'express';
import bcrypt from 'bcryptjs';
import moment from 'moment';

import auth from '../middlewares/auth.mdw.js';
import userService from '../services/user.service.js';

const router = express.Router();

router.get('/register', function (req, res) {
  res.render('vwAccount/register');
});


router.post('/register', async function (req, res) {
  const hash_password = bcrypt.hashSync(req.body.raw_password, 8);
  const ymd_dob = moment(req.body.raw_dob, 'DD/MM/YYYY').format('YYYY-MM-DD');
  const entity = {
    UserName: req.body.username,
    Password_hash: hash_password,
    Fullname: req.body.name,
    Email: req.body.email,
    DayOfBirth: ymd_dob,
    Permission: 0
  }
  const ret = await userService.add(entity);
  console.log(req.body);
  res.render('vwAccount/register');
});

router.get('/is-available', async function (req, res) {
  const username = req.query.username;
  const user = await userService.findByUsername(username);
  if (!user) {
    return res.json(true);
  }

  res.json(false);
});

router.get('/login', function (req, res) {
  res.render('vwAccount/login');
});

router.post('/login', async function (req, res) {
  const user = await userService.findByUsername(req.body.username);
  if (!user) {
    return res.render('vwAccount/login', {
      showErrors: true
    });
  }
  if (!bcrypt.compareSync(req.body.raw_password, user.Password_hash)) {
    return res.render('vwAccount/login', {
      showErrors: true
    });
  }

  req.session.auth = true;
  req.session.authUser = user;

  const retUrl = req.session.retUrl || '/';
  res.redirect(retUrl);
});
71
router.get('/profile', auth, function (req, res) {
  res.render('vwAccount/profile', {
    user: req.session.authUser
  });
});

router.post('/logout', auth, function (req, res) {
  req.session.auth = false;
  req.session.authUser = null;
  res.redirect(req.headers.referer);
});

router.post('/patch', async function(req, res){
  const id = req.body.UserID;
  const changes = {
      UserName: req.body.UserName,
      Fullname: req.body.Fullname,
      Email: req.body.Email,
      DayOfBirth: req.body.DayOfBirth
  }
  await userService.patch(id, changes);
  const user = await userService.findByUsername(req.body.UserName);
  req.session.authUser = user;
  res.redirect('/account/profile');
});

router.get('/quenmatkhau', function (req, res) {
  res.render('vwAccount/quenmatkhau');
});


export default router;