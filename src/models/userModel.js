import { Schema, model } from "mongoose";

const userSchema = new Schema(
  {
    username: { type: String, required: true, lowercase: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    phone: { type: String, default: "" },   
    address: { type: String, default: "" }, 
    role: {type: String, enum: ["user", "admin"], default: "user"} 
  },
  {
    versionKey: false,
    timestamps: true
  }
);

const User = model("User", userSchema);

export { User };
