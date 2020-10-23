import mongoose, { Schema } from "mongoose";
import Question from "./Question";

const QuestionModels = new Schema({
  level: {
    type: String,
    uppercase: true,
    required: "level is required"
  },
  modelType: {
    type: String,
    uppercase: true,
    required: "question model type is required"
  },
  cycle: Number,
  time: Date,
  task: String,
  // QUESTION LEVEL 1
  question: Question,
  // QUESTION LEVEL 2 (case example: in question type modal)
  subQuestions: [{
    question: Question,
    // QUESTION LEVEL3 (case example: in return driver verification)
    subQuestions: [{
      question: Question
    }]
  }]
});

export default mongoose.model("questionModels", QuestionModels);
