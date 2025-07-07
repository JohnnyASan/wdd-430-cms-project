var express = require("express");
var router = express.Router();
const sequenceGenerator = require("./sequenceGenerator");
const Contact = require("../models/contact");

router.get("/", (req, res, next) => {
  Contact.find()
    .populate("group")
    .exec()
    .then((contacts) => {
      res.status(200).json({
        contact: "Contacts fetched successfully",
        contacts: contacts,
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
  const nextId = sequenceGenerator.nextId("contacts");
  const contact = new Contact({
    id: nextId,
    name: req.body.name,
    email: req.body.email,
    phone: req.body.phone,
    imageUrl: req.body.imageUrl,
  });
  contact
    .save()
    .then((result) => {
      res.status(201).json({
        contact: "Contact created successfully",
        contact: result,
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
  Contact.findOne({ id: id })
    .then((contact) => {
      if (!contact) {
        return res.status(404).json({
          title: "No Contact Found",
          error: { contactId: id },
        });
      }
      contact.name = req.body.name;
      contact.email = req.body.email;
      contact.phone = req.body.phone;
      contact.imageUrl = req.body.imageUrl;

      return Contact.updateOne({ id: id }, contact);
    })
    .then((result) => {
      res.status(200).json({
        contact: "Contact updated successfully",
        contact: result,
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
  Contact.findOne({ id: id })
    .then((contact) => {
      if (!contact) {
        return res.status(404).json({
          title: "No Contact Found",
          error: { contactId: id },
        });
      }
      return Contact.deleteOne({ id: id });
    })
    .then((result) => {
      res.status(200).json({
        contact: "Contact deleted successfully",
        result: result,
      });
    })
    .catch((err) => {
      res.status(500).json({
        title: "Contact deletion failed",
        error: err,
      });
    });
});

module.exports = router;
