const express = require("express");
const { body } = require("express-validator/check");
const isAuth = require("../../middleware/is-auth");
const CVController = require("../../controllers/CVBuilder/cv-builder");

const router = express.Router();


router.get("/get-cv/:id",CVController.getCV);


router.post("/add-cv",isAuth,
    [
        body("templateId")
        .not()
        .isEmpty(),
        body("data")
        .not()
        .isEmpty()
    ],CVController.addCV);

router.post("/edit-cv",isAuth,
[
    body("templateId")
    .not()
    .isEmpty(),
    body("data")
    .not()
    .isEmpty()
],CVController.editCV);


module.exports = router;