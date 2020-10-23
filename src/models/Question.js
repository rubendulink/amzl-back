import { Schema } from "mongoose";

export default new Schema({
  label: {
    type: String,
    required: "question label is required"
  },
  questionType: {
    type: String,
    required: "question type is required",
    uppercase: true
  },
  category: {
    type: String
  },
  answer: {
    type: Schema.Types.Mixed
  },
  options: {
    type: Array
  },
  iconText: {
    type: String
  },
  externalLink: {
    type: String
  },
  internalLink: {
    type: String
  },
  NA: {
    type: Boolean,
    default: false
  }
});
