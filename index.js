const express = require("express");
const bodyParser = require("body-parser");
const cookieSession = require("cookie-session"); // cookie manager library, adds a session property to the req object
const usersRepo = require("./repositories/users");

const app = express(); // app is our web server object

app.use(bodyParser.urlencoded({ extended: true })); // applies this middleware function to all route handlers
app.use(
  cookieSession({
    keys: ["23f98jsdfk89sdfgj77hfuhfsf"], // encryption key for cookies
  })
); // this is also a middleware function

//route handlers
app.get("/", (req, res) => {
  res.send(`
    <div>
      Your ID is: ${req.session.userID}
        <form method="POST">
            <input name="email" placeholder="email" />
            <input name="password" placeholder="password" />
            <input name="passwordConfirmation" placeholder="password confirmation" />
            <button>Sign Up</button>
        </form>
    </div>
  `); // if req.session.userID exists, the user must be signed in
});

app.post("/", async (req, res) => {
  const { email, password, passwordConfirmation } = req.body;
  // test for existing email
  const existingUser = await usersRepo.getOneBy({ email });
  if (existingUser) {
    return res.send("Email in use");
  }
  if (password !== passwordConfirmation) {
    return res.send("Passwords must match");
  }

  // create user in user repo to represent this person
  const user = await usersRepo.create({ email, password });
  // store id of user in the user's cookie
  req.session.userID = user.id; // session is created by cookie-session, includes key and value

  res.send("Account created");
});

//listen for incoming network requests on port 3000
app.listen(3000, () => {
  console.log("listening");
});

// original middleware parser function
// const bodyParser = (req, res, next) => {
//   if (req.method === "POST") {
//     req.on("data", (data) => {
//       //on method is like adding an event listener for the data event
//       const parsed = data.toString("utf8").split("&");
//       const formData = {};
//       for (let pair of parsed) {
//         const [key, value] = pair.split("="); // destructure key and value from the split
//         formData[key] = value;
//       }
//       req.body = formData; // assign form data to body property
//       next();
//     });
//   } else {
//     next(); // next is a callback function privided by express
//   }
// };
