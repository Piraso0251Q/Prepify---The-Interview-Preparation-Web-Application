const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,          // no two users with same email
      lowercase: true,       // always store as lowercase
      trim: true,
    },
    passwordHash: {
      type: String,
      required: true,
      select: false,         // NEVER return password hash in queries by default
    },
    avatar: {
      type: String,          // initials like "AC" — generated from name
      default: "",
    },
    role: {
      type: String,
      default: "Frontend",   // selected interview role (can be changed)
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    // Subscription embedded in user document
    subscription: {
      plan: { type: String, default: null },        // 'monthly' | 'quarterly' | 'yearly'
      startDate: { type: Date, default: null },
      expiryDate: { type: Date, default: null },
    },
    // Refresh token stored to allow logout/invalidation
    refreshToken: {
      type: String,
      default: null,
      select: false,         // never returned in API responses
    },
  },
  {
    timestamps: true, // adds createdAt and updatedAt automatically
  }
);

// ── Hash password before saving ────────────────────────────
// This runs automatically whenever we save a new user or update password
userSchema.pre("save", async function () {
  // Only hash if the password field was actually changed
  if (!this.isModified("passwordHash")) return;
  this.passwordHash = await bcrypt.hash(this.passwordHash, 10);
});

// ── Instance method: compare entered password with stored hash ──
userSchema.methods.comparePassword = async function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.passwordHash);
};

// ── Instance method: get avatar initials from name ──────────
userSchema.methods.generateAvatar = function () {
  return this.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
};

module.exports = mongoose.model("User", userSchema);
