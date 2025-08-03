import React, { useState } from "react";
import { Link } from "react-router-dom";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import Loader from "../Loader";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const AdminLogin = () => {
  const navigate = useNavigate();
  const [showpassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [isLogin, setIsLogin] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(formData);
    setIsLogin(true);
    try {
      const res = await axios.post(
        "http://localhost:3000/api/admin/login",
        formData
      );
      console.log(res.data);
      const{admin}= res.data;
      if (res.data.token) {
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("userType", "admin");
        localStorage.setItem("adminId", admin.id);
        toast.success("Login Sucessfully");
        navigate("/admin-home");
      } else {
        toast.error("Login failed");
      }
    } catch (error) {
      console.log("Login Failed", error);
      toast.error("Login failed. Please check credentials.");
    } finally {
      setIsLogin(false);
    }
  };

  return (
    <>
      <section className="min-h-screen w-full bg-white  text-center flex flex-col">
        {isLogin && (
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
              Admin Log In
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
              htmlFor="email"
            >
              Email
            </label>
            <input
              id="email"
              value={formData.email}
              onChange={handleChange}
              name="email"
              type="email"
              placeholder="Enter your email"
              className="w-full mt-1 px-4 py-2.5 rounded-lg bg-[#f0f5fa] border-none focus:outline-none"
            />

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
                to="/admin-signup"
                className="text-[#ff5733] text-sm font-semibold"
              >
                SIGN UP
              </Link>
            </p>
          </div>
        </form>
      </section>
    </>
  );
};

export default AdminLogin;
