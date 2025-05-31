/* eslint-disable no-unused-vars */
import React from "react";
import DatePicker from "./DatePicker";
import SalesmanTable from "./SalesmanTable";
import CalendarModal from "./CalendarModal";
import useSalesmanOrder from "./useSalesmanOrder";
import { toBangla } from "./helpers";

const SalesmanOrder = () => {
  const {
    items,
    salesmen,
    loading,
    cellValues,
    ghorerMal,
    date,
    setDate,
    showDateModal,
    setShowDateModal,
    saving,
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
  } = useSalesmanOrder();

  if (loading) return <div className="p-6 text-center">Loading...</div>;

  return (
    <div className="p-2 sm:p-4 max-w-full sm:max-w-6xl mx-auto">
      <CalendarModal
        show={showDateModal}
        onClose={() => setShowDateModal(false)}
        date={date}
        calendarDate={calendarDate}
        setCalendarDate={setCalendarDate}
        setDate={setDate}
      />
      <DatePicker
        date={date}
        setDate={setDate}
        setShowDateModal={setShowDateModal}
        saving={saving}
        handleSaveAll={handleSaveAll}
      />
      <SalesmanTable
        items={items}
        salesmen={salesmen}
        cellValues={cellValues}
        handleCellChange={handleCellChange}
        handleCellBlur={handleCellBlur}
        ghorerMal={ghorerMal}
        handleGhorerMalChange={handleGhorerMalChange}
        inputRefs={inputRefs}
        handleKeyDown={handleKeyDown}
        getTotalPieces={getTotalPieces}
        totalGhorerMal={totalGhorerMal}
        totalMotPcs={totalMotPcs}
        toBangla={toBangla}
      />
      <div className="block sm:hidden text-xs text-gray-400 text-center mt-2">
        Scroll horizontally to see all columns.
      </div>
      <style>
        {`
        /* Calendar weekday bar (Mon, Tue, ...) */
        .custom-calendar .react-calendar__month-view__weekdays__weekday abbr {
          font-weight: bold;
        }
        /* Month/Year label */
        .custom-calendar .react-calendar__navigation__label {
          color: var(--color-secondary, #a05a2c);
          font-weight: bold;
        }
        /* Month/Year arrows */
        .custom-calendar .react-calendar__navigation button {
          color: var(--color-secondary, #a05a2c);
          font-weight: bold;
        }
        /* Holidays (Friday/Sunday) */
        .custom-calendar .calendar-holiday {
          color: var(--color-secondary, #a05a2c) !important;
          font-weight: bold;
        }
        /* Weekdays (not holiday) */
        .custom-calendar .calendar-weekday {
          color: #222 !important;
          font-weight: bold;
        }
        `}
      </style>
    </div>
  );
};

export default SalesmanOrder;
