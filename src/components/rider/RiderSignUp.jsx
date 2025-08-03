import React, { useState } from "react";
import { Link } from "react-router-dom";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const RiderSignUp = ()=> {
  const [showpassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;

      if (name === "phone") {
      const onlyDigits = value.replace(/\D/g, "");
      setFormData((prev) => ({
        ...prev,
        phone: onlyDigits,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

     if (!formData.name || !formData.email || !formData.phone || !formData.password) {
       alert("Please fill all required fields");
     return;
     }
    if (formData.phone.length !== 10) {
      alert("Phone number must be 10 digits");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    // delete formData.confirmPassword;

    try {
      const res = await axios.post(
        "http://localhost:3000/api/rider/register",
        formData
      );
      console.log(res.data);
      if (res.data.success) {
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("userType", "rider");
        axios.defaults.headers.common["Authorization"] = `Bearer ${res.data.token}`;
        navigate("/rider-home");
      } else {
        console.log(res.data.message);
      }
    } catch (error) {
      if (error.response) {
        console.error("Registration Failed:", error.response.data);
      } else {
        console.error("Unknown error", error);
      }
    }
  };


  return (
    <>
      <section className="min-h-screen w-full bg-white  text-center flex flex-col">
        <div className="bg-[#131222] rounded-b-[50px]">
          <div className="h-[30%] pt-20 pb-4">
            <h1 className="text-slate-200 font-bold text-4xl md:text-5xl ">
               Rider Sign Up
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
           
              <div className="flex flex-col w-full">
                <label
                  className="block text-gray-700 mt-2 text-left w-full"
                  htmlFor="name"
                >
                Rider Name
                </label>
                <input
                  id="name"
                  value={formData.name}
                  name="name"
                  onChange={handleChange}
                  type="text"
                  placeholder="Enter your Name"
                  className="w-full mt-1 px-4 py-2.5 rounded-lg bg-[#f0f5fa] border-none focus:outline-none"
                />
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
           className="block text-base mt-4 text-left text-gray-700"
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
              placeholder="Enter your email"
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
                name="confirmPassword"
                value={formData.confirmPassword}
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

            
            
            <div className="flex justify-between items-center mt-4 flex-wrap text-sm">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="rememberMe"
                  className="scale-110 cursor-pointer "
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
                to="/rider-login"
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
}

export default RiderSignUp;
