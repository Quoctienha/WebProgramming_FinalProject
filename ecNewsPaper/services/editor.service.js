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
        "p.PostID",
        "p.StatusPost",
        "u.UserName",
        "c.EID" // If you need to get the editor ID from categories, this is fine
      );
  } catch (error) {
    console.error("Error fetching draft posts:", error);
    throw error;
  }
};

export const getAcceptedPostsByEditor = async (editorId) => {
  try {
    return await db("posts as p")
      .join("categories as c", "p.CID", "c.CID")
      .join("users as u", "p.UID", "u.UserID")
      .where("EID", editorId) // Make sure 'EID' is the correct column in the 'posts' table
      .where("p.StatusPost", "Chờ xuất bản")
      .select(
        "p.PostTitle",
        "p.UID",
        "c.CName",
        "p.PostID",
        "u.UserName",
        "c.EID" // If you need to get the editor ID from categories, this is fine
      );
  } catch (error) {
    console.error("Error fetching draft posts:", error);
    throw error;
  }
};
export const getDenyPostsByEditor = async (editorId) => {
  try {
    return await db("posts as p")
      .join("categories as c", "p.CID", "c.CID")
      .join("users as u", "p.UID", "u.UserID")
      .where("EID", editorId) // Make sure 'EID' is the correct column in the 'posts' table
      .where("p.StatusPost", "Từ chối")
      .select(
        "p.PostTitle",
        "p.UID",
        "c.CName",
        "p.PostID",
        "u.UserName",
        "c.EID" // If you need to get the editor ID from categories, this is fine
      );
  } catch (error) {
    console.error("Error fetching draft posts:", error);
    throw error;
  }
};
export const getExportedPostsByEditor = async (editorId) => {
  try {
    return await db("posts as p")
      .join("categories as c", "p.CID", "c.CID")
      .join("users as u", "p.UID", "u.UserID")
      .where("EID", editorId) // Make sure 'EID' is the correct column in the 'posts' table
      .where("p.StatusPost", "Đã xuất bản")
      .select(
        "p.PostTitle",
        "p.UID",
        "c.CName",
        "p.PostID",
        "u.UserName",
        "c.EID" // If you need to get the editor ID from categories, this is fine
      );
  } catch (error) {
    console.error("Error fetching draft posts:", error);
    throw error;
  }
};
export const approvePost = async(PostID) =>{

    try
    { 
      await db("posts as p")
      .where("p.PostID", PostID) // Use the PostID to locate the row
      .update({
        "p.StatusPost": "Chờ xuất bản", // Update the StatusPost column with the new value
  });
    }catch (error) {
    console.error("Error fetching draft posts:", error);
    throw error;
  }


}
export const rejectPost = async(PostID) =>{

  try
  { 
    await db("posts as p")
    .where("p.PostID", PostID) // Use the PostID to locate the row
    .update({
      "p.StatusPost": "Từ chối", // Update the StatusPost column with the new value
});
  }catch (error) {
  console.error("Error fetching draft posts:", error);
  throw error;
}


}
export const checkAndPublishPosts = async () => {
  try {
    const now = new Date();

    // Update posts that are ready for publishing
    const updatedRows = await db("posts")
      .where("TimePublic", "<=", now)
      .where("StatusPost", "Chờ xuất bản") // Avoid already published posts
      .update({
        StatusPost: "Đã xuất bản",
      });

    if (updatedRows > 0) {
      console.log(`${updatedRows} posts updated to "Đã xuất bản".`);
    }
  } catch (error) {
    console.error("Error checking and publishing posts:", error);
  }
};

/**
 * Start a periodic task to check and update posts.
 */
export const startPublishingService = () => {
  setInterval(async () => {
    await checkAndPublishPosts();
  }, 10000); // Check every 60 seconds (adjust as needed)
};