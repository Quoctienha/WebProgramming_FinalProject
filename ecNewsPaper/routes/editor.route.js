import express from "express";
import * as editorService from "../services/editor.service.js"; // Import tất cả các hàm từ service
import { ensureEditor } from "../middlewares/auth.mdw.js";
import session from "express-session";
import auth from "../middlewares/auth.mdw.js";
const router = express.Router();

// Middleware: Kiểm tra quyền biên tập viên
router.use(ensureEditor);
router.use(express.json());
/**
 * Route: Hiển thị danh sách bài viết cần duyệt
 * Method: GET
 */
router.get("/drafts", auth, async (req, res) => {
  try {
    const editorId = req.session.authUser.UserID;
    console.log(editorId);

    if (!editorId) {
      return res.status(401).send("Unauthorized access. Editor ID missing.");
    }

    const drafts = await editorService.getDraftPostsByEditor(editorId);
    const drafts2=await editorService.getAcceptedPostsByEditor(editorId);
    const drafts3=await editorService.getExportedPostsByEditor(editorId);
    const drafts4=await editorService.getDenyPostsByEditor(editorId);
   console.log(drafts);
 
    res.render("vwEditor/drafts", {   drafts,
      drafts2,
      drafts3,
      drafts4 });
  } catch (error) {
    console.error("Error fetching draft posts:", error);
    res.status(500).send("An error occurred while fetching drafts.");
  }
  
});

/**
 * Route: Duyệt bài viết
 * Method: POST
 */
router.post("/approve", async (req, res) => {
  try {
    const { PostID } = req.body; // Correctly extract PostID from req.body
    console.log("PostID received:", PostID); // Log the received PostID

    if (!PostID) {
      return res.status(400).send("Thiếu thông tin để duyệt bài viết."); // Missing PostID
    }

    await editorService.approvePost(PostID);
    res.json({ message: "Bài viết đã được duyệt." });
  } catch (error) {
    console.error("Error approving post:", error);
    res.status(500).send("Lỗi khi duyệt bài viết.");
  }
});



/**
 * Route: Từ chối bài viết
 * Method: POST
 */
router.post("/reject", async (req, res) => {
  try {
    const { PostID } = req.body; // Correctly extract PostID from req.body
    console.log("PostID received:", PostID); // Log the received PostID

    if (!PostID) {
      return res.status(400).send("Thiếu thông tin để duyệt bài viết."); // Missing PostID
    }

    await editorService.rejectPost(PostID);
    res.json({ message: "Bài viết đã được từ chối" });
  } catch (error) {
    console.error("Error approving post:", error);
    res.status(500).send("Lỗi khi từ chối bài viết.");
  }
});

export default router;