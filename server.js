// Load environment variables from .env file
require("dotenv").config();

// Import required modules
const express = require("express");
const mongoose = require("mongoose");
const app = express();
const Product = require("./models/productModel");

//middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// DEFINE ROUTES
// Home route
app.get("/", (req, res) => {
  res.send("Hello World!");
});

// Blog route
app.get("/blog", (req, res) => {
  res.send("Hello Blog!");
});

// Get all products
app.get("/products", async (req, res) => {
  try {
    const products = await Product.find({});
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get a specific product by ID
app.get("/products/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create a new product
app.post("/products", async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.status(200).json(product);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: error.message });
  }
});

//Update a product
app.put("/products/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findByIdAndUpdate(id, req.body);
    if (!product) {
      return res
        .status(404)
        .json({ message: `Product with ID ${id} not found` });
    }

    const updatedProduct = await Product.findById(id);
    res.status(200).json(updatedProduct);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//Delete a product
app.delete("/products/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findByIdAndDelete(id);
    if (!product) {
      return res
        .status(404)
        .json({ message: `Product with ID ${id} not found` });
    }
    res.status(200).json({ message: `Product with ID ${id} deleted` });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Connect to MongoDB and start the server
mongoose
  .connect(process.env.MONGO_URI) // Connect to MongoDB using the MONGO_URI from .env
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(3000, () => {
      console.log("Node API app is listening on port 3000");
    });
  })
  .catch((error) => {
    console.log(error);
  });
