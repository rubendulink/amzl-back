import QuestionModels from "../models/QuestionModels";
import colors from "colors";
import { validObjectId, handleValidatorErrors } from "../helpers/mongoose";

/**
 * Get all Question models
 * @param {Request} req
 * @param {Response} res
 * @return {Promise<void>}
 */

export const getQuestionModels = async (req, res) => {

  try {

    const questions = await QuestionModels.find();
    return res.status(200).json({ questions });

  } catch (err) {

    console.log(colors.red("ERROR GETTING QUESTION MODELS"), err);
    return res.status(400).json({ message: "Error getting question models" });

  }

};

/**
 * Get a Question
 * @param {Request} req
 * @param {Response} res
 * @return {Promise<void>}
 */

export const getQuestionModel = async (req, res) => {

  const { id } = req.params;
  if (!validObjectId(id)) return res.status(400).json({ message: "Operation not valid" });

  try {

    const question = await QuestionModels.findById(id);
    if (!question) return res.status(400).json({ message: "Question does not exist or was deleted" });

    return res.status(201).json({ question });

  } catch (err) {

    console.log(colors.red("ERROR GETTING QUESTION MODEL \n"), err);
    return res.status(500).json({ message: "Error getting question" });

  }

};

/**
 * Create Question model
 * @param {Request} req
 * @param {Response} res
 * @return {Promise<void>}
 */

export const createQuestionModel = async (req, res) => {

  const question = new QuestionModels(req.body);

  try {

    await question.save();

    return res.status(200).json({ id: question._id });

  } catch (err) {

    let errors = [];

    if (err.errors) { errors = handleValidatorErrors(err.errors); }

    if (errors.length) { return res.status(400).json({ message: errors.join(", ") }); }

    console.log(colors.red("ERROR CREATING QUESTION MODEL :\n"), err);
    return res.status(500).json({ message: "Error creating question model" });

  }

};

/**
 * Update Question Model
 * @param {Request} req
 * @param {Response} res
 * @return {Promise<void>}
 */

export const updateQuestionModel = async (req, res) => {

  const { id } = req.params;
  if (!validObjectId(id)) return res.status(400).json({ message: "Operation not valid" });

  let question;
  try {

    question = await QuestionModels.findById(id);
    if (!question) return res.status(400).json({ message: "Question does not exist or was deleted" });

  } catch (err) {

    console.log(colors.red("ERROR GETTING QUESTION MODEL \n"), err);
    return res.status(500).json({ message: "Error getting question model" });

  }

  try {

    await question.updateOne(req.body);
    return res.status(200).json({ message: "Question model updated" });

  } catch (err) {

    let errors = [];

    if (err.errors) { errors = handleValidatorErrors(err.errors); }

    if (errors.length) { return res.status(400).json({ message: errors.join(", ") }); }

    console.log(colors.red("ERROR UPDATING QUESTION MODEL :\n"), err);
    return res.status(500).json({ message: "Error updating question model" });

  }

};

/**
 * Delete question model
 * @param {Request} req
 * @param {Response} res
 * @return {Promise<void>}
 */

export const deleteQuestionModel = async (req, res) => {

  const { id } = req.params;
  if (!validObjectId(id)) return res.status(400).json({ message: "Operation not valid" });

  let question;
  try {

    question = await QuestionModels.findById(id);
    if (!question) return res.status(400).json({ message: "Question model does not exist or was deleted" });

  } catch (err) {

    console.log(colors.red("ERROR GETTING QUESTION MODEL \n"), err);
    return res.status(500).json({ message: "Error getting question model" });

  }

  try {

    await question.remove();
    return res.status(200).json({ message: "Question model deleted" });

  } catch (err) {

    console.log(colors.red("ERROR DELETING QUESTION MODEL :\n"), err);
    return res.status(500).json({ message: "Error deleting question model" });

  }

};
