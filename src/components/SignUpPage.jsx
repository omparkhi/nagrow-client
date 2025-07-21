import React from "react";
import { Link } from "react-router-dom";

function SignUpPage() {
  return (
    <>
      <section className="h-screen w-full bg-[#131222] text-center">
        {/* Header Section */}
        <div className="h-[30%] pt-20 pb-4 ">
          <h2 className="text-slate-200 font-bold text-4xl md:text-7xl">Sign Up</h2>
          <p className="text-slate-400 text-xl mt-2 ">Please sign up for a new account</p>
        </div>

        {/* Form Section */}
        <div className="  h-[75%] bg-white rounded-t-[50px] flex justify-center px-4 sm:px-6 md:px-8 lg:px-12 py-6  mt-4">
          <div className="w-full max-w-lg bg-white text-black rounded-[15px] lg:border-2 border-[#f4f1f7] p-8">
            
           <div className="flex flex-col sm:flex-row  sm:gap-4 gap-0">
         <div className="flex flex-col w-full">
            <label className="text-base text-gray-700 mt-4 sm:mt-0 text-left">First Name</label>
             <input
                type="text"
                placeholder="Enter your first Name"
                className="w-full mt-1 px-4 py-2.5 rounded-lg bg-[#f0f5fa] border-none focus:outline-none"
              />
          </div>

           <div className="flex flex-col w-full">
             <label className="text-base text-gray-700 mt-4 sm:mt-0 text-left">Last Name</label>
             <input
               type="text"
               placeholder="Enter your last Name"
               className="w-full mt-1 px-4 py-2.5 rounded-lg bg-[#f0f5fa] border-none focus:outline-none"
             />
           </div>
         </div>


            <label className="block text-base mt-4 text-left text-gray-700 type">Phone Number</label>
            <input
              type="tel"
              pattern="[0-9]{10}"
              maxLength={10}
              inputMode="numeric"
              onInput={(e) => {
              e.target.value = e.target.value.replace(/\D/g, "");
            }}
              placeholder="Enter your phone number"
              className="w-full mt-1 px-4 py-2.5 rounded-lg bg-[#f0f5fa] border-none focus:outline-none"
            />

            <label className="block text-base mt-4 text-left text-gray-700">Password</label>
            <input
              type="password"
              placeholder="Password"
              className="w-full mt-1 px-4 py-2.5 rounded-lg bg-[#f0f5fa] border-none focus:outline-none"
            />

            <label className="block text-base mt-4 text-left text-gray-700">Re-Type Password</label>
            <input
              type="password"
              placeholder="Re-Type Password"
              className="w-full mt-1 px-4 py-2.5 rounded-lg bg-[#f0f5fa] border-none focus:outline-none"
            />

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

            <button className="bg-[#ff5733] text-white w-full py-3 rounded-md font-bold mt-5">
              SIGN UP
            </button>

            <p className="text-center text-sm mt-5">
              Already have an account?{" "}
              <Link to="/login" className="text-[#ff5733] text-sm font-semibold">
                LOG IN
              </Link>
            </p>

            <div className="text-center my-4">
              <span className="text-sm text-gray-600">or</span>
            </div>

            <div className="flex justify-around mt-4">
              <button className="w-10 h-10 rounded-full bg-[#3b5998] text-white text-lg">f</button>
              <button className="w-10 h-10 rounded-full bg-[#1da1f2] text-white text-lg">t</button>
              <button className="w-10 h-10 rounded-full bg-black text-white text-lg">a</button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default SignUpPage;
