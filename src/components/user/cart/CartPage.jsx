  import React, { useEffect, useState } from "react";
  import { useNavigate, useLocation } from "react-router-dom";
  import RestaurantHeader from "../userDash/RestaurantHeader";
  import {
    MdCheckCircle,
    MdRadioButtonUnchecked,
    MdEdit,
    MdLocalOffer,
    MdReceiptLong,
    MdReceipt,
    MdKeyboardArrowRight,
    MdPayment,
  } from "react-icons/md";

  import { AiOutlineEdit } from "react-icons/ai";
  import { BsCircleFill } from "react-icons/bs";
  import OfferCard from "./OfferCard";
  import { Currency, TicketPercent } from "lucide-react";
  import { RiCoupon3Line, RiBillLine, RiSecurePaymentFill } from "react-icons/ri";
  import { FaTicketAlt, FaFileInvoice, FaMoneyBillWave } from "react-icons/fa";
  import { BsWallet2 } from "react-icons/bs";
  import { RiSecurePaymentLine } from "react-icons/ri";
  import { SiPhonepe, SiGooglepay, SiPaytm } from "react-icons/si";
  import { useAddress } from "../../../context/AddressContext";
  import AddressSelection from "./AddressSelection";
  import axios from "axios";
  import {useDispatch, useSelector} from "react-redux";
  import { 
    addToCartThunk, 
    increment, 
    decrement, 
    removeItem, 
    clearCart, 
    setTip, 
    getCart, 
    getSubtotal, 
    getGrandTotal, 
    getDeliveryFee,
    getTotalItems,
  } from "../../../features/usercart/cartSlice";
  import { fetchUser, selectUser } from "../../../features/user/userSlice";


  const CartPage = () => {
    const [backendTotals, setBackendTotals] = useState({
      totalAmount: 0,
      deliveryFee: 0,
      subTotal: 0,
      distanceKm: 0, // default fallback
    });
    const dispatch = useDispatch();
    const cart = useSelector(getCart);
    const items  = cart.items;
    const restaurantName = cart.restaurantName;
    const restaurantId = cart.restaurantId;
    const totalItem = useSelector(getTotalItems);
    const user = useSelector(selectUser);
    // console.log(user);
    const userId = localStorage.getItem("userId");

      useEffect(() => {
    if (userId) dispatch(fetchUser(userId));
  }, [userId, dispatch]);
    // const { items, restaurantId, tip } = useSelector(getCart);

    const navigate = useNavigate();
    const location = useLocation();
    // const isCartPage = location.pathname === `/cart/${restaurantId}`;
    const { addresses, loading, error } = useAddress();
    // const user = localStorage.getItem("user");
    

    const selectedAddress = addresses.find((a) => a.selectedAddress === true);

    //handle payment via cash on delivery
    const [method, setMethod] = useState("online");

    const handlePaymentOnline = async () => {
      try {
        // Prepare cart data to send to backend for secure total calculation
        const cartData =  {
          restaurantId,
          userId,
          items,
          tip: cart.tip,
          distanceKm: backendTotals.distanceKm,
          deliveryFee: backendTotals.deliveryFee,
          deliveryAddress: {
            formattedAddress: selectedAddress.formattedAddress,
            coordinates: selectedAddress.coordinates.coordinates,
          },
        };


        // 1️⃣ Send cart data to backend to calculate total & create Razorpay order
        const { data } = await axios.post(
          `${import.meta.env.VITE_API_URL}/api/payment/order`,
          cartData
        );

        const { order, totalAmount, distanceKm, subTotal, deliveryFee } = data;
        setBackendTotals({
          totalAmount,
          deliveryFee,
          subTotal,
          distanceKm,
        });

        // Initiailize Razorpay Checkout
        const options = {
          key: import.meta.env.VITE_RAZORPAY_KEY_ID,
          amount: order.amount,
          currency: "INR",
          name: "Nagrow",
          description: "Food Order Payment",
          order_id: order.id,
          handler: async function (response) {
            // verify payment
            const verifyRes = await axios.post(`${import.meta.env.VITE_API_URL}/api/payment/verify`,
              {
                ...response,
                orderData: {
                  ...cartData,
                  totalAmount: order.amount / 100, //convert from paise to INR
                },
              }
            );

            console.log("Navigate State:", verifyRes.data);

            if(verifyRes.data.success) {
              console.log(verifyRes.data.order);
              dispatch(clearCart());
              navigate("/order-success", {
                state: {
                  id: verifyRes.data.order._id,
                  orderId: verifyRes.data.order.orderId,
                  paymentType: "online",
                  paymentId: response.razorpay_payment_id,
                  razorpayOrderId: response.razorpay_order_id,
                  totalAmount: order.amount / 100,
                  paymentStatus: verifyRes.data.order.paymentStatus,
                },
              });
            } else {
              alert("Payment verification failed");
            }
          } ,
          prefill: {
            name: user.name,
            email: user.email,
            contact: user.phone,
          },
          theme: {
            color: "#e2832bff",
          },
        };

        const razorpay = new window.Razorpay(options);
        razorpay.open();

      } catch (err) {
        console.log("Payment Error:", err);
        alert("Something went wrong while processing payment!");
      }

    };

    const handlePayment = async () => {
      try {
        const codOrder = await axios.post(`${import.meta.env.VITE_API_URL}/api/payment/order/cod`, {
        userId: userId,
        restaurantId: restaurantId,
        items: items,
        tip: cart.tip,
        deliveryAddress: {
          formattedAddress: selectedAddress.formattedAddress,
          coordinates: selectedAddress.coordinates.coordinates,
        },
        distanceKm: backendTotals.distanceKm,
        deliveryFee: backendTotals.deliveryFee,
      });
      console.log(codOrder.data);

      if (codOrder.data.success) {
        dispatch(clearCart());
        navigate("/order-success", {
          state: {
            id: codOrder.data.order._id,
            orderId: codOrder.data.order.orderId,
            paymentType: "cod",
            totalAmount: codOrder.data.order.totalAmount,
            paymentStatus: codOrder.data.order.paymentStatus,
          },
        });
      }
      console.log("order place succesfully");
      } catch (err) {
        console.log("Error in placing Order", err);
        alert("Something went wrong while placing order!");
      }
    }

    if (!items || items.length === 0) {
      return (
        <div className="max-w-4xl mx-auto p-6 text-center">
          <h2 className="text-xl font-semibold mb-4">Your cart is empty</h2>
          <button
            className="px-4 py-2 bg-green-600 text-white rounded"
            onClick={() => navigate(-1)}
          >
            Back to restaurant
          </button>
        </div>
      );
    }

    const handleAddItem = () => {
      navigate(`/restaurant/${restaurantId}`);
    };

    useEffect(() => {
      const fetchDelivery = async () => {
        try {
          console.log("Delivery API Payload =>", { userId, restaurantId });
          const {data} = await axios.post(`${import.meta.env.VITE_API_URL}/api/payment/cal/deliveryFee`, {
          userId,
          restaurantId,
        });

          if(data.success) {
            setBackendTotals({
              distanceKm: data.distanceKm,
              deliveryFee: data.deliveryFee,
            });
          }
        } catch (err) {
          console.error("Delivery calc error:", err);
        }
      };
      fetchDelivery();
    }, [userId, restaurantId]);
    
  const subtotal = useSelector(getSubtotal);
  // const distanceKm = 2; // static distance for calculate total
  const distanceKm = backendTotals.distanceKm;
  const grandTotal = useSelector((state) => getGrandTotal(state, distanceKm));
  const deliveryFee = useSelector((state) => getDeliveryFee(state, distanceKm))
 

    const [billCard, setBillCard] = useState(false);

    if (loading) return <p>loading Address..</p>;
    if (error) return <p className="text-red-500">{error}</p>;

    const defaultAddress = addresses.length > 0 ? addresses[0] : null;
    return (
      <section className="bg-[#dbdbdb]">
        <>
          <RestaurantHeader />
        </>
        <div className="min-h-[130vh] w-full bg-[#dbdbdb] px-2">
          <div className="w-full sm:w-xl md:w-2xl mx-auto px-1 py-3 bg-white rounded-xl mt-3">
            {/* <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold">Cart — {restaurantName}</h2>
              <div>
                <button
                  className="text-sm text-red-600"
                  onClick={() => {
                    if (confirm("Clear cart?")) clearCart();
                  }}
                >
                  Clear cart
                </button>
              </div>
            </div> */}

            <div className="space-y-6">
              {items.map((it) => (
                <div
                  key={it.id}
                  className="flex items-center justify-between gap-2 px-4 rounded-lg"
                >
                  {it.image && (
                    <>
                      <BsCircleFill
                        className="p-[0.1rem] border-1 border-green-700 rounded-sm text-green-700"
                        size={12}
                      />
                      <img
                        src={it.image}
                        alt={it.name}
                        className="w-7 h-7 object-cover rounded"
                      />
                    </>
                  )}
                  <div className="flex-1">
                    <div className="font-semibold text-gray-800">{it.name}</div>
                    {/* <div className="text-sm text-gray-600">₹{it.price}</div> */}
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center justify-center rounded-lg border-1 border-gray-300  shadow-lg bg-white gap-1 text-blue-500 py-[3px] px-1 font-bold">
                      <button
                        onClick={() => dispatch(decrement(it.id))}
                        className="w-2 h-2 font-bold flex items-center justify-center text-green-600"
                      >
                        −
                      </button>
                      <div className="text-gray-700 px-1 text-xs">
                        {it.quantity}
                      </div>
                      <button
                        onClick={() => dispatch(increment(it.id))}
                        className="w-2 h-2 font-bold flex items-center justify-center text-green-600"
                      >
                        +
                      </button>
                    </div>
                    <div className="text-[14px] text-gray-800">
                      &#8377;{it.price * it.quantity}
                    </div>
                  </div>

                  {/* <button
                    onClick={() => dispatch(removeItem(it.id))}
                    className="text-red-600 ml-4"
                  >
                    Remove
                  </button> */}
                </div>
              ))}

              <div className="flex px-4 text-gray-700 font-semibold gap-3">
                <div
                  className="text-[13px] sm:text-[15px] py-1 px-1 border-1 border-gray-400 rounded-md  cursor-pointer"
                  onClick={handleAddItem}
                >
                  + Add Items
                </div>
                <div className=" flex items-center text-[13px] sm:text-[15px] py-1 px-1 border-1 border-gray-400 rounded-md  cursor-pointer">
                  <AiOutlineEdit className="w-4 h-4 " /> Cooking requests
                </div>
              </div>
            </div>

            {/* <div className="mt-6 flex justify-end items-center gap-6">
              <div className="text-lg font-semibold">
                Subtotal: ₹{getSubtotal()}
              </div>
              <button
                onClick={handleCheckout}
                className="px-4 py-2 bg-green-600 text-white rounded"
              >
                Proceed to Checkout
              </button>
            </div> */}
          </div>
          <div className="w-full sm:w-xl md:w-2xl mx-auto px-4 pt-3 pb-6 bg-white rounded-xl mt-3">
            <p className="text-[13px] font-bold text-gray-500">SAVINGS CORNER</p>
            {/* <div className="w-5 h-5 bg-orange-500">
              <MdLocalOffer className="p-1 bg-white" />
            </div> */}
            <div className="flex">
              <div className="relative bg-orange-600 p-1 rounded-sm inline-flex items-center justify-center mt-2">
                <MdLocalOffer className="text-white text-sm" />
              </div>
              <div className=" w-full flex items-center justify-between">
                <p className="text-sm font-semibold text-black ml-4 mt-2">
                  Save &#8377;49 on this order
                </p>
                <div className="absolute flex items-center mt-10 ml-4">
                  <p className=" text-[13px] text-gray-500 ">View all coupons</p>
                  <MdKeyboardArrowRight className=" text-[16px] text-gray-500 " />
                </div>
                <div className="text-[13px] sm:text-[15px] px-1 border-1 border-orange-600 text-orange-600 font-bold rounded-md  cursor-pointer">
                  Apply
                </div>
              </div>
            </div>
          </div>
          <div className="w-full sm:w-xl md:w-2xl mx-auto px-4 pt-3 pb-6 bg-white rounded-xl mt-3">
            <div className="flex ">
              <div className="bg-green-600 p-1 rounded-sm inline-flex items-center justify-center">
                <RiBillLine style={{ fill: "white", fontSize: "15px" }} />
              </div>
              {/* <div>Delivery Fee (₹12/km): ₹{getDeliveryFee(distanceKm)}</div> */}
              <div className="ml-4  w-full flex items-center justify-between">
                <p className="text-sm font-bold text-[#121212] ">
                  To Pay &#8377;{grandTotal}
                </p>
                <p className="absolute text-[13px] font-semibold text-gray-500 mt-8">
                  incl. all taxes & charges
                </p>

                <MdKeyboardArrowRight
                  onClick={() => setBillCard((prev) => !prev)}
                  className={`text-xl font-bold cursor-pointer transition-transform duration-500 ${
                    billCard ? "rotate-270" : "rotate-90"
                  }`}
                />
              </div>
            </div>
            {billCard && (
              <div
                className={`transition-transform duration-1000 overflow-hidden ${
                  billCard ? "max-h-60 opacity-100" : "max-h-0 opacity-0"
                } border-t border-gray-500 mt-6`}
              >
                <div>
                  <div className="flex items-center justify-between text-[13px] sm:text-[15px] pt-3 px-1 text-gray-700 font-semibold">
                    <p>Item Total</p>
                    <p>&#8377;{subtotal}</p>
                  </div>
                  <div className="flex items-center justify-between text-[13px] sm:text-[15px] pt-1 px-1 text-gray-700 font-semibold">
                    <p>Delivery Fee | {distanceKm} kms</p>
                    <p>&#8377;{deliveryFee}.00</p>
                  </div>
                </div>

                <div className="border-t border-dotted border-gray-500 mt-3">
                  <div className="flex items-center justify-between text-[13px] sm:text-[15px] pt-3 px-1 text-gray-700 font-semibold">
                    <p>Delivery Tip</p>
                    <p className="text-orange-600">Add tip</p>
                  </div>
                  <div className="flex items-center justify-between text-[13px] sm:text-[15px] pt-1 px-1 text-gray-700 font-semibold">
                    <p>GST & Other Charges</p>
                    <p>&#8377;00.00</p>
                  </div>
                </div>
                <div className="border-t border-dotted border-gray-500 mt-3">
                  <div className="flex items-center justify-between text-[13px] sm:text-[15px] pt-3 px-1 text-slate-800 font-semibold">
                    <p>To Pay</p>
                    <p>&#8377;{grandTotal}</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Payment option */}
          <div className="w-full sm:w-xl md:w-2xl mx-auto px-4 pt-3 pb-4 bg-white rounded-xl mt-3">
            <p className="text-[13px] font-bold text-gray-500">
              SELECT PAYMENT OPTIONS
            </p>
            <div className="flex mt-2">
              <div className=" p-1 rounded-sm inline-flex items-center justify-center bg-blue-600 text-white p-1 rounded-lg font-semibold shadow-lg">
                {/* <RiBillLine style={{ fill: "white", fontSize: "15px" }} /> */}
                <RiSecurePaymentLine className="text-xl" />
              </div>
              {/* <div>Delivery Fee (₹12/km): ₹{getDeliveryFee(distanceKm)}</div> */}
              <div className="ml-4 w-full flex items-center justify-between">
                <div onClick={() => setMethod("online")} className="ml-1 flex items-center gap-2">
                  <p className="text-sm font-bold text-[#121212] ">Online</p>
                  <SiPhonepe className="text-purple-600 text-2xl" />
                  /
                  <BsWallet2 className="text-2xl text-indigo-600" /> 
                  /
                  <RiSecurePaymentFill className="text-green-600 text-2xl" />
                </div>
                <input
                  type="radio"
                  name="payment"
                  checked = {method === "online"}
                  onChange={() => setMethod("online")}
                  className="text-green-500 w-3 h-3"
                />
              </div>
            </div>

            <div onClick={() => setMethod("cod")} className="flex mt-4 border-t border-gray-500">
              <div className="p-1 rounded-sm inline-flex items-center justify-center mt-2">
                <FaMoneyBillWave className="text-green-600 text-2xl" />
              </div>
              {/* <div>Delivery Fee (₹12/km): ₹{getDeliveryFee(distanceKm)}</div> */}
              <div className="ml-4  w-full flex items-center justify-between mt-2">
                <p className="text-sm font-bold text-[#121212] ">
                  Cash on Delivery
                </p>
                <input
                  type="radio"
                  name="payment"
                  checked = {method === "cod"}
                  onChange={() => setMethod("cod")}
                  className="text-green-500 w-3 h-3"
                />
              </div>
            </div>
          </div>

          {/* select address */}
          <AddressSelection />
          
        </div>
        <div className="fixed bottom-0 left-0 right-0 flex justify-center z-50 pointer-events-none">
        <div className="pointer-events-auto bg-gray-100 shadow-lg rounded-xl px-4 py-2 flex items-center gap-4 w-fit">
          <div>
            {totalItem} item{totalItem > 1 ? "s" : ""}
          </div>
          <div className="font-bold">₹{grandTotal}</div>
          <button
            onClick={method === "online" ? handlePaymentOnline : handlePayment}
            className="bg-blue-600 text-white px-4 py-1 rounded-xl hover:bg-blue-700"
          >
            {method === "online" ? "Pay" : "Place Order"}
          </button>
        </div>
      </div>
      </section>
    );
  };

  export default CartPage;
