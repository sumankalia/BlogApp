const { validationResult } = require("express-validator");
const Blog = require("../models/Blog");
const fs = require("fs");

exports.getAll = async (req, res) => {
  try {
    const blogs = await Blog.find();

    res.json(blogs);
  } catch (error) {
    res.status(400).json(error);
  }
};

exports.getSelected = async (req, res) => {
  const { id } = req.params;

  try {
    const blog = await Blog.findById(id);

    res.json(blog);
  } catch (error) {
    res.status(400).json(error);
  }
};

exports.create = async (req, res) => {
  const { title, content, status } = req.body;
  console.log(req.decoded);

  console.log(req.files);
  //   console.log(req.files)

  let filePath = "";
  let resourcesPath = [];

  if (Array.isArray(req.files.image) && req.files.image.length > 0) {
    filePath = "/" + req.files.image[0].path;
  }

  if (Array.isArray(req.files.resources) && req.files.resources.length > 0) {
    for (let resource of req.files.resources) {
      resourcesPath.push("/" + resource.path);
    }
  }
  //Validations
  const errors = validationResult(req.body);
  if (!errors.isEmpty()) {
    return res.status(422).json({ error: errors.array() });
  }

  try {
    const blog = await Blog.create({
      title,
      content,
      status,
      image: filePath,
      resources: resourcesPath,
      writer: req.decoded.existingUser._id,
    });

    res.json({ message: "Blog created successfully", blog });
  } catch (error) {
    console.log(error);
    res.status(400).json(error);
  }
};

exports.update = async (req, res) => {
  const { id } = req.params;

  const { title, content, status } = req.body;
  //Validations
  const errors = validationResult(req.body);
  if (!errors.isEmpty()) {
    return res.status(422).json({ error: errors.array() });
  }

  try {
    const blog = await Blog.findById(id);
    if (!blog) {
      return res.status(404).json({ message: "No record exist." });
    }

    let filePath = "";
    let resoucesPaths = [];

    if (blog.image) {
      console.log(blog.image);
      fs.unlink("." + blog.image, function (error) {
        if (error) console.log(error);
      });

      filePath = "";
    }

    if (Array.isArray(req.files.image) && req.files.image.length > 0) {
      filePath = "/" + req.files.image[0].path;
    }

    if (blog.resources.length > 0) {
      for (let resource of blog.resources) {
        fs.unlink("." + resource, function (err) {
          if (err) {
            console.log(err);
          }
        });
      }
      resoucesPaths = [];
    }

    if (Array.isArray(req.files.resources) && req.files.resources.length > 0) {
      for (let resource of req.files.resources) {
        resoucesPaths.push("/" + resource.path);
      }
    }

    const updatedBlog = await Blog.findByIdAndUpdate(
      id,
      {
        title,
        content,
        status,
        image: filePath,
        resources: resoucesPaths,
      },
      { new: true }
    );

    res.json({ message: "Blog updated successfully", updatedBlog });
  } catch (error) {
    console.log(error);
    res.status(400).json(error);
  }
};

exports.delete = async (req, res) => {
  const { id } = req.params;

  try {
    const blog = await Blog.findById(id);
    if (!blog) {
      return res.status(404).json({ message: "Record not found." });
    }

    const deletedBlog = await blog.remove();

    res.json({ message: "Blog deleted Successfully.", deletedBlog });
  } catch (error) {
    console.log(error);
    res.status(400).json(error);
  }
};
