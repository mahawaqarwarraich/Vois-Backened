const Portfolio = require ("../../models/PortfolioBuilder/portfolio-builder");


const createNewPortfolioObject = (portfolio) => {
    return new Promise (resolve => {
        resolve(new Portfolio({
            PortfolioData: portfolio.data,
            Author: {id:portfolio.author, authorName: portfolio.authorName}
        }).save());
    });
}


exports.createNewPortfolio = (res,next,portfolio) => {
    return createNewPortfolioObject(portfolio)
        .then (newPortfolio => {
            return res.status(201).json({
                message: "Portfolio Created Successfully",
                portfolio : newPortfolio
            });
        })
        .catch(error => {
            if (!error.statusCode) {
                error.statusCode = 500;
            }
            next(error);
        });
}


const EditPortfolioObject = (foundPortfolio,portfolio) => {
    return new Promise (resolve => { //locally uploading of the cover image
        foundPortfolio.PortfolioData = portfolio.data;
        resolve(foundPortfolio.save());
    });
}

exports.EditPortfolio = (res,next,foundPortfolio,portfolio) => {
    return EditPortfolioObject(foundPortfolio,portfolio)
        .then (editedPortfolio => {
            return res.status(201).json({
                message: "Portfolio Edited Successfully",
                portfolio : editedPortfolio
            });
        })
        .catch(error => {
            if (!error.statusCode) {
                error.statusCode = 500;
            }
            next(error);
        });
};