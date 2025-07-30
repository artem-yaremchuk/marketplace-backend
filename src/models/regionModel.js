import { model, Schema } from "mongoose";

const regionSchema = new Schema(
  {
    id: {
      type: String,
      required: [true, "Region id is required"],
    },
    name: {
      type: String,
      required: [true, "Region name is required"],
    },
  },
  { versionKey: false },
);

const Region = model("Region", regionSchema);

export default Region;
