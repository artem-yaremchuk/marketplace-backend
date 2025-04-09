import { model, Schema } from "mongoose";

const traitSchema = new Schema({
  breed: {
    type: String,
    required: true,
  },
  size: {
    type: String,
    default: "",
  },
  weight: {
    type: String,
    default: "",
  },
  coat: {
    type: String,
    default: "",
  },
});

const animalTraitsSchema = new Schema(
  {
    dogs: [traitSchema],
    cats: [traitSchema],
    birds: [traitSchema],
    other: {
      type: String,
      required: true,
    },
  },
  { versionKey: false, timestamps: true },
);

const AnimalTraits = model("AnimalTraits", animalTraitsSchema);

export default AnimalTraits;