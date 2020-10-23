import mongoose, { Schema } from "mongoose";

const PNOV = new Schema(
  {
    dsp: {
      type: String
    },
    daName: {
      type: String
    },
    daPhone: {
      type: String
    },
    route: {
      type: String
    },
    tba: {
      type: String
    },
    scan: {
      type: Boolean
    },
    // INFO
    weight: {
      type: Number
    },
    amount: {
      type: Number
    },
    cycle: {
      type: String
    },
    // TIMES
    inductor: {
      type: String
    },
    inductorTime: {
      type: String
    },
    stower: {
      type: String
    },
    stowerTime: {
      type: String
    },
    picker: {
      type: String
    },
    pickerTime: {
      type: String
    },
    sortZone: {
      type: String
    },
    OTRNote: {
      type: String
    },
    sortNote: {
      type: String
    },
    status: {
      type: String
    },
    site: {
      type: Schema.Types.ObjectId,
      ref: "site"
    },
    date: {
      type: Date,
      default: Date.now()
    }
  },
  {
    timestamps: true
  }
);

export default mongoose.model("pnovs", PNOV);
