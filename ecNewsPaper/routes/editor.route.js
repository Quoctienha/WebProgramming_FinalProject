import express from 'express';
import * as editorService from '../services/editor.service.js'; // Import tất cả các hàm từ service
import { ensureEditor } from '../middlewares/auth.mdw.js';

const router = express.Router();

// Middleware: Kiểm tra quyền biên tập viên
router.use(ensureEditor);

/**
 * Route: Hiển thị danh sách bài viết cần duyệt
 * Method: GET
 */
router.get('/drafts', async (req, res) => {
  try {
    const editorId = req.user.id; // Lấy ID biên tập viên từ session hoặc token
    const drafts = await editorService.getDraftPostsByEditor(editorId);
    res.render('vwEditor/drafts', { drafts });
  } catch (error) {
    console.error('Error fetching draft posts:', error);
    res.status(500).send('Lỗi khi lấy danh sách bài viết.');
  }
});

/**
 * Route: Duyệt bài viết
 * Method: POST
 */
router.post('/approve', async (req, res) => {
  try {
    const { postId, categoryId, tags, publishTime } = req.body;

    // Kiểm tra dữ liệu đầu vào
    if (!postId || !categoryId || !tags || !publishTime) {
      return res.status(400).send('Thiếu thông tin để duyệt bài viết.');
    }

    // Duyệt bài viết
    await editorService.approvePost(postId, categoryId, tags, publishTime);
    res.json({ message: 'Bài viết đã được duyệt.' });
  } catch (error) {
    console.error('Error approving post:', error);
    res.status(500).send('Lỗi khi duyệt bài viết.');
  }
});

/**
 * Route: Từ chối bài viết
 * Method: POST
 */
router.post('/reject', async (req, res) => {
  try {
    const { postId, reason } = req.body;

    // Kiểm tra dữ liệu đầu vào
    if (!postId || !reason) {
      return res.status(400).send('Thiếu thông tin để từ chối bài viết.');
    }

    // Từ chối bài viết
    await editorService.rejectPost(postId, reason);
    res.json({ message: 'Bài viết đã bị từ chối.' });
  } catch (error) {
    console.error('Error rejecting post:', error);
    res.status(500).send('Lỗi khi từ chối bài viết.');
  }
});

export default router;
