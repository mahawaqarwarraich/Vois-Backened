const { validationResult } = require("express-validator/check");
const Portfolio = require("../../models/PortfolioBuilder/portfolio-builder");
const helperFunctions = require("./helperFunctions");

exports.getPortfolio = (req,res,next) => {
    const portfolioId = req.params.id;

    Portfolio.findById(portfolioId)
        .then(portfolio => {
            if(!portfolio) {
                res.status(404).json({
                    message: "Portfolio Not Found",
                    portfolio: portfolio
                });
            }
            res.status(200).json({
                message: "Portfolio fetched Successfuly",
                portfolio: portfolio
            })
        })
        .catch(error => {
            if (!error.statusCode) {
                error.statusCode = 500;
            }
            next(error);
        })
};

exports.addPortfolio = (req,res,next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error('Validation failed.');
        error.statusCode = 422;
        error.data = errors.array();
        throw error;
    }

    const data = req.body.data;
    data = JSON.stringify(data);
    const author = req.userId;
    const authorName = req.username;

    return helperFunctions.createNewPortfolio(res,next,{data,author,authorName});
};


exports.editPortfolio = (req,res,next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error('Validation failed.');
        error.statusCode = 422;
        error.data = errors.array();
        throw error;
    }

    const portfolioId = req.body.portfolioId;
    const data = req.body.data;
    data = JSON.stringify(data);
    const author = req.userId;
    const authorName = req.username;

    Portfolio.findById(portfolioId)
    .then (foundPortfolio => {
        if (!foundPortfolio) {
            res.status(404).json({
                message: "Portfolio not found",
            });
        }
        if (foundPortfolio.Author.id != author) {
            return res.status(401).json({
                message: "Not Authorized!"
            })
        }
        // if there's no new local file and file is not changed or there is another method of file uploading
        return helperFunctions.EditPortfolio(res,next,foundPortfolio,{data});
    });
};
