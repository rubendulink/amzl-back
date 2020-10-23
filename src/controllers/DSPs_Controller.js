import DSPs from "../models/DSPs";
import colors from "colors";
import { validObjectId } from "../helpers/mongoose";

/**
 * Get all Sites
 * @param {Request} req
 * @param {Response} res
 * @return {Promise<void>}
 */

export const getDSPs = async (req, res) => {

  const { siteId } = req.query;
  if (siteId && !validObjectId(siteId)) return res.status(400).json({ message: "Operation not valid" });
  const query = siteId ? { site: siteId } : {};

  try {

    const dsps = await DSPs.find(query);
    return res.status(200).json({ dsps });

  } catch (err) {

    console.log(colors.red("ERROR GETTING DSPs"), err);
    return res.status(400).json({ message: "Error getting dsps" });

  }

};

/**
 * Get a Site
 * @param {Request} req
 * @param {Response} res
 * @return {Promise<void>}
 */

export const getDSP = async (req, res) => {

  const { id } = req.params;
  if (!validObjectId(id)) return res.status(400).json({ message: "Operation not valid" });

  try {

    const dsp = await DSPs.findById(id);
    if (!dsp) return res.status(400).json({ message: "dsp does not exist or was deleted" });

    return res.status(201).json({ dsp });

  } catch (err) {

    console.log(colors.red("ERROR GETTING dsp \n"), err);
    return res.status(500).json({ message: "Error getting dsp" });

  }

};

/**
 * Create Site
 * @param {Request} req
 * @param {Response} res
 * @return {Promise<void>}
 */

export const createDSP = async (req, res) => {

  try {

    const createdDSP = new DSPs(req.body);
    await createdDSP.save();

    return res.status(200).json({ id: createdDSP._id });

  } catch (err) {

    console.log(colors.red("ERROR CREATING DSP :\n"), err);
    return res.status(500).json({ message: "Error creating dsp" });

  }

};

/**
 * Update Site
 * @param {Request} req
 * @param {Response} res
 * @return {Promise<void>}
 */

export const updateDSP = async (req, res) => {

  const { id } = req.params;
  if (!validObjectId(id)) return res.status(400).json({ message: "Operation not valid" });

  let dsp;
  try {

    dsp = await dsp.findById(id);
    if (!dsp) return res.status(400).json({ message: "dsp does not exist or was deleted" });

  } catch (err) {

    console.log(colors.red("ERROR GETTING SITE \n"), err);
    return res.status(500).json({ message: "Error getting site" });

  }

  try {

    await dsp.updateOne(req.body);
    return res.status(200).json({ message: "dsp updated" });

  } catch (err) {

    console.log(colors.red("ERROR UPDATING DSP :\n"), err);
    return res.status(500).json({ message: "Error updating dsp" });

  }

};

/**
 * Delete Site
 * @param {Request} req
 * @param {Response} res
 * @return {Promise<void>}
 */

export const deleteDSP = async (req, res) => {

  const { id } = req.params;
  if (!validObjectId(id)) return res.status(400).json({ message: "Operation not valid" });

  let dsp;

  try {

    dsp = await DSPs.findOne({ _id: id });
    if (!dsp) return res.status(400).json({ message: "dsp does not exist or was deleted" });

  } catch (err) {

    console.log(colors.red("ERROR GETTING SITE \n"), err);
    return res.status(500).json({ message: "Error getting dsp" });

  }

  try {

    await DSPs.deleteOne({ _id: id });
    return res.status(200).json({ message: "dsp deleted" });

  } catch (err) {

    console.log(colors.red("ERROR DELETING SITE :\n"), err);
    return res.status(500).json({ message: "Error deleting dsp" });

  }

};
