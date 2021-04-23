const express = require("express");
const { body } = require("express-validator/check");
const isAuth = require("../../middleware/is-auth");
const PortfolioController = require("../../controllers/PortfolioBuilder/portfolio-builder");

const router = express.Router();


router.get("/get-portfolio/:id",PortfolioController.getPortfolio);


router.post("/add-portfolio",isAuth,
    [
        body("data")
        .not()
        .isEmpty()
    ],PortfolioController.addPortfolio);

router.post("/edit-portfolio",isAuth,
[
    body("data")
    .not()
    .isEmpty()
],PortfolioController.editPortfolio);


module.exports = router;