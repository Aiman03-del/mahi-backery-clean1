import React, { useState } from "react";
import { FiChevronLeft, FiChevronRight, FiCalendar } from "react-icons/fi";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

const DatePickerWithControls = ({
  selectedDate,
  setSelectedDate,
  displayDate,
}) => {
  const [showModal, setShowModal] = useState(false);
  const [calendarDate, setCalendarDate] = useState(
    selectedDate ? new Date(selectedDate) : new Date()
  );

  return (
    <>
      {/* উইকডে হেডার, মাস ও এরো বাটন কাস্টম স্টাইল */}
      <style>
        {`
          .react-calendar__month-view__weekdays__weekday {
            color: #000 !important;
            font-weight: bold !important;
          }
          .react-calendar__navigation__label {
            color: #cd4622 !important; /* Tailwind's blue-600, adjust if needed */
            font-weight: bold !important;
            font-size: 1.1em;
            background: none !important;
            border: none !important;
          }
          .react-calendar__navigation__arrow {
            color: #cd4622 !important; /* Tailwind's blue-600, adjust if needed */
            font-weight: bold !important;
            font-size: 1.2em;
            background: none !important;
            border: none !important;
          }
          .react-calendar__navigation button:enabled:hover,
          .react-calendar__navigation button:enabled:focus {
            background-color: #dbeafe !important; /* Tailwind's blue-100 */
          }
        `}
      </style>
      <button
        type="button"
        aria-label="কাস্টম তারিখ নির্বাচন করুন"
        className="px-2 py-1 rounded text-accent cursor-pointer hover:bg-secondary/40 transition flex items-center justify-center ml-2"
        style={{ fontSize: 18, fontWeight: "bold" }}
        onClick={() => {
          setCalendarDate(selectedDate ? new Date(selectedDate) : new Date());
          setShowModal(true);
        }}
      >
        <FiCalendar size={20} className="mr-1" />
      </button>
      <button
        type="button"
        aria-label="একদিন আগে"
        className="px-1 py-1 rounded text-accent cursor-pointer hover:bg-secondary/40 transition flex items-center justify-center"
        style={{ fontSize: 18, fontWeight: "bold" }}
        onClick={() => {
          const [y, m, d] = selectedDate.split("-");
          const prev = new Date(Number(y), Number(m) - 1, Number(d) - 1);
          const tzOffset = prev.getTimezoneOffset() * 60000;
          const localISO = new Date(prev.getTime() - tzOffset)
            .toISOString()
            .slice(0, 10);
          setSelectedDate(localISO);
        }}
      >
        <FiChevronLeft size={22} />
      </button>
      <span className="text-xs md:text-xl font-semibold text-accent bg-primary/30 px-3 py-1 rounded">
        {displayDate}
      </span>
      <button
        type="button"
        aria-label="একদিন পরে"
        className="px-1 py-1 rounded text-accent cursor-pointer hover:bg-secondary/40 transition flex items-center justify-center"
        style={{ fontSize: 18, fontWeight: "bold" }}
        onClick={() => {
          const [y, m, d] = selectedDate.split("-");
          const next = new Date(Number(y), Number(m) - 1, Number(d) + 1);
          const tzOffset = next.getTimezoneOffset() * 60000;
          const localISO = new Date(next.getTime() - tzOffset)
            .toISOString()
            .slice(0, 10);
          setSelectedDate(localISO);
        }}
      >
        <FiChevronRight size={22} />
      </button>

      {/* Modal */}
      {showModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
          onClick={() => setShowModal(false)}
        >
          <div
            className="bg-white rounded-lg shadow-lg p-6 w-[90vw] max-w-xs md:max-w-sm flex flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-lg font-semibold mb-4 text-accent">
              তারিখ নির্বাচন করুন
            </h2>
            <Calendar
              onChange={(date) => {
                // লোকাল টাইমে 'YYYY-MM-DD' ফরম্যাট
                const getLocalDateString = (d) => {
                  if (!d) return new Date().toLocaleDateString('sv-SE');
                  const year = d.getFullYear();
                  const month = String(d.getMonth() + 1).padStart(2, '0');
                  const day = String(d.getDate()).padStart(2, '0');
                  return `${year}-${month}-${day}`;
                };
                setSelectedDate(getLocalDateString(date));
                setShowModal(false);
              }}
              value={calendarDate}
              maxDate={new Date()}
              locale="bn-BD"
              className="mb-4 w-full border-none"
              tileClassName={({ date }) => {
                // 0: Sunday, 6: Saturday
                if (date.getDay() === 0 || date.getDay() === 6) {
                  return "text-red-600 font-bold"; // ছুটির দিন: রেড ও বোল্ড
                }
                return "text-black font-bold"; // সপ্তাহের দিন: কালো ও বোল্ড
              }}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default DatePickerWithControls;
