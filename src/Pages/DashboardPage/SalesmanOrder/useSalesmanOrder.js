import { useEffect, useState, useRef } from "react";
import { toast } from "react-hot-toast";
import { getTimestampFromObjectId, toEnglishNumber, toBangla } from "./helpers";

// Dummy API endpoints (replace with your actual endpoints)
const API_ITEMS = "https://mahi-bakery.onrender.com/api/items";
const API_SALESMEN = "https://mahi-bakery.onrender.com/api/salesmen";
const API_ORDERS = "https://mahi-bakery.onrender.com/api/salesman-orders";
const API_DAY_ORDERS = "https://mahi-bakery.onrender.com/api/salesman-day-orders";

export default function useSalesmanOrder() {
  const [items, setItems] = useState([]);
  const [salesmen, setSalesmen] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cellValues, setCellValues] = useState({});
  const [ghorerMal, setGhorerMal] = useState({});
  const [date, setDate] = useState(() => {
    const today = new Date();
    const tzOffset = today.getTimezoneOffset() * 60000;
    return new Date(today.getTime() - tzOffset).toISOString().slice(0, 10);
  });
  const [showDateModal, setShowDateModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const inputRefs = useRef({});
  const [calendarDate, setCalendarDate] = useState(null);

  // Fetch data
  useEffect(() => {
    setLoading(true);
    Promise.all([
      fetch(`${API_ITEMS}`).then(res => res.json()),
      fetch(`${API_SALESMEN}`).then(res => res.json()),
      fetch(`${API_ORDERS}?date=${date}`).then(res => res.json()),
    ]).then(([itemsData, salesmenData, ordersData]) => {
      // Sort items: oldest first (top), newest last (bottom)
      const sortedItems = [...itemsData].sort(
        (a, b) =>
          (a.createdAt
            ? new Date(a.createdAt).getTime()
            : getTimestampFromObjectId(a._id)) -
          (b.createdAt
            ? new Date(b.createdAt).getTime()
            : getTimestampFromObjectId(b._id))
      );
      setItems(sortedItems);
      setSalesmen(salesmenData);

      // Prepare cell values for quick editing
      const cellObj = {};
      ordersData.forEach(order => {
        cellObj[`${order.salesmanId}_${order.itemId}`] = order.qty || "";
      });
      setCellValues(cellObj);

      // Prepare ঘরের মাল values if you want to persist them (optional)
      // For now, just keep in state
      setGhorerMal({});
      setOrders(ordersData);
      setLoading(false);
    });
  }, [date]);

  // Handle cell value change for salesman order
  const handleCellChange = (salesmanId, itemId, value) => {
    setCellValues(prev => ({
      ...prev,
      [`${salesmanId}_${itemId}`]: value.replace(/[^০-৯0-9]/g, ""),
    }));
  };

  // Save cell value to backend on blur
  const handleCellBlur = async (salesmanId, itemId, value) => {
    try {
      const res = await fetch(API_ORDERS, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          salesmanId,
          itemId,
          qty: value,
          date,
        }),
      });
      if (!res.ok) throw new Error();
      toast.success("Saved!");
    } catch {
      toast.error("Failed to save!");
    }
  };

  // Handle ঘরের মাল value change
  const handleGhorerMalChange = (itemId, value) => {
    setGhorerMal(prev => ({
      ...prev,
      [itemId]: value.replace(/[^০-৯0-9]/g, ""),
    }));
  };

  // Calculate total pieces for each item (sum of all salesman columns, minus ঘরের মাল)
  const getTotalPieces = (itemId) => {
    let total = 0;
    salesmen.forEach(s => {
      const val = cellValues[`${s._id}_${itemId}`];
      const num = parseInt(toEnglishNumber(val), 10);
      if (!isNaN(num)) total += num;
    });
    const ghorer = parseInt(toEnglishNumber(ghorerMal[itemId]), 10) || 0;
    return total - ghorer;
  };

  // Calculate total ঘরের মাল and total মোট পিস for all items
  const totalGhorerMal = items.reduce(
    (sum, item) => sum + (parseInt(toEnglishNumber(ghorerMal[item._id]), 10) || 0),
    0
  );
  const totalMotPcs = items.reduce(
    (sum, item) => sum + (getTotalPieces(item._id) || 0),
    0
  );

  // Keyboard navigation for all cells (including ঘরের মাল)
  const handleKeyDown = (e, rowIdx, colIdx) => {
    const totalCols = salesmen.length + 1; // +1 for ঘরের মাল
    const totalRows = items.length;
    let nextRow = rowIdx;
    let nextCol = colIdx;

    if (e.key === "ArrowRight") {
      if (colIdx < totalCols - 1) nextCol++;
    } else if (e.key === "ArrowLeft") {
      if (colIdx > 0) nextCol--;
    } else if (e.key === "ArrowDown") {
      if (rowIdx < totalRows - 1) nextRow++;
    } else if (e.key === "ArrowUp") {
      if (rowIdx > 0) nextRow--;
    } else {
      return;
    }
    e.preventDefault();
    const refKey =
      nextCol < salesmen.length
        ? `${nextRow}_${nextCol}_salesman`
        : `${nextRow}_ghorerMal`;
    if (inputRefs.current[refKey]) {
      inputRefs.current[refKey].focus();
      inputRefs.current[refKey].select && inputRefs.current[refKey].select();
    }
  };

  // Save all salesman orders for the selected date
  const handleSaveAll = async () => {
    setSaving(true);
    const toastId = toast.loading("Saving...");
    try {
      // Prepare salesman array: [{ salesmanId, itemId, qty }]
      const salesman = [];
      for (const item of items) {
        for (const s of salesmen) {
          const qty = cellValues[`${s._id}_${item._id}`] || "";
          salesman.push({
            salesmanId: s._id,
            itemId: item._id,
            qty,
          });
        }
      }
      // Calculate totals
      const ghorerMalTotal = items.reduce(
        (sum, item) => sum + (parseInt(toEnglishNumber(ghorerMal[item._id]), 10) || 0),
        0
      );
      const motPcsTotal = items.reduce(
        (sum, item) => sum + (getTotalPieces(item._id) || 0),
        0
      );
      // Save daily summary
      await fetch(API_DAY_ORDERS, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          date,
          salesman,
          ghorerMalTotal,
          motPcsTotal,
        }),
      });
      toast.dismiss(toastId);
      toast.success("Saved successfully!");
    } catch {
      toast.dismiss(toastId);
      toast.error("Failed to save!");
    }
    setSaving(false);
  };

  return {
    items,
    salesmen,
    orders,
    loading,
    cellValues,
    ghorerMal,
    date,
    setDate,
    showDateModal,
    setShowDateModal,
    saving,
    setSaving,
    inputRefs,
    calendarDate,
    setCalendarDate,
    handleCellChange,
    handleCellBlur,
    handleGhorerMalChange,
    handleKeyDown,
    handleSaveAll,
    getTotalPieces,
    totalGhorerMal,
    totalMotPcs,
    toBangla,
  };
}
