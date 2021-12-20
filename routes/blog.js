const express = require("express");
const { check } = require("express-validator");
const requireAuth = require("../middlewares/requireAuth");
const blogController = require("../controllers/blogController");

const router = express.Router();

const multer = require("multer");
const path = require("path");
const fs = require("fs");

const blogValidationRules = [
  check("title").exists().withMessage("Title is required"),
  check("content").exists().withMessage("Content is required"),
  check("status").exists().withMessage("Status is required"),
];

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    if (!fs.existsSync("public")) {
      fs.mkdirSync("public");
    }
    if (file.fieldname === "image") {
      if (!fs.existsSync("public/media")) {
        fs.mkdirSync("public/media");
      }

      cb(null, "public/media");
    } else if (file.fieldname === "resources") {
      if (!fs.existsSync("public/resources")) {
        fs.mkdirSync("public/resources");
      }

      cb(null, "public/resources");
    }
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + file.originalname + path.extname(file.originalname));
  },
});

const upload = multer({
  storage: storage,
  fileFilter: function (req, file, cb) {
    var ext = path.extname(file.originalname);

    if (ext !== ".png" && ext !== ".jpg" && ext !== ".gif" && ext !== ".jpeg") {
      return cb(new Error("Only Images are allowed!"));
    }

    cb(null, true);
  },
});

//get api - Get /api/blog/get - Private api
router.get("/get", requireAuth, blogController.getAll);

//get selected Get /api/blog/getSelected Private api
router.get("/getSelected/:id", requireAuth, blogController.getSelected);

//create api - POST /api/blog/create - Private api
router.post(
  "/create",
  [blogValidationRules, requireAuth],
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "resources", maxCount: 5 },
  ]),
  blogController.create
);

//update api - Put /api/blog/update/:id - Private api
router.put(
  "/update/:id",
  [blogValidationRules, requireAuth],
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "resources", maxCount: 5 },
  ]),
  blogController.update
);

//delete api - Delete /api/blog/delete/:id
router.delete("/delete/:id", requireAuth, blogController.delete);

module.exports = router;
