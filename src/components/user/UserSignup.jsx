import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import axios from "axios";
import Loader from "../Loader";

const UserSignup = () => {
  const [isSignup, setIsSignup] = useState(false);
  const navigate = useNavigate();
  const [showpassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "phone") {
      let onlyDigits = value.replace(/\D/g, "");
      setFormData({ ...formData, [name]: onlyDigits });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(formData);
    setIsSignup(true);
    try {
      const res = await axios.post(
        "http://localhost:3000/api/users/register",
        formData
      );
      console.log(res.data);
      if (res.data.success) {
        localStorage.setItem("nagrow_token", res.data.token);
        console.log("User Registered Successfully!");
        axios.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${res.data.token}`;
        navigate("/save-address");
      } else {
        console.log(res.data.message);
      }
    } catch (error) {
      console.error("Registration Failed", error);
    } finally {
      setIsSignup(false);
    }
  };

  return (
    <>
      <section className="min-h-screen w-full bg-white  text-center flex flex-col">
        {isSignup && (
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
          </div>
        )}
        <div className="bg-[#131222] rounded-b-[50px]">
          <div className="h-[30%] pt-20 pb-4">
            <h1 className="text-slate-200 font-bold text-4xl md:text-5xl ">
              Sign Up
            </h1>
            <p className="text-slate-400 text-xl">
              Please sign up for a new account
            </p>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white flex justify-center lg:py-4 py-8"
        >
          <div className="w-full max-w-lg bg-white text-black rounded-[15px] lg:border-2 border-[#f4f1f7] p-4">
            <div className="flex flex-col sm:flex-row  sm:gap-4 gap-0">
              <div className="flex flex-col w-full">
                <label
                  className="block text-gray-700 mt-2 text-left w-full"
                  htmlFor="firstname"
                >
                  First Name
                </label>
                <input
                  id="firstname"
                  value={formData.firstName}
                  name="firstName"
                  onChange={handleChange}
                  type="text"
                  placeholder="Enter your first Name"
                  className="w-full mt-1 px-4 py-2.5 rounded-lg bg-[#f0f5fa] border-none focus:outline-none"
                />
              </div>

              <div className="flex flex-col w-full">
                <label
                  className="block text-gray-700 mt-2 text-left w-full"
                  htmlFor="lastname"
                >
                  Last Name
                </label>
                <input
                  id="lastname"
                  value={formData.lastName}
                  name="lastName"
                  onChange={handleChange}
                  type="text"
                  placeholder="Enter your last Name"
                  className="w-full mt-1 px-4 py-2.5 rounded-lg bg-[#f0f5fa] border-none focus:outline-none"
                />
              </div>
            </div>

            <label
              className="block text-base mt-4 text-left text-gray-700 type"
              htmlFor="phone"
            >
              Phone Number
            </label>
            <input
              id="phone"
              value={formData.phone}
              name="phone"
              onChange={handleChange}
              type="tel"
              pattern="[0-9]{10}"
              maxLength={10}
              inputMode="numeric"
              placeholder="Enter your phone number"
              className="w-full mt-1 px-4 py-2.5 rounded-lg bg-[#f0f5fa] border-none focus:outline-none"
            />

            <label
              className="block text-base mt-4 text-left text-gray-700 type"
              htmlFor="email"
            >
              Email
            </label>
            <input
              id="email"
              value={formData.email}
              name="email"
              onChange={handleChange}
              type="email"
              placeholder="Enter your Email"
              className="w-full mt-1 px-4 py-2.5 rounded-lg bg-[#f0f5fa] border-none focus:outline-none"
            />

            <label
              className="block text-base mt-4 text-left text-gray-700"
              htmlFor="password"
            >
              Password
            </label>
            <div className="relative w-full mt-1">
              <input
                id="password"
                value={formData.password}
                name="password"
                onChange={handleChange}
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

            <label className="block text-base mt-4 text-left text-gray-700">
              Re-Enter Password
            </label>
            <div className="relative w-full mt-1">
              <input
                id="re-password"
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
            </div>

            <button className="cursor-pointer bg-[#ff5733] text-white w-full py-3 rounded-md font-bold mt-5 hover:bg-[#e43a14]">
              SIGN UP
            </button>

            <p className="text-center text-sm mt-5">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-[#ff5733] text-sm font-semibold"
              >
                LOG IN
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
};

export default UserSignup;
