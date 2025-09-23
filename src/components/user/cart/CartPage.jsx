import React from 'react'
import { useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";

const CartPage = () => {
    const { items, restaurantName, increment, decrement, removeItem, clearCart, getSubtotal } = useCart();
    const navigate = useNavigate();

    const handleCheckout = () => {
        // proceed to checkout flow (address selection, payment)
        // placeholder: navigate('/checkout')
        alert("Proceed to checkout (not implemented yet)");
    }

    if(!items || items.length === 0) {
        return (
            <div className="max-w-4xl mx-auto p-6 text-center">
                <h2 className="text-xl font-semibold mb-4">Your cart is empty</h2>
                <button className="px-4 py-2 bg-green-600 text-white rounded" onClick={() => navigate(-1)}>
                Back to restaurant
                </button>
            </div>
        );
    }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Cart — {restaurantName}</h2>
        <div>
          <button className="text-sm text-red-600" onClick={() => { if (confirm("Clear cart?")) clearCart(); }}>
            Clear cart
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {items.map((it) => (
          <div key={it.id} className="flex items-center gap-4 border p-4 rounded-lg">
            {it.image && <img src={it.image} alt={it.name} className="w-20 h-20 object-cover rounded" />}
            <div className="flex-1">
              <div className="font-semibold">{it.name}</div>
              <div className="text-sm text-gray-600">₹{it.price}</div>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => decrement(it.id)} className="w-8 h-8 rounded bg-gray-200">−</button>
              <div className="px-3">{it.quantity}</div>
              <button onClick={() => increment(it.id)} className="w-8 h-8 rounded bg-gray-200">+</button>
            </div>
            <div className="w-24 text-right font-semibold">₹{it.price * it.quantity}</div>
            <button onClick={() => removeItem(it.id)} className="text-red-600 ml-4">Remove</button>
          </div>
        ))}
      </div>

      <div className="mt-6 flex justify-end items-center gap-6">
        <div className="text-lg font-semibold">Subtotal: ₹{getSubtotal()}</div>
        <button onClick={handleCheckout} className="px-4 py-2 bg-green-600 text-white rounded">Proceed to Checkout</button>
      </div>
    </div>
  )
}

export default CartPage
