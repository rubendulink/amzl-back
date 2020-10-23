import mongoose, { Schema } from "mongoose";

const docs = new Schema(
  {
    user: {
      type: String
    },
    date: {
      type: Date
    },
    site: {
      type: Schema.Types.ObjectId,
      required: "site is required",
      ref: "sites"
    },
    url: {
      type: String
    },
    name: {
      type: String
    },
    key: {
      type: String
    },
    size: {
      type: Number
    }
  }
);

export default mongoose.model("docs", docs);
