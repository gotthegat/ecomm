const express = require("express");
const bodyParser = require("body-parser");
const usersRepo = require("./repositories/users");

const app = express(); // app is our web server object

app.use(bodyParser.urlencoded({ extended: true })); // applies this middleware function to all route handlers

//route handlers
app.get("/", (req, res) => {
  res.send(`
    <div>
        <form method="POST">
            <input name="email" placeholder="email" />
            <input name="password" placeholder="password" />
            <input name="passwordConfirmation" placeholder="password confirmation" />
            <button>Sign Up</button>
        </form>
    </div>
  `);
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
