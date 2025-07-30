import { model, Schema } from "mongoose";

const deletedUserSchema = new Schema(
  {
    deletedAt: {
      type: Date,
      default: Date.now,
    },
    userData: {
      type: Schema.Types.Mixed,
      required: true,
    },
  },
  { versionKey: false, timestamps: false },
);

const deletedUser = new model("DeletedUser", deletedUserSchema);

export default deletedUser;