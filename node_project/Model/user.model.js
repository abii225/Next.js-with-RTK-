const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
  {
    username: { type: String, required: false },
    password: { type: String, required: false, minlength: 8 },
    phone: { type: String, required: false, default: "" },
    address: { type: String, required: false, default: "" },
    email: { type: String, required: true },
    role: { type: String, enum: ["user", "admin"], default: "user" },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

const UserModel = mongoose.model("user", userSchema);

module.exports = { UserModel };
