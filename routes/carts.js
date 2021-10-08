const express = require("express");
const cartsRepo = require("../repositories/carts");
const productsRepo = require("../repositories/products");
const cartShowTemplate = require("../views/carts/show");

const router = express.Router();

// receive a post request to add an item to a cart
router.post("/cart/products", async (req, res) => {
  console.log(req.body.productID);
  // figure out if the user has a cart
  let cart;
  if (!req.session.cartID) {
    // create cart and store cartID in cookie
    cart = await cartsRepo.create({ items: [] });
    req.session.cartID = cart.id;
  } else {
    // get cart from repo
    cart = await cartsRepo.getOne(req.session.cartID);
  }

  // either increment quantity or add new product to items array
  const existingItem = cart.items.find(
    (item) => item.id === req.body.productID
  );
  if (existingItem) {
    // increment quantity
    existingItem.quantity++;
  } else {
    // add new product ID to items array
    cart.items.push({ id: req.body.productID, quantity: 1 });
  }
  // save cart
  await cartsRepo.update(cart.id, { items: cart.items });

  res.redirect("/cart");
});

// receive a get request to show all items in cart
router.get("/cart", async (req, res) => {
  if (!req.session.cartID) {
    return res.redirect("/");
  }

  const cart = await cartsRepo.getOne(req.session.cartID);

  for (let item of cart.items) {
    const product = await productsRepo.getOne(item.id);
    // add a product property to the item
    item.product = product;
  }

  res.send(cartShowTemplate({ items: cart.items }));
});

// receive a post to delete an item from a cart
router.post("/cart/products/delete", async (req, res) => {
  const { itemID } = req.body;
  const cart = await cartsRepo.getOne(req.session.cartID);

  // use filter to create new array with deleting item filtered out
  const items = cart.items.filter((item) => item.id !== itemID);

  await cartsRepo.update(req.session.cartID, { items });

  res.redirect("/cart");
});

module.exports = router;
