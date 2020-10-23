import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import Users from "../models/Users";
import BlacklistSessionTokens from "../models/BlacklistSessionTokens";
import colors from "colors";

/**
 * User Login
 * @param {Request} req
 * @param {Response} res
 * @return {Promise<void>}
 */

export const logIn = async (req, res) => {

  const { userName, password } = req.body;

  const errors = [];
  if (!userName) errors.push("Username is required");
  if (!password) errors.push("Password is required");

  if (errors.length) return res.status(400).json({ message: errors.join(", ") });

  try {

    const user = await Users.findOne({ userName });

    if (!user || !bcrypt.compareSync(password, user.password)) {

      return res.status(401).json({ message: "User or Password invalid" });

    } else if (!user.active) {

      return res.status(401).json({ message: "Inactive user" });

    }

    const token = jwt.sign(
      { userName: user.userName, id: user._id },
      process.env.SECRECT_KEY,
      { expiresIn: "5h" }
    );

    const auxUser = {
      _id: user._id,
      name: user.name,
      lastName: user.lastName,
      email: user.email,
      userName: user.userName
    };
    return res.status(200).json({ token, user: auxUser });

  } catch (err) {

    console.log(colors.red("FAILED TO LOGIN :\n"), err);
    return res.status(500).json({ message: "Failed to Login" });

  }

};

/**
 * User Logout
 * @param {Request} req
 * @param {Response} res
 * @return {Promise<void>}
 */

export const logout = async (req, res) => {

  const authHeader = req.get("Authorization");
  const token = authHeader.split(" ")[1];

  const tokenBlack = new BlacklistSessionTokens({ token });

  try {

    await tokenBlack.save();
    return res.status(200).json({ mesage: "Logout has been successfully!" });

  } catch (err) {

    console.log("ERROR TO LOGOUT :\n", err);
    return res.status(500).json({ message: "Error to logout" });

  }

};

/**
 * Validate User Authentication
 * @param {Request} req
 * @param {Response} res
 * @param {void} next
 * @return {Promise<void>}
 */

export const authenticate = async (req, res, next) => {

  const authHeader = req.get("Authorization");

  if (!authHeader) { return res.status(401).json({ message: "Unauthenticated" }); }

  const token = authHeader.split(" ")[1];

  try {

    const isBlackListed = await BlacklistSessionTokens.findOne({ token });
    if (isBlackListed) return res.status(401).json({ message: "Session has expired, please log in again" });

  } catch (err) {

    console.log(colors.red("FAILED TO AUTHENTICATE :\n"), err);
    return res.status(500).json({ message: "Failed to Authenticate" });

  }

  try {

    const verifyToken = jwt.verify(token, process.env.SECRECT_KEY);
    if (!verifyToken) return res.status(401).json({ message: "Unauthenticated" });

    req.user = verifyToken;
    const user = await Users.findById(req.user.id);
    if (!user) return res.status(401).json({ message: "User does not exist or was deleted" });

  } catch (err) {

    if (err.name === "TokenExpiredError") {

      return res.status(401).json({ message: "Session has expired, please log in again" });

    }

    console.log(colors.red("FAILED TO AUTHENTICATE :\n"), err);
    return res.status(500).json({ message: "Failed to Authenticate" });

  }

  return next();

};

/**
 * Verify Session User EXist
 * @param {Request} req
 * @param {Response} res
 * @return {Promise<void>}
 */

export const verifySession = async (req, res) => {

  try {

    const userFinded = await Users.findById(req.user.id);
    if (!userFinded) return res.status(401).json({ message: "User does not exist or was deleted" });

    const fullName = `${userFinded.name} ${userFinded.lastName}`;
    const user = {
      id: userFinded._id,
      email: userFinded.email,
      userName: userFinded.userName,
      name: userFinded.name,
      lastName: userFinded.lastName,
      fullName,
      site: userFinded.site,
      rol: userFinded.rol,
      level: userFinded.level
    };

    return res.status(200).json({ user });

  } catch (err) {

    console.log(colors.red("ERROR VERIFYING SESSION :\n"), err);
    return res.status(500).json({ message: "Failed to Authenticate" });

  }

};

/**
 * Verify / Active User Account
 * @param {Request} req
 * @param {Response} res
 * @return {Promise<void>}
 */

export const verifyAccount = async (req, res) => {

  const { token } = req.params;

  try {

    const user = await Users.findOne({ activationToken: token });

    if (!user) return res.status(403).json({ message: "Operation invalid" });
    else if (user.active) return res.status(200).json({ message: "account is already active" });

    await user.updateOne({ active: true });
    res.status(200).json({ message: "account has been activated successfully!" });

  } catch (err) {

    console.log("ACCOUNT VERIFICATION ERROR: \n", err);
    return res.status(500).json({ message: "Account verification error" });

  }

};
