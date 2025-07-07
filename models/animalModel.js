import { model, Schema } from "mongoose";

const animalSchema = new Schema(
  {
    animalName: {
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
    size: {
      type: String,
    },
    weight: {
      type: String,
    },
    coat: {
      type: String,
    },
    age: {
      years: {
        type: Number,
        required: [true, "Years is required"],
      },
      months: {
        type: Number,
        required: [true, "Months is required"],
      },
    },
    gender: {
      type: String,
      enum: ["male", "female", "unknown"],
      required: [true, "Gender is required"],
    },
    animalLocation: {
      type: String,
      required: [true, "Animal location is required"],
    },
    adText: {
      type: String,
      required: [true, "Ad text is required"],
    },
    animalImages: [
      {
        url: {
          type: String,
          required: [true, "Url is required"],
        },
        publicId: {
          type: String,
          required: [true, "Public ID is required"],
        },
        _id: false,
      },
    ],
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
    isHidden: {
      type: Boolean,
      default: false,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { versionKey: false, timestamps: true },
);

animalSchema.index({ status: 1, isHidden: 1 });
animalSchema.index({ animalType: 1 });
animalSchema.index({ breed: 1 });
animalSchema.index({ gender: 1 });
animalSchema.index({ size: 1 });
animalSchema.index({ "age.years": 1 });
animalSchema.index({ animalLocation: 1 });
animalSchema.index({ owner: 1 });  

const Animal = model("Animal", animalSchema);

export default Animal;