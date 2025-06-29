const bodyParser = require("body-parser");
const express = require("express");

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, PATCH, DELETE, OPTIONS"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  next();
});

app.post("/api/documents", (req, res, next) => {
    const document = req.body;
    // Here you would typically save the document to a database
    console.log("Document received:", document);
    res.status(201).json({
        message: "Document created successfully",
        document: document,
    });
});

app.use("api/documents", (req, res, next) => {
  res.status(200).json({});
});

module.exports = app;
