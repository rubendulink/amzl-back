import mongoose, { Schema } from "mongoose";

const Users = new Schema({
  name: {
    type: String,
    trim: true
    // required: "Name is required"
  },
  lastName: {
    type: String,
    trim: true
    // required: "Lastname is required"
  },
  email: {
    type: String,
    unique: true,
    lowercase: true,
    trim: true,
    required: "Email is required"
  },
  password: {
    type: String,
    required: "Password is required"
  },
  userName: {
    type: String,
    required: "Username is required",
    lowercase: true,
    trim: true
  },
  site: {
    type: Schema.Types.ObjectId,
    ref: "sites"
  },
  level: {
    type: String
  },
  rol: {
    type: String,
    default: "USER"
  },
  sessionToken: {
    type: String
  },
  activationToken: {
    type: String
  },
  active: {
    type: Boolean,
    default: true
  }

},
{
  timestamps: true
});

export default mongoose.model("users", Users);
