import React from "react";
import { Link } from "react-router-dom";
import Lottie from "lottie-react";
import customer from "../assets/customer.json";
import restaurant from "../assets/restaurant.json";
import delivery from "../assets/delivery2.json";
import rootBg from "../assets/rootBg.jpeg";

const Home = () => {
  const roles = [
    {
      title: "Customer",
      description: "Order delicious food from local restaurants.",
      animation: customer,
      link: "/customer-options",
    },
    {
      title: "Restaurant",
      description: "Partner with NaGrow to reach more customers.",
      animation: restaurant,
    },
    {
      title: "Delivery Partner",
      description: "Earn by delivering orders around your city.",
      animation: delivery,
    },
  ];

  return (
    <section className="relative text-center min-h-screen flex flex-col justify-center items-center overflow-x-hidden py-4 px-4">
      {/* Blurred Background Layer */}
      <img
        src={rootBg}
        alt="Background"
        className="absolute inset-0 w-full h-full object-cover blur-[3px] brightness-75"
      />

      {/* Content Layer */}
      <div className="relative z-10 mt-4">
        <h1 className="font-bold text-6xl md:text-7xl text-[#ff5733]">
          NaGrow
        </h1>
        <h2 className="text-white text-xl md:text-2xl">
          Nagpur’s First Hyperlocal Food Delivery Revolution
        </h2>

        <div className="mt-8 max-w-6xl mx-auto grid gap-6 sm:grid-cols-2 lg:grid-cols-3 shadow-xl">
          {roles.map((role, index) => (
            <div
              key={index}
              className="bg-white/50 rounded-2xl shadow-md flex flex-col items-center hover:shadow-xl transition p-4 backdrop-blur-sm"
            >
              <Lottie
                animationData={role.animation}
                loop
                autoplay
                className="w-60 h-60"
              />
              <h3 className="text-2xl font-semibold mb-2">{role.title}</h3>
              <p className="text-slate-700 text-xl text-center">
                {role.description}
              </p>
              <Link to={role.link}>
                <button className="cursor-pointer mt-5 py-1 px-5 rounded-xl text-white bg-[#ff5733] text-xl">
                  Go
                </button>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Home;
