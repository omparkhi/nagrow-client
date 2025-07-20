import React from "react";
import { Link } from "react-router-dom";

const Verification = () => {
  return (
    <section className="h-screen w-full bg-[#131222] text-center">
      <div className="h-[30%] pt-20 pb-4">
        <h1 className="text-slate-200 font-bold text-4xl md:text-7xl ">
          Verification
        </h1>
        <p className="text-slate-400 text-xl">
          Just enter your number to get OTP
        </p>
      </div>
      <div className="h-[75%] bg-white rounded-t-[50px] flex justify-center px-4 lg:px-12 py-5">
        <div className="w-full max-w-lg bg-white text-black rounded-[15px] lg:border-2 border-[#f4f1f7] p-4">
          <label className="block text-gray-700 mt-2 text-left w-full">
            Phone Number
          </label>
          <input
            type="tel"
            pattern="[0-9]{10}"
            maxLength={10}
            inputMode="numeric"
            placeholder="+91 Enter your phone number"
            className="w-full mt-1 px-4 py-2.5 rounded-lg bg-silver border-none focus:outline-none bg-[#f0f5fa]"
            onInput={(e) => {
              e.target.value = e.target.value.replace(/\D/g, "");
            }}
          />
          <button className="cursor-pointer bg-[#ff5733] text-white w-full py-3 rounded-md font-bold mt-5">
            SEND OTP
          </button>

          <div className="mt-4 w-full">
            <div className="flex justify-between items-center mb-2">
              <label className="text-gray-700 text-base">Enter OTP</label>
              <a href="#" className="text-black text-sm whitespace-nowrap">
                <span className="underline">Resend</span> in 50 sec
              </a>
            </div>

            <div className="flex justify-between gap-2">
              {Array(6)
                .fill(0)
                .map((_, i) => (
                  <input
                    key={i}
                    type="text"
                    maxLength={1}
                    className="w-14 h-14 text-center text-xl rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#ff5733] bg-[#f0f5fa]"
                  />
                ))}
            </div>
          </div>

          {/* <div className="flex justify-between items-center mt-4 flex-wrap text-sm">
            <div className="flex items-center gap-2"></div>
          </div> */}

          <button className="cursor-pointer bg-[#ff5733] text-white w-full py-3 rounded-md font-bold mt-5">
            VERIFY OTP
          </button>

          <p className="text-center text-lg mt-5">
            Welcome to NaGrow -{" "}
            <Link to="/home" className="text-[#ff5733]">
              Home
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
};

export default Verification;
