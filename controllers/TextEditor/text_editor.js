exports.convertHtmlToDocx = (req,res,next) => {
    await HTMLtoDOCX(req.body.htmlString, req.body.headerHTMLString, req.body.documentOptions, req.body.footerHTMLString);
}

exports.convertHtmlToPDF= (req,res,next) => {

}