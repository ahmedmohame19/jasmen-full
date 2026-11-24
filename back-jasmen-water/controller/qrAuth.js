const crypto = require("crypto");
const QRCode = require("qrcode");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const QrToken = require("../model/qrToken");
const User = require("../model/user");
const Auth = require("../model/auth");
require("dotenv").config();

const DEFAULT_TTL_MINUTES = 60 * 24; // 24 hours
const MAX_TTL_MINUTES = 60 * 24 * 30; // 30 days

const hashToken = (token) =>
  crypto.createHash("sha256").update(token).digest("hex");

// ADMIN: issue a one-time login QR for a customer.
// POST /auth/v1/qr/issue   body: { userId, expiresInMinutes? }
const issueQr = async (req, res) => {
  try {
    const { userId } = req.body;
    if (!userId || !mongoose.isValidObjectId(userId)) {
      return res.status(400).json({ error: "A valid userId is required" });
    }

    let ttl = Number(req.body.expiresInMinutes) || DEFAULT_TTL_MINUTES;
    ttl = Math.min(Math.max(ttl, 1), MAX_TTL_MINUTES);

    const user = await User.findById(userId).select("userName email isAdmin");
    if (!user) return res.status(404).json({ error: "User not found" });
    if (user.isAdmin) {
      return res
        .status(403)
        .json({ error: "QR login cannot be issued for admin accounts" });
    }

    // Re-issuing invalidates every previous unused code for this user.
    await QrToken.updateMany(
      { userId: user._id, usedAt: null, revokedAt: null },
      { $set: { revokedAt: new Date() } }
    );

    const rawToken = crypto.randomBytes(32).toString("base64url");
    const expiresAt = new Date(Date.now() + ttl * 60 * 1000);

    const record = await QrToken.create({
      tokenHash: hashToken(rawToken),
      userId: user._id,
      createdBy: req.user && req.user._id,
      expiresAt,
    });

    // Token goes in the URL fragment so it is not sent to servers or logged.
    const base = (process.env.QR_LOGIN_BASE_URL || "").replace(/\/$/, "");
    if (!base) {
      return res
        .status(500)
        .json({ error: "QR_LOGIN_BASE_URL is not configured on the server" });
    }
    const link = `${base}#t=${rawToken}`;

    const qrDataUrl = await QRCode.toDataURL(link, {
      errorCorrectionLevel: "M",
      margin: 2,
      width: 512,
    });

    // The raw token / link is only ever returned here, once.
    res.status(201).json({
      id: record._id,
      expiresAt,
      link,
      qrDataUrl,
      user: { _id: user._id, userName: user.userName, email: user.email },
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to issue QR code" });
  }
};

// PUBLIC (rate-limited): exchange a scanned token for a normal login session.
// POST /auth/v1/qr/redeem   body: { token }
const redeemQr = async (req, res) => {
  const invalid = () =>
    res.status(401).json({ msg: "QR code is invalid, expired or already used" });

  try {
    const { token } = req.body;
    if (typeof token !== "string" || token.length < 20 || token.length > 200) {
      return invalid();
    }

    // Atomic "check and burn": two simultaneous scans can never both succeed.
    const record = await QrToken.findOneAndUpdate(
      {
        tokenHash: hashToken(token),
        usedAt: null,
        revokedAt: null,
        expiresAt: { $gt: new Date() },
      },
      {
        $set: {
          usedAt: new Date(),
          usedIp: req.ip,
          usedUserAgent: String(req.get("user-agent") || "").slice(0, 300),
        },
      },
      { new: true }
    );
    if (!record) return invalid();

    const customer = await User.findById(record.userId);
    if (!customer || customer.isAdmin) return invalid();

    // Same identity resolution as /Login: Auth record first, then User.
    const account =
      (await Auth.findOne({
        $or: [
          { email: customer.email },
          { SearchEmail: customer.email.toLowerCase() },
        ],
      })) || customer;

    // Same session behaviour as /Login so /verfiyUser keeps working.
    let accessToken = account.token;
    if (!accessToken) {
      accessToken = jwt.sign(
        { _id: account._id, isAdmin: account.isAdmin },
        process.env.kEY_ENCRYPT
      );
      account.token = accessToken;
      await account.save();
    }

    const { __v, password, isAdmin, SearchEmail, ...other } = account._doc;
    res
      .header("access_token", accessToken)
      .send({ role: "authenticated", user: other });
  } catch (error) {
    res.status(400).json({ msg: "error in QR login" });
  }
};

// ADMIN: list QR codes issued for a user (metadata only).
// GET /auth/v1/qr/user/:userId
const listUserQr = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.userId)) {
      return res.status(400).json({ error: "Invalid userId" });
    }
    const items = await QrToken.find({ userId: req.params.userId })
      .select("-tokenHash -__v")
      .sort({ createdAt: -1 })
      .limit(50)
      .lean();
    res.status(200).json({ items });
  } catch (error) {
    res.status(500).json({ error: "Failed to list QR codes" });
  }
};

// ADMIN: revoke a QR code.
// DELETE /auth/v1/qr/:id
const revokeQr = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ error: "Invalid id" });
    }
    const record = await QrToken.findOneAndUpdate(
      { _id: req.params.id, usedAt: null, revokedAt: null },
      { $set: { revokedAt: new Date() } },
      { new: true }
    );
    if (!record) {
      return res
        .status(404)
        .json({ error: "QR code not found or already used/revoked" });
    }
    res.status(200).json({ message: "QR code revoked" });
  } catch (error) {
    res.status(500).json({ error: "Failed to revoke QR code" });
  }
};

module.exports = { issueQr, redeemQr, listUserQr, revokeQr };
