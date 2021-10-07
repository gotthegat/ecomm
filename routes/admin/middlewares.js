const { validationResult } = require("express-validator");
const users = require("../../repositories/users");

module.exports = {
  handleErrors(templateFunc) {
    return (req, res, next) => {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res.send(templateFunc({ errors }));
      }

      next(); // carry on if everything went well
    };
  },
  requireAuth(req, res, next) {
    if (!req.session.userID) {
      return res.redirect("/signin");
    }
    next();
  },
};
