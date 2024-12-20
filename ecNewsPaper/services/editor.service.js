import db from "../utils/db.js";
import express from "express";
const router = express.router;
/**
 * Lấy danh sách bài viết draft do biên tập viên quản lý.
 *
 * @param {number} editorId - ID của biên tập viên.
 * @returns {Promise<Array>} - Danh sách bài viết draft.
 */
export const getDraftPostsByEditor = async (editorId) => {
  try {
    return await db("posts as p")
      .join("categories as c", "p.CID", "c.CID")
      .join("users as u", "p.UID", "u.UserID")
      .where("EID", editorId) // Make sure 'EID' is the correct column in the 'posts' table
      .where("p.StatusPost", "Chờ duyệt")
      .select(
        "p.PostTitle",
        "p.UID",
        "c.CName",
        "u.UserName",
        "c.EID" // If you need to get the editor ID from categories, this is fine
      );
  } catch (error) {
    console.error("Error fetching draft posts:", error);
    throw error;
  }
};

/* Show bài viết cần duyệt */
export const getPendingPosts = async () => {
  const query = `
        SELECT 
          p.PostID, 
          p.PostTitle, 
          p.CID,
          p.SCID,
          p.UID, 
          p.SumContent,
          p.Content,
          p.source,
          p.linksource,
          p.Premium,
          p.StatusPost
        FROM posts p
        JOIN categories c ON p.CID = c.CID
        JOIN users u ON p.UID = u.UserID
        WHERE p.StatusPost = 'Chờ duyệt'
      `;
  console.log(query);
  try {
    const result = await db.query(query);
    return result;
  } catch (error) {
    console.error("Error fetching pending posts:", error);
    throw error;
  }
};

/**
 * Duyệt bài viết (approve).
 *
 * @param {number} postId - ID bài viết.
 * @param {number} categoryId - ID chuyên mục.
 * @param {string} tags - Thẻ bài viết.
 * @param {string} publishTime - Thời gian xuất bản.
 * @returns {Promise<void>} - Kết quả duyệt bài viết.
 */
export const approvePost = async (postId, categoryId, tags, publishTime) => {
  const query = `
    UPDATE posts
    SET StatusPost = 'Đã được duyệt', category_id = ?, tags = ?, publish_time = ?
    WHERE id = ?
  `;

  try {
    return await db.query(query, [categoryId, tags, publishTime, postId]);
  } catch (error) {
    console.error("Error approving post:", error);
    throw error;
  }
};

/**
 * Từ chối bài viết (reject).
 *
 * @param {number} postId - ID bài viết.
 * @param {string} reason - Lý do từ chối.
 * @returns {Promise<void>} - Kết quả từ chối bài viết.
 */
export const rejectPost = async (postId, reason) => {
  const query = `
    UPDATE posts
    SET status = 'rejected', rejection_reason = ?
    WHERE id = ?
  `;

  try {
    return await db.query(query, [reason, postId]);
  } catch (error) {
    console.error("Error rejecting post:", error);
    throw error;
  }
};
