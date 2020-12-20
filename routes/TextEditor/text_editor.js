const express = require("express");
const textEditorController = require("../../controllers/TextEditor/text_editor");

const router = express.Router();

router.post("/convert-to-docx",textEditorController.convertHtmlToDocx);

router.post("/convert-to-pdf",textEditorController.convertHtmlToPDF);

module.exports = router;

