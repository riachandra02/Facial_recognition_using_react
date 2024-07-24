// VerifyOTP.js
import React, { useState } from 'react';
import axios from 'axios';

function VerifyOTP() {
  const [otp, setOTP] = useState('');

  const verifyOTP = async () => {
    try {
      const response = await axios.post('/api/verify-otp', { otp });
      if (response.status === 200) {
        // OTP verification successful
      }
    } catch (error) {
      console.error('Error verifying OTP:', error);
    }
  };

  return (
    <div>
      <h1>Enter OTP</h1>
      <input
        type="text"
        value={otp}
        onChange={(e) => setOTP(e.target.value)}
      />
      <button onClick={verifyOTP}>Verify OTP</button>
    </div>
  );
}

export default VerifyOTP;
