import { model, Schema } from "mongoose";
import { compare, genSalt, hash } from "bcrypt";
import { themeTypes } from "../constants/constants.js";

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Username is required"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
    },
    location: {
      type: String,
      required: [true, "Location is required"],
    },
    phone: {
      type: String,
      required: [true, "Phone is required"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    resetPasswordToken: {
      type: String,
      default: null,
    },
    userType: {
      type: String,
      enum: ["guardian", "adopter"],
      required: [true, "User type is required"],
    },
    avatarURL: {
      type: String,
      default: "",
    },
    verify: {
      type: Boolean,
      default: false,
    },
    verificationToken: {
      type: String,
      required: [
        function () {
          return !this.verify;
        },
        "Verification token is required",
      ],
    },
    token: {
      type: String,
      default: null,
    },
    theme: {
      type: String,
      enum: themeTypes,
      default: "light",
    },
    favorites: [{
      type: Schema.Types.ObjectId,
      ref: "Animal",
    }],
    resetPasswordCode: {
      type: String,
      default: null,
    },
    resetPasswordExpires: {
      type: Number,
      default: null,
    },
  },
  { versionKey: false, timestamps: true },
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  const salt = await genSalt(10);
  this.password = await hash(this.password, salt);

  next();
});

userSchema.methods.checkPassword = (candidate, passwordHash) =>
  compare(candidate, passwordHash);

const User = model("User", userSchema);

export default User;