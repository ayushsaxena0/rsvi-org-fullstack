const passport = require("passport");
const validator = require("validator");
const User = require("../models/User");

module.exports = {
  getLogin: (req, res) => {
    if (req.user) {
      return res.redirect("/admin");
    }
    res.render("login", {
      title: "Login",
    });
  },
  postLogin: (req, res, next) => {
    const validationErrors = [];
    if (!validator.isEmail(req.body.email))
      validationErrors.push({ msg: "Please enter a valid email address." });
    if (validator.isEmpty(req.body.password))
      validationErrors.push({ msg: "Password cannot be blank." });

    if (validationErrors.length) {
      req.flash("errors", validationErrors);
      return res.redirect("/login");
    } else {
      req.body.email = validator.normalizeEmail(req.body.email, {
        gmail_remove_dots: false,
      });

      passport.authenticate("local", (err, user, info) => {
        if (err) {
          return next(err);
        }
        if (!user) {
          req.flash("errors", info);
          return res.redirect("/login");
        }
        req.logIn(user, (err) => {
          if (err) {
            console.error("Login Error:", err);
            req.flash("errors", { msg: "Login Failed! Please try again." });
            return res.redirect("/login");
          }
          req.flash("success", { msg: "Success! You are logged in." });
          return res.redirect(req.session.returnTo || "/admin");
        });
      })(req, res, next);
    }
  },
  logout: (req, res) => {
    req.logout((err) => {
      if (err) {
        console.error("Logout error", err);
        return res.redirect("/");
      }
      req.session.destroy((err) => {
        if (err) {
          console.error("Failed to destroy session during logout", err);
        }
        req.user = null;
        return res.redirect("/login");
      });
    });
  },
  getSignup: (req, res) => {
    if (req.user) {
      return res.redirect("/admin");
    }
    res.render("signup", {
      title: "Create Account",
    });
  },
  postSignup: async (req, res, next) => {
    let { userName, email, password, confirmPassword } = req.body;
    const validationErrors = [];

    if (!validator.isEmail(email))
      validationErrors.push({ msg: "Please enter a valid email address." });
    if (!validator.isLength(password, { min: 8 }))
      validationErrors.push({
        msg: "Password must be at least 8 characters long",
      });
    if (password !== confirmPassword)
      validationErrors.push({ msg: "Passwords do not match" });

    if (validationErrors.length) {
      req.flash("errors", validationErrors);
      return res.redirect("../signup");
    }
    email = validator.normalizeEmail(email, { gmail_remove_dots: false });

    try {
      const existingUser = await User.findOne({
        $or: [{ email: email }, { userName: userName }],
      });

      if (existingUser) {
        req.flash("errors", {
          msg: "Account with that email address or username already exists.",
        });
        return res.redirect("../signup");
      }

      const user = new User({
        userName: userName,
        email: email,
        password: password,
      });

      await user.save();
      req.logIn(user, (err) => {
        if (err) {
          return next(err);
        }
        res.redirect("/admin");
      });
    } catch (err) {
      console.error(err);
      return next(err);
    }
  },
};
