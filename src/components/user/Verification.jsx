import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Loader from "../Loader";

const Verification = () => {
  const navigate = useNavigate();
  const [phone, setPhone] = useState("");
  const [otpDisabled, setOtpDisabled] = useState(true);
  let [reSend, setReSend] = useState(0);
  const [otpValues, setOtpValues] = useState(["", "", "", "", "", ""]);
  const [isVerifying, setIsVerifying] = useState(false);

  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (phone.length !== 10) {
      console.log("Please enter a valid 10-digit phone number");
      return;
    }

    try {
      const res = await axios.post("http://localhost:3000/api/users/send-otp", {
        phone,
      });
      console.log(res.data);
      if (res.data.success) {
        setOtpDisabled(false);
        console.log("Otp sent successfully");
        // console.log(otpDisabled);
        setReSend(60);
        const interval = setInterval(() => {
          setReSend((prev) => {
            if (prev <= 1) {
              clearInterval(interval);
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
      } else {
        console.log("Failed to send otp");
      }
    } catch (error) {
      console.log("Error sending OTP", error);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    const otp = otpValues.join("");
    if (otp.length !== 6) {
      console.log("Please enter a valid 6-digit OTP");
      return;
    }
    setIsVerifying(true);
    try {
      const res = await axios.post(
        "http://localhost:3000/api/users/verify-otp",
        { phone, otp }
      );
      if (res.data.success) {
        console.log("Phone Number Verified successfully");
        localStorage.setItem("verified", "verified");
        navigate("/user-signup");
      } else {
        console.log("Invalid OTP");
      }
    } catch (error) {
      console.log("Failed to verify", error);
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <section className="min-h-screen w-full bg-white  text-center flex flex-col relative">
      {isVerifying && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "rgba(113, 113, 113, 0.58)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 50,
          }}
        >
          <Loader />
          <p
            style={{
              fontSize: "1rem",
              fontWeight: "bold",
              color: "#777777ff",
              marginTop: "25px",
            }}
          >
            Verifying OTP...
          </p>
        </div>
      )}
      <div className="bg-[#131222] rounded-b-[50px]">
        <div className="h-[30%] pt-20 pb-4">
          <h1 className="text-slate-200 font-bold text-4xl md:text-5xl ">
            Verification
          </h1>
          <p className="text-slate-400 text-xl">
            Just enter your number to get OTP
          </p>
        </div>
      </div>

      <form className="bg-white flex justify-center lg:py-4 py-8">
        <div className="w-full max-w-lg bg-white text-black rounded-[15px] lg:border-2 border-[#f4f1f7] p-4">
          <label
            className="block text-gray-700 mt-2 text-left w-full"
            htmlFor="number"
          >
            Phone Numbers
          </label>
          <div className="w-full flex justify-between ">
            <p className="text-gray-700 w-[10%] mt-1 py-2.5 rounded-l-lg bg-silver border-r-1 border-r-slate-300 bg-[#f0f5fa]">
              +91
            </p>
            <input
              id="number"
              type="tel"
              pattern="[0-9]{10}"
              maxLength={10}
              inputMode="numeric"
              placeholder="Enter your phone number"
              className=" w-[90%] mt-1 px-4 py-2.5 rounded-r-lg bg-silver border-none focus:outline-none bg-[#f0f5fa]"
              onInput={(e) => {
                e.target.value = e.target.value.replace(/\D/g, "");
                setPhone(e.target.value);
              }}
            />
          </div>
          <button
            onClick={handleSendOtp}
            className="cursor-pointer bg-[#ff5733] text-white w-full py-3 rounded-md font-bold mt-5 hover:bg-[#e43a14]"
            disabled={phone.length !== 10}
          >
            SEND OTP
          </button>

          <div className="mt-4 w-full">
            <div className="flex justify-between items-center mb-2">
              <label className="text-gray-700 text-base" htmlFor="otp">
                Enter OTP
              </label>
              <a
                onClick={(e) => {
                  e.preventDefault();
                  if (reSend == 0) handleSendOtp(e);
                }}
                className={`text-sm ${
                  reSend > 0
                    ? "text-gray-400 pointer-events-none"
                    : "text-orange-500 cursor-pointer underline"
                }`}
              >
                {reSend > 0 ? `Resend in ${reSend}s` : "Resend"}
              </a>
            </div>

            <div className="flex justify-between gap-2 whitespace-normal">
              {Array(6)
                .fill(0)
                .map((_, i) => (
                  <input
                    id="otp"
                    key={i}
                    type="text"
                    maxLength={1}
                    className={`w-10 h-10 text-center text-xl rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#ff5733] bg-[#f0f5fa] ${
                      otpDisabled ? "cursor-not-allowed" : "cursor-pointer"
                    }`}
                    disabled={otpDisabled}
                    onInput={(e) => {
                      const val = e.target.value.replace(/\D/g, "");
                      if (val.length <= 1) {
                        const newOtpValues = [...otpValues];
                        newOtpValues[i] = val;
                        setOtpValues(newOtpValues);

                        //auto focus to next otp input
                        if (val && e.target.nextSibling) {
                          e.target.nextSibling.focus();
                        }
                      }
                    }}
                  />
                ))}
            </div>
          </div>

          {/* <div className="flex justify-between items-center mt-4 flex-wrap text-sm">
            <div className="flex items-center gap-2"></div>
          </div> */}

          <button
            onClick={handleVerifyOtp}
            className={`bg-[#ff5733] text-white w-full py-3 rounded-md font-bold mt-5  ${
              otpDisabled
                ? "cursor-not-allowed bg-[#ff5733]/50"
                : "cursor-pointer hover:bg-[#e43a14]  "
            }`}
            disabled={otpDisabled}
          >
            VERIFY OTP
          </button>

          <p className="text-center text-lg mt-5">
            Welcome to NaGrow -{" "}
            <Link to="/home" className="text-[#ff5733]">
              Home
            </Link>
          </p>
        </div>
      </form>
      {/* Tagline BELOW the form, full width */}
      <div className="w-full bg-white text-center px-4 py-2">
        <h1 className="text-2xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-orange-500 via-red-500 to-yellow-400 animate-pulse drop-shadow-md">
          One OTP Away from Your Favorite Meal!
        </h1>

        <p className="mt-3 text-sm md:text-lg text-slate-500 font-medium animate-fade-in-up">
          Fast • Fresh • Flavorful — Delivered at your doorstep 🚀
        </p>
      </div>
    </section>
  );
};

export default Verification;
