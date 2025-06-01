const cloudinary = require("../middleware/cloudinary");
const Story = require("../models/Story");

module.exports = {
  getStories: async (req, res) => {
    try {
      const stories = await Story.find().sort({ createdAt: "desc" }).lean();
      res.render("stories", { stories: stories });
    } catch (err) {
      console.log(err);
    }
  },
  getStory: async (req, res) => {
    try {
      const story = await Story.findById(req.params.id);
      res.render("story", { story: story });
    } catch (err) {
      console.log(err);
    }
  },
  createStory: async (req, res) => {
    try {
      // Upload image to cloudinary
      const result = await cloudinary.uploader.upload(req.file.path);

      await Story.create({
        title: req.body.title,
        image: result.secure_url,
        cloudinaryId: result.public_id,
        description: req.body.description,
      });
      console.log("Stroy has been added!");
      res.redirect("/admin/stories");
    } catch (err) {
      console.log(err);
    }
  },
  deleteStory: async (req, res) => {
    try {
      // Find post by id
      let story = await Story.findById({ _id: req.params.id });
      // Delete image from cloudinary
      await cloudinary.uploader.destroy(story.cloudinaryId);
      // Delete post from db
      await Story.deleteOne({ _id: req.params.id });
      console.log("Deleted Story");
      res.redirect("/admin/stories");
    } catch (err) {
      res.redirect("/admin/stories");
    }
  },
};
