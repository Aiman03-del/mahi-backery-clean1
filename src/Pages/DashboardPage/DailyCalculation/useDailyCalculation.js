import { useState, useEffect, useRef, createRef } from "react";
import { toast } from "react-hot-toast";

const useDailyCalculation = () => {
  const today = new Date();

  const [selectedDate, setSelectedDate] = useState(() => {
    const tzOffset = today.getTimezoneOffset() * 60000;
    const localISO = new Date(today.getTime() - tzOffset)
      .toISOString()
      .slice(0, 10);
    return localISO;
  });
  const [displayDate, setDisplayDate] = useState(() => {
    const tzOffset = today.getTimezoneOffset() * 60000;
    const localDate = new Date(today.getTime() - tzOffset);
    return localDate.toLocaleDateString("bn-BD", {
      year: "numeric",
      month: "long",
      day: "numeric",
      weekday: "long",
    });
  });
  const [loading, setLoading] = useState(false);

  const getDateKey = (dateObj) => {
    if (!dateObj) return "";
    return dateObj.toISOString().slice(0, 10);
  };

  const [items, setItems] = useState([]);
  const [ingredients, setIngredients] = useState([]);
  const [values, setValues] = useState([]);
  // Add defaultPrices state
  const [defaultPrices, setDefaultPrices] = useState([]);
  const [prices, setPrices] = useState([]);
  const [retails, setRetails] = useState([]);
  const retailRefs = useRef([]);
  const [pieces, setPieces] = useState([]);
  const piecesRefs = useRef([]);
  const inputRefs = useRef([]);
  const priceRefs = useRef([]);

  // DatePicker modal open state
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [itemRes, ingRes] = await Promise.all([
          fetch(`https://mahi-bakery.onrender.com/api/items`),
          fetch(`https://mahi-bakery.onrender.com/api/ingredients`),
        ]);
        const itemData = await itemRes.json();
        const ingData = await ingRes.json();
        const sortedItems = [...itemData].sort((a, b) =>
          (a._id || "").localeCompare(b._id || "")
        );
        const sortedIngredients = [...ingData].sort((a, b) =>
          (a._id || "").localeCompare(b._id || "")
        );
        setItems(sortedItems.map((i) => i.name));
        setIngredients(sortedIngredients.map((i) => i.name));
        // Set defaultPrices from ingData
        const pricesArr = sortedIngredients.map((i) => i.price || "0");
        setDefaultPrices(pricesArr);
      } catch (error) {
        // Error fetching items or ingredients
        console.log(error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (!items.length || !ingredients.length) return;
    const fetchUsage = async () => {
      const dateKey = getDateKey(new Date(selectedDate));
      try {
        const res = await fetch(`https://mahi-bakery.onrender.com/api/usage/${dateKey}`);
        if (res.ok) {
          const data = await res.json();
          let newValues = ingredients.map(() => Array(items.length).fill(""));
          if (data.items && Array.isArray(data.items)) {
            data.items.forEach((itemObj) => {
              const itemIndex = items.indexOf(itemObj.name);
              if (itemIndex === -1) return;
              if (itemObj.ingredients) {
                itemObj.ingredients.forEach((ingObj) => {
                  const ingIndex = ingredients.indexOf(ingObj.name);
                  if (ingIndex === -1) return;
                  newValues[ingIndex][itemIndex] = ingObj.value || "0";
                });
              }
            });
          }
          setValues(newValues);
          // If loadedPrices is empty, use defaultPrices
          let loadedPrices = data.prices || [];
          if (loadedPrices.length < ingredients.length) {
            loadedPrices = [
              ...loadedPrices,
              ...Array(ingredients.length - loadedPrices.length).fill(""),
            ];
          }
          // If no saved prices, use defaultPrices
          setPrices(
            loadedPrices.map((p, idx) =>
              p && p !== "0" ? p : (defaultPrices[idx] || "0")
            ).slice(0, ingredients.length)
          );
          let loadedRetails = data.retails || [];
          if (loadedRetails.length < ingredients.length) {
            loadedRetails = [
              ...loadedRetails,
              ...Array(ingredients.length - loadedRetails.length).fill(""),
            ];
          }
          setRetails(loadedRetails.slice(0, ingredients.length));
          let loadedPieces = data.pieces || [];
          if (loadedPieces.length < items.length) {
            loadedPieces = [
              ...loadedPieces,
              ...Array(items.length - loadedPieces.length).fill(""),
            ];
          }
          setPieces(loadedPieces.slice(0, items.length));
        } else if (res.status === 404) {
          setValues(
            Array.from({ length: ingredients.length }, () =>
              Array(items.length).fill("")
            )
          );
          // Use defaultPrices as initial prices
          setPrices(defaultPrices.slice(0, ingredients.length));
          setRetails(Array(ingredients.length).fill(""));
          setPieces(Array(items.length).fill(""));
        } else {
          setValues(
            Array.from({ length: ingredients.length }, () =>
              Array(items.length).fill("")
            )
          );
          setPrices(defaultPrices.slice(0, ingredients.length));
          setRetails(Array(ingredients.length).fill(""));
          setPieces(Array(items.length).fill(""));
        }
      } catch {
        setValues(
          Array.from({ length: ingredients.length }, () =>
            Array(items.length).fill("")
          )
        );
        setPrices(defaultPrices.slice(0, ingredients.length));
        setRetails(Array(ingredients.length).fill(""));
        setPieces(Array(items.length).fill(""));
      }
    };
    fetchUsage();
  }, [selectedDate, items, ingredients, defaultPrices]);

  useEffect(() => {
    if (selectedDate) {
      const [year, month, day] = selectedDate.split("-");
      const localDate = new Date(Number(year), Number(month) - 1, Number(day));
      setDisplayDate(
        localDate.toLocaleDateString("bn-BD", {
          year: "numeric",
          month: "long",
          day: "numeric",
          weekday: "long",
        })
      );
    }
  }, [selectedDate]);

  useEffect(() => {
    setValues(
      Array.from({ length: ingredients.length }, () =>
        Array(items.length).fill("")
      )
    );
    // Use defaultPrices as initial prices
    setPrices(defaultPrices.slice(0, ingredients.length));
    setRetails(Array(ingredients.length).fill(""));
    setPieces(Array(items.length).fill(""));

    // Use imported createRef directly (not require or window)
    inputRefs.current = Array.from({ length: ingredients.length }, () =>
      Array(items.length)
        .fill()
        .map(() => createRef())
    );
    priceRefs.current = Array.from({ length: ingredients.length }, () =>
      createRef()
    );
    retailRefs.current = Array.from({ length: ingredients.length }, () =>
      createRef()
    );
    piecesRefs.current = Array.from({ length: items.length }, () =>
      createRef()
    );
  }, [items, ingredients, defaultPrices]);

  const handleChange = (rowIdx, colIdx, e) => {
    let val = e.target.value;
    val = val.replace(/[০-৯]/g, (d) => "০১২৩৪৫৬৭৮৯".indexOf(d));
    val = val.replace(/[^\d.]/g, "");
    const newValues = values.map((arr) => [...arr]);
    newValues[rowIdx][colIdx] = val;
    setValues(newValues);
  };

  

  const handleRetailChange = (rowIdx, e) => {
    let val = e.target.value;
    val = val.replace(/[০-৯]/g, (d) => "০১২৩৪৫৬৭৮৯".indexOf(d));
    val = val.replace(/[^\d.]/g, "");
    const newRetails = [...retails];
    newRetails[rowIdx] = val;
    setRetails(newRetails);
  };

  const handlePiecesChange = (colIdx, e) => {
    let val = e.target.value;
    val = val.replace(/[০-৯]/g, (d) => "০১২৩৪৫৬৭৮৯".indexOf(d));
    val = val.replace(/[^\d]/g, "");
    const newPieces = [...pieces];
    newPieces[colIdx] = val;
    setPieces(newPieces);
  };

  const handleKeyDown = (rowIdx, colIdx, e) => {
    let nextRow = rowIdx;
    let nextCol = colIdx;
    if (e.key === "Enter" || e.key === "ArrowDown") {
      nextRow = (rowIdx + 1) % ingredients.length;
    } else if (e.key === "ArrowUp") {
      if (rowIdx === 0) {
        if (piecesRefs.current[colIdx] && piecesRefs.current[colIdx].current) {
          e.preventDefault();
          piecesRefs.current[colIdx].current.focus();
          return;
        }
      } else {
        nextRow = (rowIdx - 1 + ingredients.length) % ingredients.length;
      }
    } else if (e.key === "ArrowRight") {
      nextCol = (colIdx + 1) % items.length;
    } else if (e.key === "ArrowLeft") {
      nextCol = (colIdx - 1 + items.length) % items.length;
    } else {
      return;
    }
    e.preventDefault();
    if (
      inputRefs.current[nextRow] &&
      inputRefs.current[nextRow][nextCol] &&
      inputRefs.current[nextRow][nextCol].current
    ) {
      inputRefs.current[nextRow][nextCol].current.focus();
    }
  };

  const handlePriceKeyDown = (rowIdx, e) => {
    if (e.key === "Enter") {
      const nextRow = (rowIdx + 1) % ingredients.length;
      if (priceRefs.current[nextRow] && priceRefs.current[nextRow].current) {
        priceRefs.current[nextRow].current.focus();
      }
    }
  };

  const handleRetailKeyDown = (rowIdx, e) => {
    if (e.key === "Enter") {
      const nextRow = (rowIdx + 1) % ingredients.length;
      if (retailRefs.current[nextRow] && retailRefs.current[nextRow].current) {
        retailRefs.current[nextRow].current.focus();
      }
    }
  };

  const handlePiecesKeyDown = (colIdx, e) => {
    let nextCol = colIdx;
    if (e.key === "Enter" || e.key === "ArrowDown") {
      if (
        inputRefs.current[0] &&
        inputRefs.current[0][colIdx] &&
        inputRefs.current[0][colIdx].current
      ) {
        e.preventDefault();
        inputRefs.current[0][colIdx].current.focus();
        return;
      }
    } else if (e.key === "ArrowRight") {
      nextCol = (colIdx + 1) % items.length;
    } else if (e.key === "ArrowLeft") {
      nextCol = (colIdx - 1 + items.length) % items.length;
    } else if (e.key === "ArrowUp") {
      return;
    } else {
      return;
    }
    e.preventDefault();
    if (piecesRefs.current[nextCol] && piecesRefs.current[nextCol].current) {
      piecesRefs.current[nextCol].current.focus();
    }
  };

  const toBangla = (n) =>
    n
      .toString()
      .replace(/\d/g, (d) => "০১২৩৪৫৬৭৮৯"[d])
      .replace(/NaN/, "০");

  const rowSum = (row) => row.reduce((sum, v) => sum + (parseFloat(v) || 0), 0);

  // For display and calculation, use prices[rowIdx] || defaultPrices[rowIdx]
  const getPrice = (rowIdx) => {
    const price =
      prices[rowIdx] && prices[rowIdx] !== "0"
        ? prices[rowIdx]
        : (defaultPrices[rowIdx] || "0");
    return price;
  };


  // For total calculation, use getPrice(rowIdx)
  const totalAmount = values
    .map(
      (row, i) =>
        parseFloat(rowSum(row).toFixed(2)) * (parseFloat(getPrice(i)) || 0) +
        (parseFloat(retails[i]) || 0)
    )
    .reduce((sum, v) => sum + v, 0);

  const handleSave = async () => {
    setLoading(true);
    const itemsForBackend = items.map((item, colIdx) => ({
      name: item,
      ingredients: ingredients.map((ing, rowIdx) => ({
        name: ing,
        value: values[rowIdx]?.[colIdx] || "0",
      })),
    }));
    // Save prices as string, fallback to defaultPrices if empty
    const pricesForBackend = prices.map(
      (p, idx) => (p && p !== "0" ? p : (defaultPrices[idx] || "0"))
    );
    const retailsForBackend = retails.map((r) => r || "0");
    const piecesForBackend = pieces.map((p) => p || "0");
    const totalExpense = values
      .map(
        (row, i) =>
          parseFloat(
            row.reduce((sum, v) => sum + (parseFloat(v) || 0), 0).toFixed(2)
          ) * (parseFloat(getPrice(i)) || 0)
      )
      .reduce((sum, v) => sum + v, 0);

    const dateStr = selectedDate;

    try {
      const res = await fetch(`https://mahi-bakery.onrender.com/usage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          date: dateStr,
          items: itemsForBackend,
          prices: pricesForBackend,
          retails: retailsForBackend,
          pieces: piecesForBackend,
          totalExpense: totalExpense.toFixed(2),
        }),
      });
      if (res.ok) {
        toast.success("Saved successfully!");
      } else {
        toast.error("Failed to save!");
      }
    } catch {
      toast.error("Failed to save!");
    }
    setLoading(false);
  };

  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      !document.getElementById("datepicker-portal-root")
    ) {
      const portalDiv = document.createElement("div");
      portalDiv.id = "datepicker-portal-root";
      document.body.appendChild(portalDiv);
    }
  }, []);

  return {
    selectedDate,
    setSelectedDate,
    displayDate,
    loading,
    items,
    ingredients,
    values,
    prices,
    retails,
    pieces,
    inputRefs,
    priceRefs,
    retailRefs,
    piecesRefs,
    handleChange,
    handleRetailChange,
    handlePiecesChange,
    handleKeyDown,
    handlePriceKeyDown,
    handleRetailKeyDown,
    handlePiecesKeyDown,
    toBangla,
    rowSum,
    totalAmount,
    handleSave,
    isDatePickerOpen,
    setIsDatePickerOpen,
    defaultPrices,
    getPrice,
  };
};

export default useDailyCalculation;
