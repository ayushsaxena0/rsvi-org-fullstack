const cloudinary = require("../middleware/cloudinary");
const News = require("../models/News");

module.exports = {
  getNews: async (req, res) => {
    try {
      const news = await News.find().sort({ createdAt: "desc" }).lean();
      res.render("news.ejs", { news: news });
    } catch (err) {
      console.log(err);
    }
  },
  getSingleNews: async (req, res) => {
    try {
      const news = await News.findById(req.params.id);
      res.render("singleNews.ejs", { news: news });
    } catch (err) {
      console.log(err);
    }
  },
  createSingleNews: async (req, res) => {
    try {
      // Upload image to cloudinary
      const result = await cloudinary.uploader.upload(req.file.path);

      await News.create({
        title: req.body.title,
        image: result.secure_url,
        cloudinaryId: result.public_id,
        description: req.body.description,
        articleLink: req.body.articleLink,
      });
      console.log("News has been added!");
      res.redirect("/admin/news");
    } catch (err) {
      console.log(err);
    }
  },
  deleteNews: async (req, res) => {
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
