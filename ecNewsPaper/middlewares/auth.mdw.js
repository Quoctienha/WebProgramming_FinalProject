import moment from "moment";

export default function (req, res, next) {
    if (req.session.auth === false) {
      req.session.retUrl = req.originalUrl;
      return res.redirect('/account/login');
    }
  
    next();
  }


  export function authPremium(req, res, next) {
    if (req.session.auth === false) {
      req.session.retUrl = req.originalUrl;
      return res.redirect('/account/login');
    }
    const expirationDate = moment(req.session.authUser.NgayHHPremium, 'YYYY-MM-DD HH:mm:ss');
    const currentDate = moment();
    if (req.session.authUser.Permission === 0 && currentDate.isAfter(expirationDate)) {
      // nên redirect về trang thông báo lỗi "thiếu quyền "
      req.session.auth = false;
      req.session.authUser = null;
      return res.redirect('/account/login?message=true');
    }
  
    next();
  }