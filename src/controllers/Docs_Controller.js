import Docs from "../models/Docs";
import colors from "colors";
import { validObjectId } from "../helpers/mongoose";

/**
 * Create Docs
 * @param {Request} req
 * @param {Response} res
 * @return {Promise<void>}
 */

export const createDocs = async (req, res) => {

  const newDocs = { ...req.body };

  try {

    const createdDocs = new Docs(newDocs);

    await createdDocs.save();

    return res.status(200).json({ id: createdDocs._id });

  } catch (err) {

    console.log(colors.red("ERROR CREATING Docs :\n"), err);
    return res.status(500).json({ message: "Error creating Docs" });

  }

};

/**
 * Get all Docs
 * @param {Request} req
 * @param {Response} res
 * @return {Promise<void>}
 */

export const getDocs = async (req, res) => {

  const { siteId } = req.query;

  if (siteId && !validObjectId(siteId)) { return res.status(400).json({ message: "Operation not valid" }); }

  const query = { };
  if (siteId) query.site = siteId;

  try {

    const docs = await Docs.find(query).limit(20);
    return res.status(200).json({ docs: docs.reverse() });

  } catch (err) {

    console.log(colors.red("ERROR GETTING docs"), err);
    return res.status(400).json({ message: "Error getting docs" });

  }

};

/**
 * Get a Doc
 * @param {Request} req
 * @param {Response} res
 * @return {Promise<void>}
 */

export const getDoc = async (req, res) => {

  const { id } = req.params;
  if (!validObjectId(id)) { return res.status(400).json({ message: "Operation not valid" }); }

  try {

    const doc = await Docs.findById(id);
    if (!doc) {

      return res
        .status(400)
        .json({ message: "Docs does not exist or was deleted" });

    }

    return res.status(201).json({ doc });

  } catch (err) {

    console.log(colors.red("ERROR GETTING Docs \n"), err);
    return res.status(500).json({ message: "Error getting Docs" });

  }

};

/**
 * Delete Docs
 * @param {Request} req
 * @param {Response} res
 * @return {Promise<void>}
 */

export const deleteDocs = async (req, res) => {

  const { id } = req.params;
  if (!validObjectId(id)) { return res.status(400).json({ message: "Operation not valid" }); }

  let docs;

  try {

    docs = await Docs.findById(id);
    if (!docs) {

      return res
        .status(400)
        .json({ message: "Docs does not exist or was deleted" });

    }

  } catch (err) {

    console.log(colors.red("ERROR GETTING Docs \n"), err);
    return res.status(500).json({ message: "Error getting Docs" });

  }

  try {

    await docs.remove();
    return res.status(200).json({ message: "Docs deleted" });

  } catch (err) {

    console.log(colors.red("ERROR DELETING Docs :\n"), err);
    return res.status(500).json({ message: "Error deleting Docs" });

  }

};