const News = require("../models/News");
const Story = require("../models/Story");
const Event = require("../models/Event");
const Project = require("../models/Project");

module.exports = {
  getDashboard: async (req, res) => {
    const totalNews = await News.countDocuments();
    const totalStories = await Story.countDocuments();
    const totalEvents = await Event.countDocuments();
    const totalProjects = await Project.countDocuments();
    const obj = {
      "Total News": totalNews,
      "Total Stories": totalStories,
      "Total Events": totalEvents,
      "Total Projects": totalProjects,
    };
    res.render("dashboard", {
      title: "Dashboard",
      obj: obj,
    });
  },
};
