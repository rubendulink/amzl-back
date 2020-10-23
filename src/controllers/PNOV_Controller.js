import Pnov from "../models/PNOVs";
import colors from "colors";
import { validObjectId } from "../helpers/mongoose";
import moment from "moment";

/**
 * Get all PNOVs
 * @param {Request} req
 * @param {Response} res
 * @return {Promise<void>}
 */

export const getPNOVs = async (req, res) => {

  const { siteId, date: queryDate } = req.query;

  if (siteId && !validObjectId(siteId)) { return res.status(400).json({ message: "Operation not valid" }); }

  const query = { };
  if (siteId) query.site = siteId;

  const date = queryDate ? moment(queryDate).format("YYYY-MM-DD") : moment().format("YYYY-MM-DD");
  const startOfDay = date + "T00:00:00.000Z";
  const endOfDay = date + "T23:59:59.000Z";

  query.date = { $gte: startOfDay, $lte: endOfDay };

  try {

    const pnovs = await Pnov.find(query);
    return res.status(200).json({ pnovs });

  } catch (err) {

    console.log(colors.red("ERROR GETTING PNOVs"), err);
    return res.status(400).json({ message: "Error getting pnovs" });

  }

};

/**
 * Get a PNOV
 * @param {Request} req
 * @param {Response} res
 * @return {Promise<void>}
 */

export const getPNOV = async (req, res) => {

  const { id } = req.params;
  if (!validObjectId(id)) { return res.status(400).json({ message: "Operation not valid" }); }

  try {

    const pnov = await Pnov.findById(id);
    if (!pnov) {

      return res
        .status(400)
        .json({ message: "PNOV does not exist or was deleted" });

    }

    return res.status(201).json({ pnov });

  } catch (err) {

    console.log(colors.red("ERROR GETTING PNOV \n"), err);
    return res.status(500).json({ message: "Error getting pnov" });

  }

};

/**
 * Create PNOV
 * @param {Request} req
 * @param {Response} res
 * @return {Promise<void>}
 */

export const createPNOV = async (req, res) => {

  const newPNOV = { ...req.body };

  try {

    const createdPNOV = new Pnov(newPNOV);

    await createdPNOV.save();

    return res.status(200).json({ id: createdPNOV._id });

  } catch (err) {

    console.log(colors.red("ERROR CREATING PNOV :\n"), err);
    return res.status(500).json({ message: "Error creating pnov" });

  }

};

/**
 * Update PNOV
 * @param {Request} req
 * @param {Response} res
 * @return {Promise<void>}
 */

export const updatePNOV = async (req, res) => {

  const { id } = req.params;
  if (!validObjectId(id)) { return res.status(400).json({ message: "Operation not valid" }); }

  let pnov;
  try {

    pnov = await Pnov.findById(id);
    if (!pnov) {

      return res
        .status(400)
        .json({ message: "PNOV does not exist or was deleted" });

    }

  } catch (err) {

    console.log(colors.red("ERROR GETTING PNOV \n"), err);
    return res.status(500).json({ message: "Error getting pnov" });

  }

  try {

    await pnov.updateOne(req.body);
    return res.status(200).json({ message: "PNOV updated" });

  } catch (err) {

    console.log(colors.red("ERROR UPDATING PNOV :\n"), err);
    return res.status(500).json({ message: "Error updating pnov" });

  }

};

/**
 * Delete PNOV
 * @param {Request} req
 * @param {Response} res
 * @return {Promise<void>}
 */

export const deletePNOV = async (req, res) => {

  const { id } = req.params;
  if (!validObjectId(id)) { return res.status(400).json({ message: "Operation not valid" }); }

  let pnov;

  try {

    pnov = await Pnov.findById(id);
    if (!pnov) {

      return res
        .status(400)
        .json({ message: "PNOV does not exist or was deleted" });

    }

  } catch (err) {

    console.log(colors.red("ERROR GETTING PNOV \n"), err);
    return res.status(500).json({ message: "Error getting pnov" });

  }

  try {

    await pnov.remove();
    return res.status(200).json({ message: "PNOV deleted" });

  } catch (err) {

    console.log(colors.red("ERROR DELETING PNOV :\n"), err);
    return res.status(500).json({ message: "Error deleting pnov" });

  }

};
