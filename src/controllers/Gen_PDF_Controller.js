import { generatePDF } from "../helpers/pdf";

/**
 * Get all Users
 * @param {Request} req
 * @param {Response} res
 * @return {Promise<void>}
 */

// export const getGeneratePdf = async (req, res) => {

//   // res.sendFile(`${pdf_path}/generated_pdf.pdf`)

// }

export const createPdf = async (req, res, next) => {

  try {

    const fileBuffer = await generatePDF();
    res.setHeader("Content-Disposition", "attachment; filename=panda.pdf");
    res.setHeader("Content-Type", "application/pdf");
    res.send(fileBuffer);

  } catch (err) {

    console.log(err);
    res.status(400).json({ msg: "an error occurs" });
    next();

  }

};
