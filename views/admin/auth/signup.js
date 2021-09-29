const layout = require("../layout");

module.exports = ({ req }) => {
  return layout({
    content: `
      <div>
        Your ID is: ${req.session.userID}
        <form method="POST">
            <input name="email" placeholder="email" />
            <input name="password" placeholder="password" />
            <input name="passwordConfirmation" placeholder="password confirmation" />
            <button>Sign Up</button>
        </form>
      </div>
    `,
  }); // if req.session.userID exists, the user must be signed in
};
