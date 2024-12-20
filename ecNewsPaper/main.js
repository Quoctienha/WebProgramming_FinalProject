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

//route
import postsRouter from "./routes/posts.route.js";
import accountRouter from "./routes/account.route.js";
import adminRouter from "./routes/admin.route.js";
import adminCatRouter from "./routes/admin-categories.route.js";
import adminTagRouter from "./routes/admin-tag.route.js";
import adminSubCatRouter from "./routes/admin-subcategories.route.js";
import adminReader from "./routes/admin-reader.js";

//auth
import { authAdmin } from "./middlewares/auth.mdw.js";
import { startPublishingService } from "./services/editor.service.js";
import postRouter from "./routes/writer.posts.route.js";
//Xác định thư mục hiện tại của tệp
//import { dirname, format } from 'path';
//import { fileURLToPath } from 'url';
//const __dirname = dirname(fileURLToPath(import.meta.url));

import editorRouter from "./routes/editor.route.js";

const app = express();
const port = 3030;

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
app.set("trust proxy", 1); // trust first proxy
app.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
  })
);
// Middleware xử lý dữ liệu từ form (x-www-form-urlencoded)
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
    res.locals.lcIsCenter = false;
    res.locals.lcIsAdminPage = false;
    next();
  } catch (error) {
    console.error("Error loading categories:", error);
    next(error);
  }
});

//route
app.get("/", async function (req, res) {
  //top 3 posts of last week
  const top3post = await postService.top3PostsLastWeek();
  // Duyệt qua từng bài viết và thêm tag vào mỗi bài viết
  for (let post of top3post) {
    // Định dạng thời gian cho từng post
    post.TimePublic = moment(post.TimePublic).format("DD/MM/YYYY HH:mm:ss");
    // Truy vấn các tag của bài viết
    const tags = await tagService.findTagByPostID(post.PostID);
    // Thêm tags vào bài viết
    post.Tags = tags.map((tag) => ({
      TagID: tag.TagID,
      TName: tag.TName,
    }));
  }

  const lastPost = top3post.pop();

  const limit = parseInt(2);
  const nPages = parseInt(5);
  //current pages
  const current_pageMV = parseInt(req.query.pageMV) || 1; // top 10 Most Views
  const current_pageNP = parseInt(req.query.pageNP) || 1; // top 10 Newest Posts
  const current_pageTC = parseInt(req.query.pageTC) || 1; // top 10 Categories By Views

  //offset
  const offsetMV = (current_pageMV - 1) * limit; // top 10 Most Views
  const offsetNP = (current_pageNP - 1) * limit; // top 10 Newest Posts
  const offsetTC = (current_pageTC - 1) * limit; // top 10 Categories By Views

  const top10MostView = await postService.top10MostView(limit, offsetMV);
  for (let post of top10MostView) {
    // Định dạng thời gian cho từng post
    post.TimePublic = moment(post.TimePublic).format("DD/MM/YYYY HH:mm:ss");
    // Truy vấn các tag của bài viết
    const tags = await tagService.findTagByPostID(post.PostID);
    // Thêm tags vào bài viết
    post.Tags = tags.map((tag) => ({
      TagID: tag.TagID,
      TName: tag.TName,
    }));
  }

  const top10NewestPost = await postService.top10NewestPost(limit, offsetNP);

  for (let post of top10NewestPost) {
    // Định dạng thời gian cho từng post
    post.TimePublic = moment(post.TimePublic).format("DD/MM/YYYY HH:mm:ss");
    // Truy vấn các tag của bài viết
    const tags = await tagService.findTagByPostID(post.PostID);
    // Thêm tags vào bài viết
    post.Tags = tags.map((tag) => ({
      TagID: tag.TagID,
      TName: tag.TName,
    }));
  }

  const top10CategoriesByView = await postService.top10CategoriesByView(
    limit,
    offsetTC
  );
  const newestPostsOfTop10Cat = [];
  for (let i = 0; i < top10CategoriesByView.length; i++) {
    newestPostsOfTop10Cat.push(
      await postService.findNewestPostByCID(top10CategoriesByView[i].CID)
    );
  }
  for (let post of newestPostsOfTop10Cat) {
    // Định dạng thời gian cho từzng post
    post.TimePublic = moment(post.TimePublic).format("DD/MM/YYYY HH:mm:ss");
    // Truy vấn các tag của bài viết
    const tags = await tagService.findTagByPostID(post.PostID);
    // Thêm tags vào bài viết
    post.Tags = tags.map((tag) => ({
      TagID: tag.TagID,
      TName: tag.TName,
    }));
  }

  //page numbers
  const pageNumbersMV = [];
  for (let i = 0; i < nPages; i++) {
    pageNumbersMV.push({
      value: i + 1,
      active: i + 1 === +current_pageMV,
    });
  }

  const pageNumbersNP = [];
  for (let i = 0; i < nPages; i++) {
    pageNumbersNP.push({
      value: i + 1,
      active: i + 1 === +current_pageNP,
    });
  }

  const pageNumbersTC = [];
  for (let i = 0; i < nPages; i++) {
    pageNumbersTC.push({
      value: i + 1,
      active: i + 1 === +current_pageTC,
    });
  }

  res.render("home", {
    top2post: top3post,
    lastPost: lastPost,
    top10MostView: top10MostView,
    top10NewestPost: top10NewestPost,
    newestPostsOfTop10Cat: newestPostsOfTop10Cat,

    pageNumbersMV: pageNumbersMV,
    current_pageMV: current_pageMV,

    pageNumbersNP: pageNumbersNP,
    current_pageNP: current_pageNP,

    pageNumbersTC: pageNumbersTC,
    current_pageTC: current_pageTC,

    totalPages: nPages,
  });
  //console.log(top10CategoriesByView);
  //console.log(newestPostsOfTop10Cat);
});

app.use("/posts", postsRouter);
app.use("/account", accountRouter);
//admin
app.use("/admin", authAdmin, adminRouter);
app.use("/admin/categories", authAdmin, adminCatRouter);
app.use("/admin/categories/subcategories", authAdmin, adminSubCatRouter);
app.use("/admin/tags", authAdmin, adminTagRouter);
app.use("/admin/reader", authAdmin, adminReader);
app.use("/admin", adminRouter);
app.use("/writer/posts", postRouter);
app.use("/editor", editorRouter);
app.use("/403", function (req, res, next) {
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
startPublishingService();
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
