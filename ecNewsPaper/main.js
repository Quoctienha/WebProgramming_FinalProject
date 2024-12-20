// Import thư viện
import express from "express";
import { engine } from "express-handlebars";
import hbs_sections from "express-handlebars-sections";
import moment from "moment";
import session from "express-session";

// Import các service, routes và middleware
import categoryService from "./services/category.service.js";
import postService from "./services/post.service.js";
import tagService from "./services/tag.service.js";

import postsRouter from "./routes/posts.route.js";
import accountRouter from "./routes/account.route.js";
import adminRouter from "./routes/admin.route.js";
import editorRouter from "./routes/editor.route.js"; // Import route cho editor
import { ensureEditor } from "./middlewares/auth.mdw.js"; // Middleware kiểm tra quyền biên tập viên

// Khởi tạo ứng dụng
const app = express();
const port = 3030;

// -------------------------- Cấu hình View Engine ---------------------------
app.engine(
  "hbs",
  engine({
    extname: "hbs",
    defaultLayout: "main_layout",
    helpers: {
      section: hbs_sections(),
      Equal(a, b) {
        return Number(a) === Number(b);
      },
      Increment(value) {
        return value + 1;
      },
      Decrement(value) {
        return Math.max(1, value - 1);
      },
    },
  })
);
app.set("view engine", "hbs");
app.set("views", "./views");

// -------------------------- Cấu hình Middleware ---------------------------
// Trust proxy và cấu hình session
app.set("trust proxy", 1);
app.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: true,
  })
);

// Middleware xử lý dữ liệu từ form
app.use(express.urlencoded({ extended: true }));

// Cung cấp file tĩnh
app.use("/static", express.static("static"));

// Middleware cài đặt session người dùng
app.use((req, res, next) => {
  if (!req.session.auth) {
    req.session.auth = false;
  }

  res.locals.auth = req.session.auth;
  res.locals.authUser = req.session.authUser;
  next();
});

// Middleware xử lý danh mục
app.use(async (req, res, next) => {
  try {
    const categoriesLv1 = await categoryService.findAllCategories();
    const categories = await Promise.all(
      categoriesLv1.map(async (category) => ({
        CID: category.CID,
        CName: category.CName,
        subCategories: await categoryService.findSubCategoriesByCID(
          category.CID
        ),
      }))
    );

    res.locals.lcCategories = categories;
    next();
  } catch (error) {
    console.error("Error loading categories:", error);
    next(error);
  }
});

// -------------------------- Route chính ---------------------------
app.get("/", async (req, res) => {
  try {
    // Top 3 bài viết của tuần trước
    const top3post = await postService.top3PostsLastWeek();
    for (const post of top3post) {
      post.TimePublic = moment(post.TimePublic).format("DD/MM/YYYY HH:mm:ss");
      const tags = await tagService.findTagByPostID(post.PostID);
      post.Tags = tags.map((tag) => ({ TagID: tag.TagID, TName: tag.TName }));
    }
    const lastPost = top3post.pop();

    // Top 10 bài viết theo các tiêu chí
    const limit = 2;
    const nPages = 5;
    const { pageMV = 1, pageNP = 1, pageTC = 1 } = req.query;

    const top10MostView = await fetchTopPosts(
      postService.top10MostView,
      pageMV,
      limit
    );
    const top10NewestPost = await fetchTopPosts(
      postService.top10NewestPost,
      pageNP,
      limit
    );
    const top10CategoriesByView = await postService.top10CategoriesByView(
      limit,
      (pageTC - 1) * limit
    );

    // Tạo danh sách bài viết mới nhất của từng chuyên mục
    const newestPostsOfTop10Cat = await Promise.all(
      top10CategoriesByView.map((cat) =>
        postService.findNewestPostByCID(cat.CID)
      )
    );
    formatPosts(newestPostsOfTop10Cat);

    // Phân trang
    const pageNumbersMV = generatePagination(pageMV, nPages);
    const pageNumbersNP = generatePagination(pageNP, nPages);
    const pageNumbersTC = generatePagination(pageTC, nPages);

    res.render("home", {
      top2post: top3post,
      lastPost,
      top10MostView,
      top10NewestPost,
      newestPostsOfTop10Cat,
      pageNumbersMV,
      current_pageMV: +pageMV,
      pageNumbersNP,
      current_pageNP: +pageNP,
      pageNumbersTC,
      current_pageTC: +pageTC,
      totalPages: nPages,
    });
  } catch (error) {
    console.error("Error loading home page:", error);
    res.status(500).send("Internal Server Error");
  }
});

// -------------------------- Route khác ---------------------------
app.use("/posts", postsRouter);
app.use("/account", accountRouter);
app.use("/admin", adminRouter);
app.use("/editor", ensureEditor, editorRouter);

// -------------------------- Route trang lỗi ---------------------------
app.use("/403", (req, res) => {
  res.render("403", { layout: false });
});
app.get("/vwEditor/drafts.hbs", (req, res) => {
  res.render("vwEditor/drafts", { layout: "main_layout" });
});

// -------------------------- Khởi động server ---------------------------
const PORT = process.env.PORT || 3030;

// Kiểm tra và chạy server
const server = app.listen(PORT, () => {
  console.log(`ecNewsPaper app listening at http://localhost:${PORT}`);
});

// Bắt lỗi nếu cổng đã bị chiếm dụng
server.on("error", (err) => {
  if (err.code === "EADDRINUSE") {
    console.error(`Port ${PORT} is already in use. Trying a different port...`);
    const newPort = PORT + 1; // Thử một cổng khác
    app.listen(newPort, () => {
      console.log(
        `ecNewsPaper app now listening at http://localhost:${newPort}`
      );
    });
  } else {
    console.error("Server error:", err);
  }
});

// -------------------------- Hàm tiện ích ---------------------------

/**
 * Lấy danh sách bài viết với phân trang.
 */
async function fetchTopPosts(serviceMethod, currentPage, limit) {
  const offset = (currentPage - 1) * limit;
  const posts = await serviceMethod(limit, offset);
  formatPosts(posts);
  return posts;
}

/**
 * Định dạng bài viết (chuyển đổi thời gian, thêm tag).
 */
async function formatPosts(posts) {
  for (const post of posts) {
    post.TimePublic = moment(post.TimePublic).format("DD/MM/YYYY HH:mm:ss");
    const tags = await tagService.findTagByPostID(post.PostID);
    post.Tags = tags.map((tag) => ({ TagID: tag.TagID, TName: tag.TName }));
  }
}

/**
 * Tạo danh sách số trang cho phân trang.
 */
function generatePagination(currentPage, totalPages) {
  return Array.from({ length: totalPages }, (_, i) => ({
    value: i + 1,
    active: i + 1 === +currentPage,
  }));
}
