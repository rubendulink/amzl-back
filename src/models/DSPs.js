import mongoose, { Schema } from "mongoose";

const DSPs = new Schema({
  site: {
    type: Schema.Types.ObjectId,
    ref: "sites"
  },
  name: {
    type: String,
    required: "dsps name is required",
    trim: true
  },
  alias: {
    type: String,
    required: "dsp alias is required",
    uppercase: true,
    trim: true
  }
},
{
  timestamps: true
});

export default mongoose.model("dsps", DSPs);
