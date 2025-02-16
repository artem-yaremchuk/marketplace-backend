import { v4 } from "uuid";
import { User } from "../models/userModel.js";
import HttpError from "../helpers/HttpError.js";

export const signup = async (userData) => {
    const { email } = userData;
    const user = await User.findOne({ email });

    if (user) {
        throw HttpError(409, "Email in use");
    }

    userData.verificationToken = v4();

    const newUser = await User.create(userData);

    return newUser;
};