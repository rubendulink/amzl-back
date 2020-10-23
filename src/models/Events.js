import mongoose, { Schema } from "mongoose";
import { getDate, getTime, setDate, setTime } from "../helpers/mongoose";

const Event = new Schema({
  site: {
    type: Schema.Types.ObjectId,
    ref: "sites"
  },
  topic: {
    type: String,
    required: "Topic is required"
  },
  startDate: {
    type: Date,
    required: "Start date is required",
    get: getDate,
    set: setDate
  },
  startTime: {
    type: Date,
    required: "Start time is required",
    get: getTime,
    set: setTime
  },
  endDate: {
    type: Date,
    required: "End date is required",
    get: getDate,
    set: setDate
  },
  endTime: {
    type: Date,
    required: "End time is required",
    get: getTime,
    set: setTime
  },
  color: String,
  ams: [String]
},
{
  timestamps: true,
  toJSON: {
    getters: true
  }
}
);

export default mongoose.model("events", Event);
