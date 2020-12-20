const GoogleImages = require('google-images');
 
const client = new GoogleImages('b99ad2dddfcac4813', 'AIzaSyAmFfu2RsIuY7DoarLaK-GNoMQAkXoq4sQ');

const axios = require('axios').default;



exports.convertHtmlToDocx = (req,res,next) => {
    //await HTMLtoDOCX(req.body.htmlString, req.body.headerHTMLString, req.body.documentOptions, req.body.footerHTMLString);
}

exports.convertHtmlToPDF= (req,res,next) => {

}

exports.SearchImages = (req,res,next) => {
    const keyword = req.params.keyword;

    const url = "https://www.googleapis.com/customsearch/v1?key=AIzaSyAmFfu2RsIuY7DoarLaK-GNoMQAkXoq4sQ&cx=b99ad2dddfcac4813&searchType=image&q=tom";
    axios.get(url)
        .then(response => {
            console.log(response.data.items);
        }).catch(err => {
            console.log(err);
    });
}