import mongoose, { Schema } from "mongoose";
import Question from "./Question";

/*
  la checklist tendra un level y preguntas

*/

const Checklists = new Schema(
  {
    site: {
      type: Schema.Types.ObjectId,
      ref: "sites",
      required: "site is required"
    },
    report: {
      type: Schema.Types.ObjectId,
      ref: "siteReports",
      required: "site report is required"
    },
    questions: [
      {
        responseUser: {
          type: Schema.Types.ObjectId,
          ref: "users"
        },
        responseDate: {
          type: Date
        },
        comment: {
          type: String
        },
        // QUESTION LEVEL 1
        question: Question,
        // QUESTION LEVEL 2 (case example: in question type modal)
        subQuestions: [
          {
            question: Question,
            // QUESTION LEVEL3 (case example: in return driver verification)
            subQuestions: [
              {
                question: Question
              }
            ]
          }
        ]
      }
    ]
  },
  {
    timestamps: true
  }
);

export default mongoose.model("checklists", Checklists);
