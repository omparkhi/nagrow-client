import react, { useState } from "react";
import axios from "axios";
import Lottie from "lottie-react";
import locationAnimation from "../../assets/Location.json";
import { FaMapMarkerAlt } from "react-icons/fa";
import Loader from "../Loader";
import { useNavigate } from "react-router-dom";

const SaveLocation = () => {
  const navigate = useNavigate();
  const [accessing, setAccessing] = useState(false);

  const handleAccessLocation = async () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }

    setAccessing(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;
        try {
          const token = localStorage.getItem("token");
          const res = await axios.post(
            "http://localhost:3000/api/users/save-address",
            {
              label: "Home", // You can make it dynamic later
              latitude,
              longitude,
            },
            { headers: { Authorization: `Bearer ${token}` } }
          );
          console.log(res.data);
          alert("Location Saved Successfully");
          navigate("/user-home");
        } catch (error) {
          console.error("Error while saving location", error);
          alert("Failed to save location");
        } finally {
          setAccessing(false);
        }
      },
      (error) => {
        console.error("Geolocation Error", error);
        alert("Failed to get location");
        setAccessing(false);
      }
    );
  };

  return (
    <section className="min-h-screen w-full bg-white text-center flex flex-col">
      {accessing && (
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
            Accessing Location...
          </p>
        </div>
      )}

      <div className="bg-[#131222] rounded-b-[50px]">
        <div className="h-[30%] pt-20 pb-4">
          <h1 className="text-slate-200 font-bold text-4xl md:text-5xl ">
            Access Location
          </h1>
          <p className="text-slate-400 text-xl">
            We need your location to save your home Address
          </p>
        </div>
      </div>

      <div className="flex flex-col items-center justify-center flex-grow">
        <div className="max-w-xs md:max-w-md flex flex-col items-center">
          <Lottie
            animationData={locationAnimation}
            loop={true}
            className="w-[35rem]"
          />
          <button
            onClick={handleAccessLocation}
            className="flex items-center justify-center px-6 py-3 rounded text-white text-lg font-semibold bg-[#ff5733] transform scale-100 hover:scale-105 transition duration-300 hover:bg-[#e43a14]"
          >
            Access My Location
            <span>
              <FaMapMarkerAlt className="ml-2 text-2xl" />
            </span>
          </button>
        </div>
      </div>
    </section>
  );
};

export default SaveLocation;
