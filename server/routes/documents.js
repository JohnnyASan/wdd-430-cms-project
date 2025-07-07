var express = require("express");
var router = express.Router();
const sequenceGenerator = require("./sequenceGenerator");
const Document = require("../models/document");

router.get("/", (req, res, next) => {
  Document.find()
    .populate("children")
    .exec()
    .then((documents) => {
      res.status(200).json({
        message: "Documents fetched successfully",
        documents: documents,
      });
    })
    .catch((err) => {
      res.status(500).json({
        title: "An error occurred",
        error: err,
      });
    });
});

router.post("/", (req, res, next) => {
  const nextId = sequenceGenerator.nextId("documents");
  const document = new Document({
    id: nextId,
    name: req.body.name,
    description: req.body.description,
    url: req.body.url,
  });
  document
    .save()
    .then((result) => {
      res.status(201).json({
        message: "Document created successfully",
        document: result,
      });
    })
    .catch((err) => {
      res.status(500).json({
        title: "An error occurred",
        error: err,
      });
    });
});

router.put("/:id", (req, res, next) => {
  const id = req.params.id;
  Document.findOne({ id: id })
    .then((document) => {
      if (!document) {
        return res.status(404).json({
          title: "No Document Found",
          error: { documentId: id },
        });
      }
      document.name = req.body.name;
      document.description = req.body.description;
      document.url = req.body.url;

      return Document.updateOne({ id: id }, document);
    })
    .then((result) => {
      res.status(200).json({
        message: "Document updated successfully",
        document: result,
      });
    })
    .catch((err) => {
      res.status(500).json({
        title: "An error occurred",
        error: err,
      });
    });
});

router.delete("/:id", (req, res, next) => {
  const id = req.params.id;
  Document.findOne({ id: id })
    .then((document) => {
      if (!document) {
        return res.status(404).json({
          title: "No Document Found",
          error: { documentId: id },
        });
      }
      return Document.deleteOne({ id: id });
    })
    .then((result) => {
      res.status(200).json({
        message: "Document deleted successfully",
        result: result,
      });
    })
    .catch((err) => {
      res.status(500).json({
        title: "Document deletion failed",
        error: err,
      });
    });
});

module.exports = router;
