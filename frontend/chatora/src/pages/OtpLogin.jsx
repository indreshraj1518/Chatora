import { useState } from "react";
import { auth } from "../firebase";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API = "http://localhost:5000/api";

const OtpLogin = () => {
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [showOtp, setShowOtp] = useState(false);

  const navigate = useNavigate();

  // 📱 SEND OTP
  const sendOtp = async () => {
    window.recaptchaVerifier = new RecaptchaVerifier(
      "recaptcha",
      { size: "invisible" },
      auth
    );

    const confirmation = await signInWithPhoneNumber(
      auth,
      "+91" + phone,
      window.recaptchaVerifier
    );

    window.confirmationResult = confirmation;

    setShowOtp(true);
    alert("OTP sent ✅");
  };

  // 🔐 VERIFY OTP
  const verifyOtp = async () => {
    try {
      const result = await window.confirmationResult.confirm(otp);

      const firebaseUser = result.user;

      // 🔥 BACKEND CALL
      const res = await axios.post(`${API}/auth/otp-login`, {
        phone: firebaseUser.phoneNumber,
      });

      localStorage.setItem(
        "user",
        JSON.stringify({
          ...res.data.user,
          token: res.data.token,
        })
      );

      alert("Login success ✅");
      navigate("/");

    } catch {
      alert("Invalid OTP ❌");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">

      <div className="bg-white p-6 rounded shadow w-80">

        <h2 className="text-xl mb-4 text-center">OTP Login</h2>

        {!showOtp ? (
          <>
            <input
              placeholder="Phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="border p-2 w-full mb-3"
            />

            <button onClick={sendOtp} className="bg-blue-500 text-white w-full py-2">
              Send OTP
            </button>
          </>
        ) : (
          <>
            <input
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="border p-2 w-full mb-3"
            />

            <button onClick={verifyOtp} className="bg-green-500 text-white w-full py-2">
              Verify OTP
            </button>
          </>
        )}

        {/* 🔥 REQUIRED */}
        <div id="recaptcha"></div>

      </div>
    </div>
  );
};

export default OtpLogin;