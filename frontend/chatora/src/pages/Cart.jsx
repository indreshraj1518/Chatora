import { useState, useEffect } from "react";
import axios from "axios"; // 👈 ADD THIS

const Cart = () => {
  const [cart, setCart] = useState([]);

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(data);
  }, []);

  // ➕ increase qty
  const increaseQty = (index) => {
    const updated = [...cart];
    updated[index].qty += 1;
    setCart(updated);
    localStorage.setItem("cart", JSON.stringify(updated));
  };

  // ➖ decrease qty
  const decreaseQty = (index) => {
    const updated = [...cart];

    if (updated[index].qty > 1) {
      updated[index].qty -= 1;
    } else {
      updated.splice(index, 1);
    }

    setCart(updated);
    localStorage.setItem("cart", JSON.stringify(updated));
  };

  // ❌ remove item
  const removeItem = (index) => {
    const updated = cart.filter((_, i) => i !== index);
    setCart(updated);
    localStorage.setItem("cart", JSON.stringify(updated));
  };

  // 💰 total
  const total = cart.reduce(
    (acc, item) => acc + item.price * item.qty,
    0
  );

  // 🚀 PLACE ORDER FUNCTION (MAIN FIX)
  const handlePlaceOrder = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));

      if (!user) {
        alert("Please login first");
        return;
      }

      const res = await axios.post("http://localhost:5000/api/orders", {
        items: cart,
        totalPrice: total,
        userId: user._id
      });

      alert("Order Placed Successfully ✅");

      // 🧹 clear cart after order
      localStorage.removeItem("cart");
      setCart([]);

    } catch (err) {
      console.error(err);
      alert("Order Failed ❌");
    }
  };

  return (
    <div className="min-h-screen p-6 bg-gray-100 dark:bg-gray-900 text-black dark:text-white">

      <h1 className="text-3xl font-bold mb-6">🛒 Your Cart</h1>

      {cart.length === 0 ? (
        <p className="text-gray-600 dark:text-gray-400">
          Your cart is empty 😔
        </p>
      ) : (
        <>
          {/* Cart Items */}
          <div className="space-y-4">
            {cart.map((item, index) => (
              <div
                key={index}
                className="flex flex-col md:flex-row justify-between items-center bg-white dark:bg-gray-800 p-4 rounded-xl shadow border dark:border-gray-700"
              >
                <div>
                  <h2 className="text-lg font-semibold">{item.name}</h2>
                  <p className="text-gray-600 dark:text-gray-300">
                    ₹{item.price}
                  </p>
                  <p className="text-sm">Size: {item.size}</p>
                </div>

                <div className="flex items-center gap-3 mt-3 md:mt-0">

                  <button
                    onClick={() => decreaseQty(index)}
                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                  >
                    -
                  </button>

                  <span className="font-semibold">{item.qty}</span>

                  <button
                    onClick={() => increaseQty(index)}
                    className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded"
                  >
                    +
                  </button>

                  <button
                    onClick={() => removeItem(index)}
                    className="ml-4 text-red-500 hover:underline"
                  >
                    Remove
                  </button>

                </div>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="mt-8 bg-white dark:bg-gray-800 p-5 rounded-xl shadow border dark:border-gray-700">

            <h2 className="text-xl font-bold mb-3">Order Summary</h2>

            <div className="flex justify-between text-lg mb-2">
              <span>Total Items</span>
              <span>{cart.length}</span>
            </div>

            <div className="flex justify-between text-lg font-bold">
              <span>Total Price</span>
              <span>₹{total}</span>
            </div>

            {/* 🔥 FIXED BUTTON */}
            <button
              onClick={handlePlaceOrder}
              className="mt-4 w-full bg-orange-500 hover:bg-orange-600 text-white py-2 rounded-lg font-semibold transition"
            >
              Place Order
            </button>

          </div>
        </>
      )}
    </div>
  );
};

export default Cart;