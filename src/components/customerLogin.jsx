import React, { useState } from "react";
import { Link } from "react-router-dom";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";

function LoginPage() {
  const [showpassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    phone: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "phone") {
      const onlyDigits = value.replace(/\D/g, "");
      setFormData({ ...formData, [name]: onlyDigits });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
  };

  return (
    <>
      <section className="min-h-screen w-full bg-white  text-center flex flex-col">
        <div className="bg-[#131222] rounded-b-[50px]">
          <div className="h-[30%] pt-20 pb-4">
            <h1 className="text-slate-200 font-bold text-4xl md:text-5xl ">
              Log In
            </h1>
            <p className="text-slate-400 text-xl">
              Please sign in to your existing account
            </p>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white flex justify-center lg:py-4 py-8"
        >
          <div className="w-full max-w-lg bg-white text-black rounded-[15px] lg:border-2 border-[#f4f1f7] p-4">
            <label
              className="block text-gray-700 mt-2 text-left w-full"
              htmlFor="phone"
            >
              Phone Number
            </label>
            <div className="w-full flex justify-between ">
              <p className="text-gray-700 w-[10%] sm-px-2 mt-1 py-2.5 rounded-l-lg bg-silver border-r-1 border-r-slate-300 bg-[#f0f5fa]">
                +91
              </p>
              <input
                id="phone"
                value={formData.phone}
                onChange={handleChange}
                name="phone"
                type="tel"
                pattern="[0-9]{10}"
                maxLength={10}
                inputMode="numeric"
                placeholder="Enter your phone number"
                className=" w-[90%] mt-1 px-4 py-2.5 rounded-r-lg bg-silver border-none focus:outline-none bg-[#f0f5fa]"
              />
            </div>

            <label
              className="block mt-4 text-left w-full text-gray-700"
              htmlFor="password"
            >
              Password
            </label>
            <div className="relative w-full mt-1">
              <input
                id="password"
                value={formData.password}
                onChange={handleChange}
                name="password"
                type={showpassword ? "text" : "password"}
                placeholder="Password"
                className="w-full px-4 py-2.5 rounded-lg bg-[#f0f5fa] border-none focus:outline-none pr-10"
              />
              <div
                onClick={() => setShowPassword(!showpassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xl text-gray-500 cursor-pointer"
              >
                {showpassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
              </div>
            </div>

            <div className="flex justify-between items-center mt-4 flex-wrap text-sm">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="rememberMe"
                  className="scale-110 cursor-pointer"
                />
                <label htmlFor="rememberMe" className="cursor-pointer">
                  Remember me
                </label>
              </div>
              <a href="#" className="text-[#ff5733] text-sm font-semibold">
                Forgot Password?
              </a>
            </div>

            <button className="bg-[#ff5733] text-white w-full py-3 rounded-md font-bold mt-5 cursor-pointer hover:bg-[#e43a14]">
              LOG IN
            </button>

            <p className="text-center text-sm mt-5">
              Don’t have an account?{" "}
              <Link
                to="/signup"
                className="text-[#ff5733] text-sm font-semibold"
              >
                SIGN UP
              </Link>
            </p>

            <div className="text-center my-4">
              <span className="text-sm text-gray-600">or</span>
            </div>

            <div className="flex justify-around mt-4">
              <button className="w-10 h-10 rounded-full bg-[#3b5998] text-white text-lg">
                f
              </button>
              <button className="w-10 h-10 rounded-full bg-[#1da1f2] text-white text-lg">
                t
              </button>
              <button className="w-10 h-10 rounded-full bg-black text-white text-lg">
                a
              </button>
            </div>
          </div>
        </form>
      </section>
    </>
  );
}

export default LoginPage;
