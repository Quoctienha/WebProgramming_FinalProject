import express from 'express';
import bcrypt from 'bcryptjs';
import moment from 'moment';
import hbs_sections from 'express-handlebars-sections';

const router = express.Router();


router.get('/login', async function (req, res) {
    res.render('vwAccount/login', {
      layout: false
    });
});

router.get('/register', async function (req, res) {
    res.render('vwAccount/register',{
        hideCategories: true
    });
});

export default router;