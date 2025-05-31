import React from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

const CalendarModal = ({
  show,
  onClose,
  date,
  calendarDate,
  setCalendarDate,
  setDate,
}) => {
  const calendarTileClassName = ({ date, view }) => {
    if (view === "month") {
      const day = date.getDay();
      if (day === 5 || day === 0) {
        return "calendar-holiday";
      }
      return "calendar-weekday";
    }
    return "";
  };

  if (!show) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/30"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg shadow-lg p-6 w-[90vw] max-w-xs"
        onClick={e => e.stopPropagation()}
      >
        <h3 className="text-lg font-bold mb-4 text-secondary text-center">Select Date</h3>
        <Calendar
          value={calendarDate || new Date(date)}
          onChange={d => {
            const picked = new Date(d);
            const tzOffset = picked.getTimezoneOffset() * 60000;
            const iso = new Date(picked.getTime() - tzOffset).toISOString().slice(0, 10);
            setDate(iso);
            setCalendarDate(d);
            onClose();
          }}
          locale="en-GB"
          className="mb-4 w-full custom-calendar"
          tileClassName={calendarTileClassName}
        />
      </div>
    </div>
  );
};

export default CalendarModal;
