import mongoose, { Schema } from "mongoose";

const Sites = new Schema({
  name: {
    type: String,
    unique: true,
    required: "Name is required"
  },
  city: {
    type: String,
    required: "City is required"
  },
  state: {
    type: String,
    required: "State is required"
  },
  setup: {
    type: Schema.Types.ObjectId,
    ref: "siteSetups"
  }
},
{
  timestamps: true
});

export default mongoose.model("sites", Sites);
