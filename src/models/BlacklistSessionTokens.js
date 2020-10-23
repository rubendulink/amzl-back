import mongoose, { Schema } from "mongoose";

const BlacklistSessionTokens = new Schema({
  token: {
    type: String,
    required: true
  },
  expire_at: {
    type: Date,
    default: Date.now,
    expires: 18000
  }
},
{
  timestamps: true
});

export default mongoose.model("blacklistSessionTokens", BlacklistSessionTokens);
