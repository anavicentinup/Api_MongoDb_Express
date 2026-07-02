import { Schema, model } from "mongoose";

const userSchema = new Schema(
  {
    username: { type: String, required: true, lowercase: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    phone: { type: String, default: "" },   // nuevo campo opcional
    address: { type: String, default: "" }, // nuevo campo opcional
    role: {type: String, enum: ["user", "admin"], default: "user"} // 👈 todos los nuevos entran como user
  },
  {
    versionKey: false,
    timestamps: true, // esto ya te da createdAt y updatedAt
  }
);

const User = model("User", userSchema);

export { User };
