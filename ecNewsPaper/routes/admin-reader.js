import express from 'express';
import userService from '../services/user.service';

const router = express.Router();

// Hiển thị danh sách danh mục
router.get('/', async function (req, res) {
    const nRows = await userService.countAllReaders();
    const limit = parseInt(5);
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
    const readers = await userService.findReaders(limit, offset);
    res.render('vwAdmin/categories', {
        pageNumbers:pageNumbers,
        needPagination: nPages > 1,
        current_page: current_page,
        totalPages: nPages,
        users: readers,
        role: 'độc giả'

    });
});

export default router;