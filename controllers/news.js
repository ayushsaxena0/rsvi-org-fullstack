const cloudinary = require("../middleware/cloudinary");
const News = require("../models/News");

module.exports = {
  getNews: async (req, res, next) => {
    console.time("news");
    try {
      console.time("find news");
      const news = await News.find().sort({ createdAt: "desc" }).lean();
      console.timeEnd("find news");
      console.time("render");
      res.render("news.ejs", { news: news });
      console.timeEnd("render");
      console.timeEnd("news");
    } catch (err) {
      console.log(err);
    }
  },
  getSingleNews: async (req, res, next) => {
    try {
      const news = await News.findById(req.params.id);
      res.render("singleNews.ejs", { news: news });
    } catch (err) {
      console.log(err);
    }
  },
  createSingleNews: async (req, res, next) => {
    console.time("CreateNews");
    try {
      // Upload image to cloudinary
      console.time("upload");
      const result = await cloudinary.uploader.upload(req.file.path);
      console.timeEnd("upload");
      console.time("db");
      await News.create({
        title: req.body.title,
        image: result.secure_url,
        cloudinaryId: result.public_id,
        description: req.body.description,
        articleLink: req.body.articleLink,
      });
      console.timeEnd("db");
      console.log("News has been added!");
      console.timeEnd("CreateNews");
      res.redirect("/admin/news");
    } catch (err) {
      console.log(err);
    }
  },
  deleteNews: async (req, res, next) => {
    try {
      // Find post by id
      let news = await News.findById({ _id: req.params.id });
      // Delete image from cloudinary
      await cloudinary.uploader.destroy(news.cloudinaryId);
      // Delete post from db
      await News.deleteOne({ _id: req.params.id });
      console.log("Deleted News");
      res.redirect("/admin/news");
    } catch (err) {
      res.redirect("/admin/news");
    }
  },
};
