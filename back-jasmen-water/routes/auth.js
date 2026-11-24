const express = require('express');
const rateLimit = require('express-rate-limit');

const { login, register, verfiyUser, logOut } = require('../controller/auth');
const { issueQr, redeemQr, listUserQr, revokeQr } = require('../controller/qrAuth');
const { verfiyAdmin } = require('../utils/verfy_user_token/verfy');

const router = express.Router();

// Brute-force protection for the public QR redeem endpoint.
const qrRedeemLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { msg: 'Too many attempts, try again later' },
});

router.post('/Login', login);

router.post('/SignUp', register);

router.post('/LogOut/:id', logOut);

router.post('/verfiyUser', verfiyUser);

// QR code login
router.post('/qr/issue', verfiyAdmin, issueQr);
router.post('/qr/redeem', qrRedeemLimiter, redeemQr);
router.get('/qr/user/:userId', verfiyAdmin, listUserQr);
router.delete('/qr/:id', verfiyAdmin, revokeQr);

router.get('/mmn', (req, res) => res.send('server running successffuly'));

module.exports = router;
