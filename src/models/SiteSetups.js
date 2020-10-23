import mongoose, { Schema } from "mongoose";

const SiteSetups = new Schema({
  levels: [{
    level: {
      type: String,
      uppercase: true,
      trim: true,
      required: "level is required"
    },
    disabledFor: [{
      type: String,
      uppercase: true,
      trim: true
    }]
  }],
  cycles: [{
    cycle: {
      type: Number,
      required: "cycle is required"
    },
    wavesCount: {
      type: Number,
      required: "waves count is required"
    }
  }],
  times: [{
    time: {
      type: Date,
      required: "time is required"
    }
  }],
  tasks: [{
    task: {
      type: String,
      required: "task is required"
    }
  }],
  questionModels: [{
    questionModel: {
      type: Schema.Types.ObjectId,
      required: "question model is required",
      ref: "questionModels"
    }
  }],
  dsps: [{
    type: Schema.Types.ObjectId,
    ref: "dsps"
  }],
  mainMessage: {
    user: {
      type: String,
      required: true
    },
    date: {
      type: Date,
      default: Date.now()
    },
    title: {
      type: String,
      required: "Title is require"
    },
    content: {
      type: String,
      required: "Content is required"
    }
  }
});

export default mongoose.model("siteSetups", SiteSetups);
