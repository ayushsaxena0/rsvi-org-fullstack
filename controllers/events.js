const cloudinary = require("../middleware/cloudinary");
const Event = require("../models/Event");

module.exports = {
  getEvents: async (req, res, next) => {
    try {
      const events = await Event.find().sort({ createdAt: "desc" }).lean();
      res.render("events", { events: events });
    } catch (err) {
      console.log(err);
    }
  },
  getEvent: async (req, res, next) => {
    try {
      const event = await Event.findById(req.params.id);
      res.render("event", { event: event });
    } catch (err) {
      console.log(err);
    }
  },
  createEvent: async (req, res, next) => {
    try {
      // Upload image to cloudinary
      const result = await cloudinary.uploader.upload(req.file.path);

      await Event.create({
        title: req.body.title,
        image: result.secure_url,
        cloudinaryId: result.public_id,
        startDate: new Date(req.body.startDate),
        endDate: new Date(req.body.endDate),
      });
      console.log("Event has been added!");
      res.redirect("/admin/events");
    } catch (err) {
      console.log(err);
    }
  },
  deleteEvent: async (req, res, next) => {
    try {
      // Find post by id
      let event = await Event.findById({ _id: req.params.id });
      // Delete image from cloudinary
      await cloudinary.uploader.destroy(event.cloudinaryId);
      // Delete post from db
      await Event.deleteOne({ _id: req.params.id });
      console.log("Deleted Event");
      res.redirect("/admin/events");
    } catch (err) {
      res.redirect("/admin/events");
    }
  },
};
