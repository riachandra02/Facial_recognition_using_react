const express = require('express');
const cors = require('cors');
const speakeasy = require('speakeasy');
const QRCode = require('qrcode');

const app = express();
const port = 5000;

// Enable CORS for all routes
app.use(cors());

// Generate a secret key and QR code for the user
app.get('/generate-secret', (req, res) => {
    const secret = speakeasy.generateSecret({ length: 20 });

    // Generate a QR code URL
    QRCode.toDataURL(secret.otpauth_url, (err, data_url) => {
        if (err) {
            console.error('Error generating QR code:', err);
            res.status(500).json({ success: false, error: 'Error generating QR code' });
        } else {
            res.json({ success: true, secret: secret.base32, qrCodeUrl: data_url });
        }
    });
});

// Verify the entered TOTP code
app.post('/verify-totp', express.json(), (req, res) => {
    const { secret, totp } = req.body;
    const verified = speakeasy.totp.verify({
        secret,
        encoding: 'base32',
        token: totp,
        window: 1 // Allow a 1-time window to compensate for clock skew
    });
    
    if (verified) {
        res.json({ success: true, message: 'TOTP verified successfully' });
    } else {
        res.status(400).json({ success: false, error: 'Invalid TOTP' });
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
