import { User } from "../models/User";
import bcrypt from "bcryptjs";
import { generateToken } from "../utils/jwt";

class AuthService {
  async signup(data: any) {
    const existing = await User.findOne({ email: data.email });
    if (existing) throw new Error("User already exists");

    const user = await User.create(data);

    const token = generateToken(user._id.toString());

    return { user, token };
  }

  async login(email: string, password: string) {
    const user = await User.findOne({ email });
    if (!user) throw new Error("Invalid credentials");

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new Error("Invalid credentials");

    const token = generateToken(user._id.toString());

    return { user, token };
  }
}

export default new AuthService();
