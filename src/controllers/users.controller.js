const userCtrl = {};

// Models
const User = require("../models/User");

// Modules
const passport = require("passport");

userCtrl.renderSignUpForm = (req, res) => {
  res.render("users/signup");
};

userCtrl.signup = async (req, res) => {
  let errors = [];
  const { name, email, password, confirm_password } = req.body;
  if (password != confirm_password) {
    errors.push({ text: "Passwords do not match." });
  }
  if (password.length < 4) {
    errors.push({ text: "Passwords must be at least 4 characters." });
  }
  if (errors.length > 0) {
    res.render("users/signup", { errors, name, email });
  } else {

    const emailUser = await User.findOne({ email: email });
    //console.log("emailUser: ", emailUser);

    if (emailUser) {
      //errors.push({ text: "The Email is already in use." });
      //res.render("users/signup", { errors });
      req.flash("error_msg", "The Email is already in use.");
      res.redirect("/users/signup");
    } else {
      const newUser = new User({ name, email, password });

      //console.log(newUser);
      newUser.password = await newUser.encryptPassword(password);
      await newUser.save();
      req.flash("success_msg", "You are registered.");
      res.redirect("/users/signin");
    }
  }
};
userCtrl.userFind = async (req, res) => {
  const users = await User.find();
  res.send(users);
};

userCtrl.renderSigninForm = (req, res) => {
  res.render("users/signin");
};

userCtrl.signin = passport.authenticate("local", {
  successRedirect: "/notes",
  failureRedirect: "/users/signin",
  failureFlash: true
});

userCtrl.logout = (req, res) => {
  req.logout();
  req.flash('success_msg','tu estas logeado ahora' );
  res.redirect('/users/signin')
};
module.exports = userCtrl;
