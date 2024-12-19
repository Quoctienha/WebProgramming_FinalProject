import express from 'express';

import categoryService from "../services/category.service.js";
import adminService from '../services/admin.service.js';
import auth from '../middlewares/auth.mdw.js';

const router =express.Router();

// Hiển thị danh sách danh mục
router.get('/categories', auth, async function (req, res) {
    const categories = await adminService.findAllCategories();
    res.render('vwAdmin/categories', {
        categories
    });
});

// Thêm danh mục
router.post('/categories/add', auth, async function (req, res) {
    const newCategory = {
        CName: req.body.CName
    };
    await adminService.addCategories(newCategory);
    res.redirect('/admin/categories');
});

// Xóa danh mục
router.post('/categories/delete', auth, async function (req, res) {
    const { CID } = req.body;
    await adminService.deleteCategories(CID);
    res.redirect('/admin/categories');
});

// Sửa danh mục
router.post('/categories/edit', auth, async function (req, res) {
    const updatedCategory = {
        CID: req.body.CID,
        CName: req.body.CName
    };
    await adminService.updateCategories(updatedCategory);
    res.redirect('/admin/categories');
});

router.get('/tags', auth, async function (req, res) {
    const tags = await adminService.findAllTag();
    res.render('vwAdmin/tags', {
        tags
    });
});

// Thêm tag
router.post('/tags/add', auth, async function (req, res) {
    const newTag = {
        TName: req.body.TName
    };
    await adminService.addTag(newTag);
    res.redirect('/admin/tags');
});

// Xóa tag
router.post('/tags/delete', auth, async function (req, res) {
    const { TagID } = req.body;
    await adminService.deleteTag(TagID);
    res.redirect('/admin/tags');
});

// Sửa tag
router.post('/tags/edit', auth, async function (req, res) {
    const updatedTag = {
        TagID: req.body.TagID,
        TName: req.body.TName
    };
    await adminService.updateTag(updatedTag);
    res.redirect('/admin/tags');
});

// Hiển thị danh sách subcategories theo CID
router.get('/categories/subcategories', auth, async function (req, res) {
    const id = req.query.id || 0;

    const categories = await categoryService.findCategoriesByCID(id);
    const subcategories = await categoryService.findSubCategoriesByCID(id);

    res.render('vwAdmin/subcategories', {
        subcategories,
        categories,
        cid : id
    });
});

// Thêm subcategory
router.post('/categories/subcategories/add', auth, async function (req, res) {
    const cid = req.body.cid || 0;
    
    const newSubCategory = {
        SCName: req.body.SCName,
        CID: req.body.cid,
    };
    await adminService.addSubcategory(newSubCategory);
    res.redirect(`/admin/categories/subcategories?id=${cid}`);
});

// Xóa subcategory
router.post('/categories/subcategories/delete', auth, async function (req, res) {
    const cid = req.body.cid ;

    const { SCID } = req.body;
    await adminService.deleteSubcategory(SCID);
    res.redirect(`/admin/categories/subcategories?id=${cid}`);
});

// Sửa subcategory
router.post('/categories/subcategories/edit', auth, async function (req, res) {
    const cid = req.body.cid ;
    const updatedSubcategory = {
        SCID: req.body.SCID,
        SCName: req.body.SCName
    };
    await adminService.updateSubcategory(updatedSubcategory);
    res.redirect(`/admin/categories/subcategories?id=${cid}`);
});

export default router;