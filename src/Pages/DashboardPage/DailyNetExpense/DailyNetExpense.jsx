import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

const DailyNetExpense = () => {
  const [selectedDate, setSelectedDate] = useState(() => {
    const today = new Date();
    const tzOffset = today.getTimezoneOffset() * 60000;
    return new Date(today.getTime() - tzOffset).toISOString().slice(0, 10);
  });
  const [usage, setUsage] = useState(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch usage for selected date
  useEffect(() => {
    setLoading(true);
    fetch(`https://mahi-bakery.onrender.com/api/usage/${selectedDate}`)
      .then((res) => res.json())
      .then((data) => setUsage(data))
      .catch(() => toast.error("Failed to fetch usage"))
      .finally(() => setLoading(false));
  }, [selectedDate]);

  // Fetch all items with price
  useEffect(() => {
    fetch(`https://mahi-bakery.onrender.com/api/items`)
      .then((res) => res.json())
      .then((data) => setItems(data))
      .catch(() => toast.error("Failed to fetch items"));
  }, []);

  if (loading) return <div className="p-6 text-center">Loading...</div>;
  if (!usage || !items.length) return null;

  // Helper to get previous/next date string
  const getPrevDate = (dateStr) => {
    const d = new Date(dateStr);
    d.setDate(d.getDate() - 1);
    return d.toISOString().slice(0, 10);
  };
  const getNextDate = (dateStr) => {
    const d = new Date(dateStr);
    d.setDate(d.getDate() + 1);
    return d.toISOString().slice(0, 10);
  };

  const toEnglishNumber = (str) =>
    (str || "")
      .toString()
      .replace(/[০-৯]/g, (d) => "০১২৩৪৫৬৭৮৯".indexOf(d))
      .replace("।", ".");
  const toBangla = (n) =>
    n
      .toString()
      .replace(/\d/g, (d) => "০১২৩৪৫৬৭৮৯"[d])
      .replace(/NaN/, "০");

  // Sort items oldest first (top), newest last (bottom)
  const sortedItems = [...items].sort((a, b) => {
    if (a._id && b._id) return a._id.localeCompare(b._id);
    return 0;
  });

  // Map item name to price (Bangla to English)
  const itemPriceMap = {};
  sortedItems.forEach((item) => {
    const priceNum = parseFloat(toEnglishNumber(item.price));
    itemPriceMap[item.name] = isNaN(priceNum) ? 0 : priceNum;
  });

  const pieces = usage.pieces || [];

  let totalSales = 0;
  const salesRows = sortedItems.map((item, idx) => {
    const pcs = parseFloat(pieces[idx]) || 0;
    const price = itemPriceMap[item.name] || 0;
    const sales = pcs * price;
    totalSales += sales;
    return (
      <tr key={item.name}>
        <td className="border-[3px] px-2 py-1 text-secondary font-extrabold">
          {item.name}
        </td>
        <td className="border-[3px] px-2 py-1 text-right text-secondary font-extrabold">
          {toBangla(pcs)}
        </td>
        <td className="border-[3px] px-2 py-1 text-right text-secondary font-extrabold">
          {toBangla(price)}
        </td>
        <td className="border-[3px] px-2 py-1 text-right text-secondary font-extrabold">
          {toBangla(sales.toFixed(2))}
        </td>
      </tr>
    );
  });

  const totalExpense = parseFloat(usage.totalExpense) || 0;
  const netExpense = totalExpense - totalSales;

  return (
    <div className="p-2 sm:p-4 max-w-full sm:max-w-5xl mx-auto">
      <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-secondary text-center">
        Daily Net Expense
      </h2>
      <div className="mb-6 flex flex-col sm:flex-row items-center gap-4 justify-center text-lg sm:text-xl">
        <label className="font-semibold text-secondary">Date:</label>
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="cursor-pointer p-2 rounded bg-primary/20 text-secondary font-bold border border-primary/40 hover:bg-primary/40 transition-colors text-xl"
            onClick={() => setSelectedDate(getPrevDate(selectedDate))}
            aria-label="Previous Day"
          >
            <FaChevronLeft className="text-2xl" />
          </button>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="text-secondary font-bold px-2 py-1 rounded text-lg sm:text-xl"
          />
          <button
            type="button"
            className="cursor-pointer p-2 rounded bg-primary/20 text-secondary font-bold border border-primary/40 hover:bg-primary/40 transition-colors text-xl"
            onClick={() => setSelectedDate(getNextDate(selectedDate))}
            aria-label="Next Day"
          >
            <FaChevronRight className="text-2xl" />
          </button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse mb-4 text-lg sm:text-xl">
          <thead>
            <tr className="bg-primary/10">
              <th className="border-[3px] px-4 py-2 text-secondary font-extrabold text-lg sm:text-xl">
                Item
              </th>
              <th className="border-[3px] px-4 py-2 text-secondary font-extrabold text-lg sm:text-xl">
                Pieces
              </th>
              <th className="border-[3px] px-4 py-2 text-secondary font-extrabold text-lg sm:text-xl">
                Price
              </th>
              <th className="border-[3px] px-4 py-2 text-secondary font-extrabold text-lg sm:text-xl">
                Total Sales
              </th>
            </tr>
          </thead>
          <tbody>
            {salesRows}
            <tr className="font-bold bg-primary/20">
              <td
                className="border-[3px] px-4 py-2 text-secondary text-right text-lg sm:text-xl"
                colSpan={3}
              >
                Total Sales
              </td>
              <td className="border-[3px] px-4 py-2 text-right text-secondary text-lg sm:text-xl">
                {toBangla(totalSales.toFixed(2))}
              </td>
            </tr>
            <tr className="font-bold bg-primary/30">
              <td className="border-[3px] px-4 py-2 text-secondary text-right text-lg sm:text-xl" colSpan={3}>
                Total Expense
              </td>
              <td className="border-[3px] px-4 py-2 text-right text-secondary text-lg sm:text-xl">
                {toBangla(totalExpense.toFixed(2))}
              </td>
            </tr>
            <tr className="font-bold bg-primary/40">
              <td className="border-[3px] px-4 py-2 text-secondary text-right text-lg sm:text-xl" colSpan={3}>
                Net Expense
              </td>
              <td className="border-[3px] px-4 py-2 text-right text-secondary text-lg sm:text-xl">
                {toBangla(netExpense.toFixed(2))}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DailyNetExpense;
