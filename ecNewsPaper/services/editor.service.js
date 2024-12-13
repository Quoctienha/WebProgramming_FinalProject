// editor.service.js
import db from '../utils/db.js'; // Kết nối cơ sở dữ liệu

// Lấy danh sách bài viết draft theo biên tập viên
async function getDraftsByEditor(editorId) {
  const categories = await db('categories')
    .where('editor_id', editorId)
    .select('id');

  const drafts = await db('posts')
    .whereIn('category_id', categories.map(cat => cat.id))
    .andWhere('status', 'draft')
    .select();

  return drafts;
}

// Duyệt bài viết
async function approvePost(postId, { category, tags, publishTime, approvedBy }) {
  await db('posts')
    .where('id', postId)
    .update({
      category_id: category,
      tags,
      publish_time: publishTime,
      status: 'approved',
      approved_by: approvedBy,
    });
}

// Từ chối bài viết
async function rejectPost(postId, { reason, rejectedBy }) {
  await db('posts')
    .where('id', postId)
    .update({
      status: 'rejected',
      rejection_reason: reason,
      rejected_by: rejectedBy,
    });
}

export default {
  getDraftsByEditor,
  approvePost,
  rejectPost,
};
