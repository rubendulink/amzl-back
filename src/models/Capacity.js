import mongoose, { Schema } from "mongoose";

const Capacity = new Schema({
  cycles: [],
  site: {
    type: Schema.Types.ObjectId,
    required: "site is required",
    ref: "sites"
  },
  date: {
    type: Date,
    required: "date is required"
  }
},
{
  timestamps: true
});

export default mongoose.model("capacities", Capacity);
