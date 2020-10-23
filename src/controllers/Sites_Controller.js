import Sites from "../models/Sites";
import colors from "colors";
import { validObjectId } from "../helpers/mongoose";

/**
 * Get all Sites
 * @param {Request} req
 * @param {Response} res
 * @return {Promise<void>}
 */

export const getSites = async (req, res) => {

  try {

    const sites = await Sites.find()
      .select("name city state setup");
    return res.status(200).json({ sites });

  } catch (err) {

    console.log(colors.red("ERROR GETTING SITES"), err);
    return res.status(400).json({ message: "Error getting sites" });

  }

};

/**
 * Get a Site
 * @param {Request} req
 * @param {Response} res
 * @return {Promise<void>}
 */

export const getSite = async (req, res) => {

  const { id } = req.params;
  if (!validObjectId(id)) return res.status(400).json({ message: "Operation not valid" });

  try {

    const site = await Sites.findById(id)
      .select("name city state setup");
    if (!site) return res.status(400).json({ message: "Site does not exist or was deleted" });

    return res.status(201).json({ site });

  } catch (err) {

    console.log(colors.red("ERROR GETTING SITE \n"), err);
    return res.status(500).json({ message: "Error getting site" });

  }

};

/**
 * Create Site
 * @param {Request} req
 * @param {Response} res
 * @return {Promise<void>}
 */

export const createSite = async (req, res) => {

  const newSite = { ...req.body };

  try {

    const createdSite = new Sites(newSite);
    await createdSite.save();

    return res.status(200).json({ id: createdSite._id });

  } catch (err) {

    console.log(colors.red("ERROR CREATING SITE :\n"), err);
    return res.status(500).json({ message: "Error creating site" });

  }

};

/**
 * Update Site
 * @param {Request} req
 * @param {Response} res
 * @return {Promise<void>}
 */

export const updateSite = async (req, res) => {

  const { id } = req.params;
  if (!validObjectId(id)) return res.status(400).json({ message: "Operation not valid" });

  let site;
  try {

    site = await Sites.findById(id);
    if (!site) return res.status(400).json({ message: "Site does not exist or was deleted" });

  } catch (err) {

    console.log(colors.red("ERROR GETTING SITE \n"), err);
    return res.status(500).json({ message: "Error getting site" });

  }

  try {

    await site.updateOne(req.body);
    return res.status(200).json({ message: "Site updated" });

  } catch (err) {

    console.log(colors.red("ERROR UPDATING SITE :\n"), err);
    return res.status(500).json({ message: "Error updating site" });

  }

};

/**
 * Delete Site
 * @param {Request} req
 * @param {Response} res
 * @return {Promise<void>}
 */

export const deleteSite = async (req, res) => {

  const { id } = req.params;
  if (!validObjectId(id)) return res.status(400).json({ message: "Operation not valid" });

  let site;

  try {

    site = await Sites.findById(id);
    if (!site) return res.status(400).json({ message: "Site does not exist or was deleted" });

  } catch (err) {

    console.log(colors.red("ERROR GETTING SITE \n"), err);
    return res.status(500).json({ message: "Error getting site" });

  }

  try {

    await site.remove();
    return res.status(200).json({ message: "Site deleted" });

  } catch (err) {

    console.log(colors.red("ERROR DELETING SITE :\n"), err);
    return res.status(500).json({ message: "Error deleting site" });

  }

};
