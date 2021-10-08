const express = require("express");
const bodyParser = require("body-parser");
const cookieSession = require("cookie-session"); // cookie manager library, adds a session property to the req object
const authRouter = require("./routes/admin/auth");
const adminProductsRouter = require("./routes/admin/products");
const productsRouter = require("./routes/products");
const cartsRouter = require("./routes/carts");

const app = express(); // app is our web server object

// middleware functions
app.use(express.static("public")); // make this folder available to internet
app.use(bodyParser.urlencoded({ extended: true })); // applies this middleware function to all route handlers
app.use(
  cookieSession({
    keys: ["23f98jsdfk89sdfgj77hfuhfsf"], // encryption key for cookies
  })
);

app.use(authRouter); // include authentication route handlers
app.use(productsRouter);
app.use(adminProductsRouter);
app.use(cartsRouter);

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
