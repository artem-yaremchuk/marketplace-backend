import { model, Schema } from "mongoose";

const animalSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Animal name is required"],
    },
    animalType: {
      type: String,
      required: [true, "Animal type is required"],
    },
    breed: {
      type: String,
      required: [true, "Breed is required"],
    },
    age: {
      type: String,
      required: [true, "Age is required"],
    },
    gender: {
      type: String,
      enum: ["male", "female"],
      required: [true, "Gender is required"],
    },
    location: {
      type: String,
      required: [true, "Animal location is required"],
    },
    adTitle: {
      type: String,
      required: [true, "Ad title is required"],
    },
    adText: {
      type: String,
      required: [true, "Ad text is required"],
    },
    photos: {
      type: String,
      default: [],
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "user",
    },
  },
  { versionKey: false, timestamps: true },
);

const Animal = model("Animal", animalSchema);

export default Animal;
