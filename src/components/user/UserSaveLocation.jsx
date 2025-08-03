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

  const handleAccessLocation = async (e) => {
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
          //Fetch Address using OpenCage Reverse Geocoding API
          // const OPENCAGE_API_KEY = "d308f8652b8b435f877ae2de28835b5d";
          const LOCATIONIQ_API_KEY = "pk.28ac1ab42612b71b8864afafe77a77c9";
          // const geoResponse = await axios.get(
          //   `https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=${OPENCAGE_API_KEY}`
          // );
          const geoResponse = await axios.get(
              `https://us1.locationiq.com/v1/reverse.php?key=${LOCATIONIQ_API_KEY}&lat=${latitude}&lon=${longitude}&format=json&addressdetails=1`
            );
          let address = "";
          if(geoResponse.data && geoResponse.data.display_name) {
            address = geoResponse.data.display_name;
            console.log("Fetched Address:", address);
          } else {
            console.error("No address found");
            alert("Failed to fetch address.");
            setAccessing(false);
            return;
          }

          // save to backend
          const token = localStorage.getItem("token");
          const res = await axios.post(
            "http://localhost:3000/api/users/save-address",
            { label: "Home", latitude, longitude, fullAddress: address },
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
