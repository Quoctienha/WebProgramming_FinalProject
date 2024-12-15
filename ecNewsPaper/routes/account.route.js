import express from 'express';
import bcrypt from 'bcryptjs';
import moment from 'moment';

import userService from '../services/user.service.js';

const router = express.Router();


//
router.get('/is-available', async function(req, res){
    const username = req.query.username;
    const user = await userService.findByUsername(username);
    if(!user){
        return res.json(true);
    }
    res.json(false);
})

//Login
router.get('/login', async function (req, res) {
    res.render('vwAccount/login', {
      layout: 'account_layout'
    });
});

router.post('/login', async function(req, res) {
    const user =await userService.findByUsername(req.body.username);
    if(!user){
        return res.render('vwAccount/login',{
            layout: 'account_layout',
            showErrors: true
        });
    }
    
    if(!bcrypt.compareSync(req.body.raw_password, user.Password_hash)){
        return res.render('vwAccount/login', {
            layout: 'account_layout',
            showErrors: true
        });
    }
    //res.session.isAuthenticated = true;
    //res.session.authUser = user;
    res.redirect('/');
})

//register
router.get('/register', async function (req, res) {
    res.render('vwAccount/register',{
        layout: 'account_layout'
    });
});

router.post('/register', async function(req, res){
    const ymd_dob = moment(req.body.raw_dob, 'DD/MM/YYYY').format('YYYY-MM-DD');
    const hash_password = bcrypt.hashSync(req.body.raw_password,8);
    const entity={
        UserName: req.body.username,
        Password_hash: hash_password,
        Fullname: req.body.Fullname,
        Phone: req.body.Phone,
        Address: req.body.Address,
        Email: req.body.Email,
        DayOfBirth: ymd_dob,
        Permission: 0
    }

    const ret = await userService.add(entity);
    res.render('vwAccount/login',{
        layout: 'account_layout'
    });

})

export default router;