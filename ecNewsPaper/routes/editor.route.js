// editor.route.js
import express from 'express';
import editorService from '../services/editor.service.js';

const router = express.Router();

// Middleware kiểm tra quyền biên tập viên
function editorAuthMiddleware(req, res, next) {
  if (req.user && req.user.role === 'editor') {
    next();
  } else {
    res.status(403).send('Access denied.');
  }
}

// Danh sách bài viết draft
router.get('/drafts', editorAuthMiddleware, async (req, res) => {
  const editorId = req.user.id; // Giả sử req.user chứa thông tin người dùng đã đăng nhập
  const drafts = await editorService.getDraftsByEditor(editorId);
  res.render('editor/drafts', { drafts });
});

// Duyệt bài viết
router.post('/approve/:postId', editorAuthMiddleware, async (req, res) => {
  const { postId } = req.params;
  const { category, tags, publishTime } = req.body;

  await editorService.approvePost(postId, {
    category,
    tags,
    publishTime,
    approvedBy: req.user.id,
  });

  res.redirect('/editor/drafts');
});

// Từ chối bài viết
router.post('/reject/:postId', editorAuthMiddleware, async (req, res) => {
  const { postId } = req.params;
  const { reason } = req.body;

  await editorService.rejectPost(postId, {
    reason,
    rejectedBy: req.user.id,
  });

  res.redirect('/editor/drafts');
});

export default router;
