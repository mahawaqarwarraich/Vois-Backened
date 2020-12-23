const GoogleImages = require('google-images');

const client = new GoogleImages('b99ad2dddfcac4813', 'AIzaSyAmFfu2RsIuY7DoarLaK-GNoMQAkXoq4sQ');

const axios = require('axios').default;

const htmlDocx= require('html-docx-js');

var fs = require('fs');

var pdf = require('html-pdf');


exports.convertHtmlToDocx = async (req,res,next) => {
    //await HTMLtoDOCX(req.body.htmlString, req.body.headerHTMLString, req.body.documentOptions, req.body.footerHTMLString);
    // const docx = htmlDocx.asBlob(req.body.htmlString);
    // res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    // res.setHeader('Content-Disposition', `attachment; filename=muzamil.docx`);
    // res.setHeader('Content-Length', docx.length);
    // res.send(docx);

    const docx = htmlDocx.asBlob(req.body.htmlString);
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    // res.setHeader('Content-Disposition', `attachment; filename=${name}.docx`);
    res.setHeader('Content-disposition', 'attachment; filename=muzamil.docx');
    res.setHeader('Content-Length', docx.length);

    fs.writeFile('myword.docx',docx, function (err){
        if (err) return console.log(err);
        console.log('done');
    });
    res.send(docx);
}


exports.convertHtmlToPDF= (req,response,next) => {
    var html = req.body.htmlString;
    var options = { format: 'Letter' };

    pdf.create(html, options).toFile('./businesscard.pdf', function(err, res) {
        if (err) return console.log(err);
        response.download(res.filename, `${req.body.title}.pdf`)
        console.log(res); // { filename: '/app/businesscard.pdf' }
    });
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