import Safety from "../models/Safety";
import Sites from "../models/Sites";
import colors from "colors";
import { validObjectId } from "../helpers/mongoose";
import { generatePDF } from "../helpers/pdf";
import moment from "moment";

/**
 * Create Safety
 * @param {Request} req
 * @param {Response} res
 * @return {Promise<void>}
 */

export const createSafety = async (req, res) => {

  const newSafety = { ...req.body };

  try {

    const createdSafety = new Safety(newSafety);

    await createdSafety.save();

    return res.status(200).json({ id: createdSafety._id });

  } catch (err) {

    console.log(colors.red("ERROR CREATING Safety :\n"), err);
    return res.status(500).json({ message: "Error creating Safety" });

  }

};

/**
 * Get all Safetys
 * @param {Request} req
 * @param {Response} res
 * @return {Promise<void>}
 */

export const getSafetys = async (req, res) => {

  const { siteId } = req.query;

  if (siteId && !validObjectId(siteId)) { return res.status(400).json({ message: "Operation not valid" }); }

  const query = { };
  if (siteId) query.site = siteId;

  try {

    const safetys = await Safety.find(query).limit(20);
    return res.status(200).json({ safetys: safetys.reverse() });

  } catch (err) {

    console.log(colors.red("ERROR GETTING safetys"), err);
    return res.status(400).json({ message: "Error getting safetys" });

  }

};

/**
 * Get a Safety
 * @param {Request} req
 * @param {Response} res
 * @return {Promise<void>}
 */

export const getSafety = async (req, res) => {

  const { id } = req.params;
  if (!validObjectId(id)) { return res.status(400).json({ message: "Operation not valid" }); }

  try {

    const safety = await Safety.findById(id);
    if (!safety) {

      return res
        .status(400)
        .json({ message: "Safety does not exist or was deleted" });

    }

    return res.status(201).json({ safety });

  } catch (err) {

    console.log(colors.red("ERROR GETTING Safety \n"), err);
    return res.status(500).json({ message: "Error getting Safety" });

  }

};

export const getGeneratePdf = async (req, res, next) => {

  try {

    const { siteId, template } = req.params;
    const { safety } = req.query;

    const query = {};
    query.site = siteId;
    query._id = safety;

    const safetyData = await Safety.findOne(query);
    const { name } = await Sites.findOne({ _id: siteId });
    const date = moment(safetyData.date).format("YYYY-MM-DD");

    const data = { safetyData, name, date };

    const fileBuffer = await generatePDF(data, template);

    res.setHeader("Content-Disposition", "attachment; filename=panda.pdf");
    res.setHeader("Content-Type", "application/pdf");
    res.send(fileBuffer);

  } catch (err) {

    console.log(colors.red("ERROR GENERATING PDF safety \n"), err);
    res.status(400).json({ msg: "an error occurs" });
    next();

  }

};
