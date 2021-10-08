const { validationResult } = require("express-validator");
const users = require("../../repositories/users");

module.exports = {
  handleErrors(templateFunc, dataCb) {
    return async (req, res, next) => {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        let data = {};
        if (dataCb) {
          data = await dataCb(req);
        }
        return res.send(templateFunc({ errors, ...data }));
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
