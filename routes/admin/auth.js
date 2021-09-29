const express = require("express");
const { check, validationResult } = require("express-validator");
const usersRepo = require("../../repositories/users");
const signup = require("../../views/admin/auth/signup");
const signupTemplate = require("../../views/admin/auth/signup");
const signinTemplate = require("../../views/admin/auth/signin");
const {
  requireEmail,
  requirePassword,
  requirePasswordConfirmation,
  requireEmailExists,
  requireValidPasswordForUser,
} = require("./validators");

// router keeps track of all route handlers we set up
const router = express.Router();

// route handlers
router.get("/signup", (req, res) => {
  res.send(signupTemplate({ req }));
});

router.post(
  "/signup",
  [requireEmail, requirePassword, requirePasswordConfirmation],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      //return signup template again
      return res.send(signupTemplate({ req, errors }));
    }
    const { email, password, passwordConfirmation } = req.body;

    // create user in user repo to represent this person
    const user = await usersRepo.create({ email, password });
    // store id of user in the user's cookie
    req.session.userID = user.id; // session is created by cookie-session, includes key and value

    res.send("Account created");
  }
);

router.get("/signout", (req, res) => {
  // tell browser to forget info stored in cookie
  req.session = null;
  res.send("You are logged out");
});

router.get("/signin", (req, res) => {
  res.send(signinTemplate({}));
});

router.post(
  "/signin",
  [requireEmailExists, requireValidPasswordForUser],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.send(signinTemplate({ errors }));
    }

    const { email } = req.body;
    // check for user with this email
    const user = await usersRepo.getOneBy({ email });

    req.session.userID = user.id; // set cookie to sign user in
    res.send("You are signed in");
  }
);

module.exports = router;
