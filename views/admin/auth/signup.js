const layout = require("../layout");

// helper function for errors
const getError = (errors, prop) => {
  try {
    // errors.mapped returns error array as an object with property names as keys
    // errors.mapped() ===
    //   {
    //     email: {
    //       value: "test@gmailcom",
    //       msg: "Invalid email",
    //       param: "email",
    //       location: "body",
    //     },
    //     password: {
    //       value: "ave",
    //       msg: "Invalid password",
    //       param: "password",
    //       location: "body",
    //     },
    //   };
    return errors.mapped()[prop].msg;
  } catch (err) {
    return ""; // no errors
  }
};

module.exports = ({ req, errors }) => {
  return layout({
    content: `
      <div>
        Your ID is: ${req.session.userID}
        <form method="POST">
            <input name="email" placeholder="email" />
            ${getError(errors, "email")}
            <input name="password" placeholder="password" />
            ${getError(errors, "password")}
            <input name="passwordConfirmation" placeholder="password confirmation" />
            ${getError(errors, "passwordConfirmation")}
            <button>Sign Up</button>
        </form>
      </div>
    `,
  }); // if req.session.userID exists, the user must be signed in
};
