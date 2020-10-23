import fs from "fs";
import ejs from "ejs";
import path from "path";
import pdf from "html-pdf";

export const generatePDF = async (data, template) => {

  const pdfFile = path.join(__dirname, `/../views/pdf/${template}.ejs`);
  const pdfFileCompiled = ejs.compile(fs.readFileSync(pdfFile, "utf8"));
  const html = pdfFileCompiled({ data });
  const options = { format: "A4" };

  return await new Promise((resolve, reject) => {

    pdf.create(html, options).toBuffer((err, buffer) => {

      if (err) reject(err);
      resolve(buffer);

    });

  });

};
