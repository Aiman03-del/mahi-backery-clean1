import React from "react";
import { FaChevronLeft, FaChevronRight, FaRegCalendarAlt } from "react-icons/fa";

const DatePicker = ({ date, setDate, setShowDateModal, saving, handleSaveAll }) => {
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

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between mb-4 gap-2">
      <div className="flex items-center gap-2">
        <button
          type="button"
          className="p-2 rounded bg-primary/20 text-secondary font-bold border border-primary/40 hover:bg-primary/40 transition-colors text-xl"
          onClick={() => setDate(getPrevDate(date))}
          aria-label="Previous Day"
        >
          <FaChevronLeft className="text-xl" />
        </button>
        <button
          type="button"
          className="flex items-center justify-center p-2 rounded bg-primary/20 text-secondary font-bold border border-primary/40 hover:bg-primary/40 transition-colors text-xl"
          onClick={() => setShowDateModal(true)}
          aria-label="Pick Date"
        >
          <FaRegCalendarAlt className="text-xl" />
        </button>
        <span className="bg-primary/20 border border-primary/40 px-4 py-2 rounded text-secondary font-bold">
          Date: <span className="font-extrabold">{date}</span>
        </span>
        <button
          type="button"
          className="p-2 rounded bg-primary/20 text-secondary font-bold border border-primary/40 hover:bg-primary/40 transition-colors text-xl"
          onClick={() => setDate(getNextDate(date))}
          aria-label="Next Day"
        >
          <FaChevronRight className="text-xl" />
        </button>
      </div>
      <button
        className="bg-accent text-white px-6 py-2 rounded font-bold shadow hover:bg-accent/90 transition disabled:opacity-60"
        onClick={handleSaveAll}
        disabled={saving}
      >
        {saving ? "Saving..." : "Save"}
      </button>
    </div>
  );
};

export default DatePicker;
