import mongoose from "mongoose";
// import timeZone from "mongoose-timezone";
import colors from "colors";

const uri = process.env.DATABASE_URL || "mongodb://localhost:27017/amzl";

const config = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false
};

mongoose.connect(uri, config)
  .then(() => console.log(colors.yellow("CONNECTED DATABASE: "), colors.gray(uri)))
  .catch(err => console.log(colors.red("ERROR CONECTING DATABASE : \n"), err));

// mongoose.plugin(timeZone);
