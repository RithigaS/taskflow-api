import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import crypto from "crypto";

export interface IUser {
  email: string;
  password: string;
  name: string;
  role: "user" | "admin";
  avatar?: string;
  resetToken?: string;
  resetTokenExp?: Date;

  comparePassword(candidate: string): Promise<boolean>;
  generateResetToken(): string;
}

const userSchema = new mongoose.Schema<IUser>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      match: /^\S+@\S+\.\S+$/,
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
    },
    name: {
      type: String,
      required: true,
      minlength: 2,
      maxlength: 50,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    avatar: String,
    resetToken: String,
    resetTokenExp: Date,
  },
  { timestamps: true },
);

/**
 * Hash password before saving
 */
userSchema.pre("save", async function (this: any) {
  if (!this.isModified("password")) return;

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

/**
 * Compare password
 */
userSchema.methods.comparePassword = async function (
  candidate: string,
): Promise<boolean> {
  const user = this as mongoose.HydratedDocument<IUser>;
  return bcrypt.compare(candidate, user.password);
};

/**
 * Generate reset token
 */
userSchema.methods.generateResetToken = function (): string {
  const user = this as mongoose.HydratedDocument<IUser>;

  const token = crypto.randomBytes(32).toString("hex");

  user.resetToken = token;
  user.resetTokenExp = new Date(Date.now() + 60 * 60 * 1000);

  return token;
};

export const User = mongoose.models.User || mongoose.model("User", userSchema);
