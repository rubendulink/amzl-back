import Users from "../models/Users";
import bcrypt from "bcrypt";
import crypto from "crypto";
import { handleValidatorErrors, validObjectId } from "../helpers/mongoose";
import { amazonEmailValidation, sendEmail } from "../helpers/email";
import colors from "colors";

/**
 * Get all Users
 * @param {Request} req
 * @param {Response} res
 * @return {Promise<void>}
 */

export const getUsers = async (req, res) => {

  try {

    const users = await Users.find();
    return res.status(200).json({ users });

  } catch (err) {

    console.log(colors.red("ERROR GETTING USERS :\n"), err);
    return res.status(500).json({ message: "Error getting users" });

  }

};

/**
 * Get an User
 * @param {Request} req
 * @param {Response} res
 * @return {Promise<void>}
 */

export const getUser = async (req, res) => {

  try {

    const { id } = req.params;

    const user = await Users.findById(id);

    return res.status(200).json({ user });

  } catch (err) {

    console.log(colors.red("ERROR GETTING USER\n"), err);

    return res.status(500).json({ message: "Error getting user" });

  }

};

/**
 * Create User
 * @param {Request} req
 * @param {Response} res
 * @return {Promise<void>}
 */

export const createUser = async (req, res) => {

  const newUser = new Users(req.body);

  if (!amazonEmailValidation(newUser.email)) return res.status(400).json({ message: "Email invalid" });

  if (newUser.password) { newUser.password = await bcrypt.hash(newUser.password, 12); }

  const activationToken = crypto.randomBytes(24).toString("hex");
  const verificationUrl = `${process.env.FRONTEND_URL}/verify-user/${activationToken}`;
  newUser.activationToken = activationToken;

  const configEmail = {
    file: "verify-user",
    user: { email: newUser.email },
    subject: "verify amzl account",
    variables: { url: verificationUrl }
  };

  try {

    await newUser.save();
    await sendEmail(configEmail);

    return res.status(201).json({ message: "an email has been sent, please verify your account" });

  } catch (err) {

    if (err.code === 11000) { return res.status(400).json({ message: "Email is already registred" }); }

    let errors = [];
    if (err.errors) { errors = handleValidatorErrors(err.errors); }

    if (errors.length) { return res.status(400).json({ message: errors.join(", ") }); }

    console.log(colors.red("ERROR CREATING USER: \n"), err);
    return res.status(500).json({ message: "Error creating user" });

  }

};

/**
 * Update User
 * @param {Request} req
 * @param {Response} res
 * @return {Promise<void>}
 */

export const updateUser = async (req, res) => {

  const { id } = req.params;

  if (!validObjectId(id)) { return res.status(400).json({ message: "Operation invalid" }); }

  let userFinded;
  try {

    userFinded = await Users.findById(id);

    if (!userFinded) { return res.status(400).json({ message: "User does not exist or was deleted" }); }

  } catch (err) {

    console.log(colors.red("ERROR FINDING USER :\n"), err);
    return res.status(500).json({ message: "Error getting user" });

  }

  try {

    const { name, lastName, email, userName } = req.body;

    await userFinded.updateOne({ name, lastName, email, userName });

    return res.status(200).json({ message: "User has been updated successfully!" });

  } catch (err) {

    let errors = [];
    if (err.errors) { errors = handleValidatorErrors(err.errors); }

    if (errors.length) { return res.status(400).json({ message: errors.join(", ") }); }

    console.log(colors.red("ERROR EDITING USER : \n"), err);
    return res.status(500).json({ message: "Error editing user" });

  }

};

/**
 * Delete User
 * @param {Request} req
 * @param {Response} res
 * @return {Promise<void>}
 */

export const deleteUser = async (req, res) => {

  const { id } = req.params;

  if (!validObjectId(id)) { return res.status(400).json({ message: "Operation invalid" }); }

  let user;
  try {

    user = await Users.findById(id);
    if (!user) { return res.status(400).json({ message: "User does not exist or was deleted" }); }

    await user.remove();
    return res.status(200).json({ message: "User has been deleted successfully!" });

  } catch (err) {

    console.log(colors.red("ERROR DELETING USER :\n"), err);
    return res.status(500).json({ message: "Error deleting user" });

  }

};
