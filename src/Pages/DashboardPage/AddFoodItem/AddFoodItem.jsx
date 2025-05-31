import React, { useState } from "react";
import { toast } from "react-hot-toast";


const AddFoodItem = () => {
  const [itemName, setItemName] = useState("");
  const [itemPrice, setItemPrice] = useState(""); // new
  const [ingredientName, setIngredientName] = useState("");
  const [ingredientPrice, setIngredientPrice] = useState(""); // new
  const [salesmanName, setSalesmanName] = useState("");
  const [salesmanPhone, setSalesmanPhone] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAddItem = async (e) => {
    e.preventDefault();
    if (!itemName.trim()) return;
    setLoading(true);
    try {
      const res = await fetch(`https://mahi-bakery.onrender.com/api/items`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: itemName, price: itemPrice }),
      });
      if (res.ok) {
        setItemName("");
        setItemPrice("");
        toast.success("New item added!");
      } else {
        toast.error("Failed to add item!");
      }
    } catch {
      toast.error("Server error!");
    }
    setLoading(false);
  };

  const handleAddIngredient = async (e) => {
    e.preventDefault();
    if (!ingredientName.trim()) return;
    setLoading(true);
    try {
      const res = await fetch(`https://mahi-bakery.onrender.com/api/ingredients`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: ingredientName, price: ingredientPrice }),
      });
      if (res.ok) {
        setIngredientName("");
        setIngredientPrice("");
        toast.success("New ingredient added!");
      } else {
        toast.error("Failed to add ingredient!");
      }
    } catch {
      toast.error("Server error!");
    }
    setLoading(false);
  };

  const handleAddSalesman = async (e) => {
    e.preventDefault();
    if (!salesmanName.trim()) return; // Only name is required
    setLoading(true);
    try {
      const res = await fetch(`https://mahi-bakery.onrender.com/api/salesmen`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: salesmanName, phone: salesmanPhone }), // phone can be empty
      });
      if (res.ok) {
        setSalesmanName("");
        setSalesmanPhone("");
        toast.success("New salesman added!");
      } else if (res.status === 409) {
        toast.error("Salesman with this name already exists!");
      } else {
        toast.error("Failed to add salesman!");
      }
    } catch {
      toast.error("Server error!");
    }
    setLoading(false);
  };

  return (
    <div className="p-4 max-w-md mx-auto space-y-8">
      <h1 className="text-2xl font-extrabold text-center text-accent mb-8 tracking-tight">
        নতুন ফুড আইটেম, ইনগ্রেডিয়েন্ট ও সেলস ম্যান যোগ করুন
      </h1>
      <div className="bg-white rounded-xl shadow-lg p-6 border border-accent/30">
        <h2 className="text-xl font-bold text-accent mb-4 flex items-center gap-2">
          <span className="inline-block bg-accent/10 rounded-full p-2">
            <svg width="22" height="22" fill="none" viewBox="0 0 24 24">
              <path d="M12 5v14M5 12h14" stroke="#a05a2c" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </span>
          নতুন ফুড আইটেম যোগ করুন
        </h2>
        <form onSubmit={handleAddItem} className="flex gap-2 items-center">
          <input
            type="text"
            placeholder="নতুন ফুড আইটেম"
            value={itemName}
            onChange={e => setItemName(e.target.value)}
            className="border border-accent/40 px-3 py-2 text-secondary rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-accent/30 transition"
          />
          <input
            type="text" // changed from number to text
            placeholder="দাম (৳)"
            value={itemPrice}
            onChange={e => setItemPrice(e.target.value)}
            className="border border-accent/40 px-3 py-2 text-secondary rounded-lg w-28 focus:outline-none focus:ring-2 focus:ring-accent/30 transition"
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-accent text-white px-5 py-2  rounded-lg font-bold shadow hover:bg-accent/90 transition disabled:opacity-60"
          >
            Add
          </button>
        </form>
      </div>
      <div className="bg-white rounded-xl shadow-lg p-6 border border-accent/30">
        <h2 className="text-xl font-bold text-accent mb-4 flex items-center gap-2">
          <span className="inline-block bg-accent/10 rounded-full p-2">
            <svg width="22" height="22" fill="none" viewBox="0 0 24 24">
              <path d="M12 5v14M5 12h14" stroke="#a05a2c" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </span>
          নতুন ইনগ্রেডিয়েন্ট যোগ করুন
        </h2>
        <form onSubmit={handleAddIngredient} className="flex gap-2 items-center">
          <input
            type="text"
            placeholder="নতুন ইনগ্রেডিয়েন্ট"
            value={ingredientName}
            onChange={e => setIngredientName(e.target.value)}
            className="border border-accent/40 px-3 py-2 text-secondary rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-accent/30 transition"
          />
          <input
            type="text" // changed from number to text
            placeholder="দাম (৳)"
            value={ingredientPrice}
            onChange={e => setIngredientPrice(e.target.value)}
            className="border border-accent/40 px-3 py-2 text-secondary rounded-lg w-28 focus:outline-none focus:ring-2 focus:ring-accent/30 transition"
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-accent text-white px-5 py-2 rounded-lg font-bold shadow hover:bg-accent/90 transition disabled:opacity-60"
          >
            Add
          </button>
        </form>
      </div>
      <div className="bg-white rounded-xl shadow-lg p-6 border border-accent/30">
        <h2 className="text-xl font-bold text-accent mb-4 flex items-center gap-2">
          <span className="inline-block bg-accent/10 rounded-full p-2">
            <svg width="22" height="22" fill="none" viewBox="0 0 24 24">
              <path d="M12 5v14M5 12h14" stroke="#a05a2c" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </span>
          নতুন সেলস ম্যান যোগ করুন
        </h2>
        <form onSubmit={handleAddSalesman} className="flex gap-2 items-center flex-col sm:flex-row">
          <input
            type="text"
            placeholder="নাম"
            value={salesmanName}
            onChange={e => setSalesmanName(e.target.value)}
            className="border border-accent/40 px-3 py-2 text-secondary rounded-lg w-full sm:w-1/2 focus:outline-none focus:ring-2 focus:ring-accent/30 transition"
          />
          <input
            type="text"
            placeholder="ফোন নাম্বার"
            value={salesmanPhone}
            onChange={e => setSalesmanPhone(e.target.value)}
            className="border border-accent/40 px-3 py-2 text-secondary rounded-lg w-full sm:w-1/2 focus:outline-none focus:ring-2 focus:ring-accent/30 transition"
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-accent text-white px-5 py-2 rounded-lg font-bold shadow hover:bg-accent/90 transition disabled:opacity-60 w-full sm:w-auto"
          >
            Add
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddFoodItem;
