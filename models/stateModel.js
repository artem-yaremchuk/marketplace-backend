import { model, Schema } from "mongoose";

const stateSchema = new Schema(
  {
    id: {
      type: String,
      required: [true, "State id is required"],
    },
    name: {
      type: String,
      required: [true, "State name is required"],
    },
  },
  { versionKey: false },
);

const State = model("State", stateSchema);

export default State;
