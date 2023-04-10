const PDFDocument = require("pdfkit");
const fs = require("fs");

// fs.readFile("./repository/vagas.json", "utf8", function (err, data) {
//   createPDF((data));
// });

const createPDF = (jsonArray) => {
  // Create a new PDF document
  const doc = new PDFDocument();

  jsonArray.forEach((data) => {
    doc.fontSize(16).text(data.job, { align: "justify" });
    doc.fontSize(10).fillColor('darkgray').text("Company: ",{continued: true}).fillColor('black').text( data.company );
    doc.fontSize(10).fillColor('darkgray').text("location: ",{continued: true}).fillColor('black').text( data.location );
    doc.moveDown();
    doc.fontSize(10).fillColor('darkgray').text("english: ",{continued: true}).fillColor('black').text( data.english ,{continued: true}).fillColor('darkgray').text(" - remote: ",{continued: true}).fillColor('black').text( data.english)
    doc.moveDown();
    doc.fontSize(10).fillColor('darkgray').text("Keywords: ",{continued: true}).fillColor('black').text( `(${data.keywords.length}) ${data.keywords}` );
    doc.moveDown();
    doc.fontSize(10).fillColor('darkgray').text("posted: ",{continued: true}).fillColor('black').text( data.timeago );
    doc.fontSize(10).fillColor('darkgray').text("level: ",{continued: true}).fillColor('black').text( data.level );
    doc.moveDown();
    doc.fontSize(8).text(data.url, { align: "justify" });
    doc.moveDown();
    doc.text(data.description);
    doc.addPage();
  });

  doc.pipe(fs.createWriteStream("./repository/vagas.pdf"));
  doc.end();
};

module.exports = { createPDF };
