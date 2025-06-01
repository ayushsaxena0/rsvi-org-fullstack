const cloudinary = require("../middleware/cloudinary");
const Project = require("../models/Project");

module.exports = {
  getProjects: async (req, res) => {
    try {
      const projects = await Project.find().sort({ createdAt: "desc" }).lean();
      res.render("projects", { projects: projects });
    } catch (err) {
      console.log(err);
    }
  },
  getProject: async (req, res) => {
    try {
      const project = await Project.findById(req.params.id);
      res.render("project", { project: project });
    } catch (err) {
      console.log(err);
    }
  },
  createProject: async (req, res) => {
    try {
      // Upload image to cloudinary
      const result = await cloudinary.uploader.upload(req.file.path);

      await Project.create({
        title: req.body.title,
        image: result.secure_url,
        cloudinaryId: result.public_id,
        description: req.body.description,
        startDate: new Date(req.body.startDate),
        endDate: req.body?.endDate ? new Date(req.body.endDate) : null,
      });
      console.log("Project has been added!");
      res.redirect("/admin/projects");
    } catch (err) {
      console.log(err);
    }
  },
  deleteProject: async (req, res) => {
    try {
      // Find post by id
      let project = await Project.findById({ _id: req.params.id });
      // Delete image from cloudinary
      await cloudinary.uploader.destroy(project.cloudinaryId);
      // Delete post from db
      await Project.deleteOne({ _id: req.params.id });
      console.log("Deleted Project");
      res.redirect("/admin/projects");
    } catch (err) {
      res.redirect("/admin/projects");
    }
  },
};
