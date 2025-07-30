import { model, Schema } from "mongoose";

const citySchema = new Schema(
  {
    idArea: {
      type: String,
      required: [true, "City idArea is required"],
    },
    idCity: {
      type: String,
      default: "",
    },
    name: {
      type: String,
      required: [true, "City name is required"],
    },
  },
  { versionKey: false },
);

const City = model("City", citySchema);

export default City;
