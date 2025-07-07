var express = require("express");
var router = express.Router();
const sequenceGenerator = require("./sequenceGenerator");
const Message = require("../models/message");

router.get("/", (req, res, next) => {
  Message.find()
    .exec()
    .then((messages) => {
      res.status(200).json({
        message: "Messages fetched successfully",
        messages: messages,
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
  const nextId = sequenceGenerator.nextId("messages");
  const message = new Message({
    id: nextId,
    subject: req.body.subject,
    msgText: req.body.msgText,
    sender: req.body.sender,
  });
  message
    .save()
    .then((result) => {
      res.status(201).json({
        message: "Message created successfully",
        message: result,
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
  Message.findOne({ id: id })
    .then((message) => {
      if (!message) {
        return res.status(404).json({
          title: "No Message Found",
          error: { messageId: id },
        });
      }
      message.subject = req.body.subject;
      message.msgText = req.body.msgText;
      message.sender = req.body.sender;

      return Message.updateOne({ id: id }, message);
    })
    .then((result) => {
      res.status(200).json({
        message: "Message updated successfully",
        message: result,
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
  Message.findOne({ id: id })
    .then((message) => {
      if (!message) {
        return res.status(404).json({
          title: "No Message Found",
          error: { messageId: id },
        });
      }
      return Message.deleteOne({ id: id });
    })
    .then((result) => {
      res.status(200).json({
        message: "Message deleted successfully",
        result: result,
      });
    })
    .catch((err) => {
      res.status(500).json({
        title: "Message deletion failed",
        error: err,
      });
    });
});

module.exports = router;
