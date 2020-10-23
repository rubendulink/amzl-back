import "babel-polyfill"; // IMPORT BABEL POLYFILL TO USE ASYNC/AWAIT
import "./envairoment"; // IMPOPORT ENVAIOMENT VARIABLES
import "./database"; // IMPORT DATABASE
import "./functions";
import express from "express";
import bodyParser from "body-parser";
import morgan from "morgan";
import cors from "cors";
import routes from "./routes";
import colors from "colors";
import path from "path";

// ========================================
//            EXPRESS CONFIGS
// ========================================

// INSTANTIATE EXPRESS APP
const app = express();

// ENABLE BODY PARSER
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// ENABLE MORGAN
app.use(morgan("dev"));

// ENABLE CORS
app.use(cors());
// const whiteList = [process.env.FRONTEND_URL]; // DOMAINS ALLOWED LIST
// app.use(cors({
//   origin: (origin, callback) => {

//     const exist = whiteList.some(domain => domain === origin);
//     if (exist) callback(null, true);
//     else callback(new Error("access denied by policy CORS"));

//   }
// }));
app.get("/", (req, res) => res.send("SERVER WORKING!!"));

// USE ROUTES
app.use("/api", routes());

// PORT
app.set("PORT", process.env.PORT || 8000);

// INITIALIZE APP
app.listen(app.get("PORT"), () => {

  console.log(colors.yellow("SERVER ON PORT : "), colors.gray(app.get("PORT")));

});
