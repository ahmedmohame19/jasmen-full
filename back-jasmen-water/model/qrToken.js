const mongoose = require("mongoose");

// One document per issued QR login code.
// The raw token is NEVER stored, only its SHA-256 hash.
const qrTokenSchema = new mongoose.Schema(
  {
    tokenHash: { type: String, required: true, unique: true },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "Auth" }, // admin who issued it
    expiresAt: { type: Date, required: true },
    usedAt: { type: Date, default: null },
    usedIp: { type: String },
    usedUserAgent: { type: String },
    revokedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

// Keep expired records for 30 days as an audit trail, then Mongo deletes them.
qrTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 60 * 60 * 24 * 30 });

module.exports = mongoose.model("QrToken", qrTokenSchema);
