import React, { useMemo, useCallback } from "react";
import { useForm, Controller } from "react-hook-form";
import useDailyCalculation from "./useDailyCalculation";
import DatePickerWithControls from "./DatePickerWithControls";
import IngredientRow from "./IngredientRow";
import SaveButton from "./SaveButton";

const MemoizedIngredientRow = React.memo(IngredientRow);

const DailyCalculation = () => {
  const {
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
    handlePriceChange,
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
  } = useDailyCalculation();

  // react-hook-form setup
  const { control, handleSubmit, setValue, getValues } = useForm({
    defaultValues: {
      values,
      prices,
      retails,
      pieces,
    },
    mode: "onChange",
  });

  // Update form values when data changes (sync with state)
  React.useEffect(() => {
    setValue("values", values);
    setValue("prices", prices);
    setValue("retails", retails);
    setValue("pieces", pieces);
  }, [values, prices, retails, pieces, setValue]);

  // Memoize handlers to avoid unnecessary re-renders
const memoHandleChange = useCallback(
  (rowIdx, colIdx, e) => {
    const event = { ...e };
    handleChange(rowIdx, colIdx, event);
    const numericVal = event.target.value.replace(/[০-৯]/g, (d) => "০১২৩৪৫৬৭৮৯".indexOf(d).toString());
    const newValues = getValues("values").map((arr) => [...arr]);
    newValues[rowIdx][colIdx] = numericVal;
    setValue("values", newValues);
  },
  [handleChange, getValues, setValue]
);

  const memoHandlePriceChange = useCallback(
    (rowIdx, e) => {
      handlePriceChange(rowIdx, e);
      const newPrices = [...getValues("prices")];
      newPrices[rowIdx] = e.target.value;
      setValue("prices", newPrices);
    },
    [handlePriceChange, getValues, setValue]
  );
  const memoHandleRetailChange = useCallback(
    (rowIdx, e) => {
      handleRetailChange(rowIdx, e);
      const newRetails = [...getValues("retails")];
      newRetails[rowIdx] = e.target.value;
      setValue("retails", newRetails);
    },
    [handleRetailChange, getValues, setValue]
  );
  const memoHandlePiecesChange = useCallback(
    (colIdx, e) => {
      handlePiecesChange(colIdx, e);
      const newPieces = [...getValues("pieces")];
      newPieces[colIdx] = e.target.value;
      setValue("pieces", newPieces);
    },
    [handlePiecesChange, getValues, setValue]
  );
  const memoHandleKeyDown = useCallback(handleKeyDown, [values]);
  const memoHandlePriceKeyDown = useCallback(handlePriceKeyDown, [prices]);
  const memoHandleRetailKeyDown = useCallback(handleRetailKeyDown, [retails]);
  const memoHandlePiecesKeyDown = useCallback(handlePiecesKeyDown, [pieces]);
  const memoToBangla = useCallback(toBangla, []);
  const memoRowSum = useCallback(rowSum, [values]);

  // Memoize ingredient rows
  const ingredientRows = useMemo(
    () =>
      ingredients.map((ingredient, rowIdx) => (
        <MemoizedIngredientRow
          key={rowIdx}
          ingredient={ingredient}
          rowIdx={rowIdx}
          items={items}
          values={values}
          prices={prices}
          retails={retails}
          inputRefs={inputRefs}
          priceRefs={priceRefs}
          retailRefs={retailRefs}
          handleChange={memoHandleChange}
          handleKeyDown={memoHandleKeyDown}
          handlePriceChange={memoHandlePriceChange}
          handlePriceKeyDown={memoHandlePriceKeyDown}
          handleRetailChange={memoHandleRetailChange}
          handleRetailKeyDown={memoHandleRetailKeyDown}
          toBangla={memoToBangla}
          rowSum={memoRowSum}
          // Pass getPrice and defaultPrices
          getPrice={getPrice}
          defaultPrices={defaultPrices}
        />
      )),
    [
      ingredients,
      items,
      values,
      prices,
      retails,
      inputRefs,
      priceRefs,
      retailRefs,
      memoHandleChange,
      memoHandleKeyDown,
      memoHandlePriceChange,
      memoHandlePriceKeyDown,
      memoHandleRetailChange,
      memoHandleRetailKeyDown,
      memoToBangla,
      memoRowSum,
      // Add getPrice and defaultPrices to dependencies
      getPrice,
      defaultPrices,
    ]
  );

  if (
    !items.length ||
    !ingredients.length ||
    values.length !== ingredients.length ||
    prices.length !== ingredients.length ||
    values.some((row) => row.length !== items.length)
  ) {
    return null;
  }

  return (
    <form
      onSubmit={handleSubmit(handleSave)}
      className="p-2 pt-10 sm:p-4 overflow-auto min-h-screen"
      onKeyDown={(e) => {
        if (
          e.key === "Enter" &&
          e.target.tagName !== "TEXTAREA" &&
          e.target.type !== "submit" &&
          e.target.type !== "button"
        ) {
          e.preventDefault();
        }
      }}
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-2">
        <h2 className="text-center text-sm md:text-xl font-bold text-secondary">
          🧮 দৈনিক ইনগ্রেডিয়েন্ট ইউজ (কেজি)
        </h2>
        <div className="flex items-center justify-between">
          <DatePickerWithControls
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
            displayDate={displayDate}
            isDatePickerOpen={isDatePickerOpen}
            setIsDatePickerOpen={setIsDatePickerOpen}
          />
          <SaveButton loading={loading} />
        </div>
      </div>
      <div className="w-full overflow-x-auto">
        <table className="min-w-[600px] sm:min-w-full table-auto border-collapse w-full text-[10px] xs:text-xs sm:text-sm text-secondary">
          <thead className="bg-primary/10 text-left">
            <tr>
              <th
                className="border-[3px] px-2 py-2 text-nowrap  left-0 text-secondary font-bold sticky top-0 z-30"
                style={{
                  background: "var(--color-primary, #f3c7a6)",
                  transition: "background 0.2s",
                }}
              >
                ইনগ্রেডিয়েন্ট
              </th>
              {items.map((item, i) => (
                <th
                  key={i}
                  className="border-[3px] px-2 py-2 text-nowrap text-secondary font-bold min-w-[120px] max-w-[120px] w-[120px] sticky top-0 z-30 text-center"
                  style={{
                    background: "var(--color-primary, #f3c7a6)",
                    transition: "background 0.2s",
                  }}
                >
                  {item}
                </th>
              ))}
              <th
                className="border-[3px] px-1 py-2 text-nowrap text-secondary font-bold min-w-[60px] w-[60px] sticky top-0 z-30"
                style={{
                  background: "var(--color-primary, #f3c7a6)",
                  transition: "background 0.2s",
                }}
              >
                খুচরা (৳)
              </th>
              <th className="border-[3px] px-2 py-2 text-nowrap text-secondary font-bold sticky top-0 z-30">
                মোট (kg)
              </th>
              <th
                className="border-[3px] px-1 py-2 text-nowrap text-secondary font-bold min-w-[60px] w-[60px] sticky top-0 z-30"
                style={{
                  background: "var(--color-primary, #f3c7a6)",
                  transition: "background 0.2s",
                }}
              >
                দর (৳)
              </th>
              <th className="border-[3px] px-2 py-2 text-nowrap text-secondary font-bold sticky top-0 z-30">
                মোট দাম (৳)
              </th>
            </tr>
            {/* নতুন: পিস ইনপুটের জন্য একটি নতুন row */}
            <tr>
              <td
                className="border-[3px] px-2 py-2 font-bold text-nowrap sticky left-0 z-20 text-secondary"
                style={{
                  background: "var(--color-primary, #f3c7a6)",
                  transition: "background 0.2s",
                }}
              >
                <span>পিস</span>
              </td>
              {items.map((item, colIdx) => (
                <td key={colIdx} className="border-[3px] px-1 py-1 bg-primary/10">
                  <Controller
                    name={`pieces.${colIdx}`}
                    control={control}
                    render={({ field }) => (
                      <input
                        {...field}
                        type="text"
                        inputMode="numeric"
                        pattern="[০-৯]*"
                        min="0"
                        placeholder="পিস"
                        value={pieces[colIdx] ? toBangla(pieces[colIdx]) : ""}
                        onChange={(e) => {
                          field.onChange(e);
                          memoHandlePiecesChange(colIdx, e);
                        }}
                        onKeyDown={(e) => memoHandlePiecesKeyDown(colIdx, e)}
                        ref={piecesRefs.current[colIdx]}
                        className="min-w-0 w-full p-1 rounded text-[10px] xs:text-xs sm:text-sm text-center font-bold focus:outline-none focus:ring-0 focus:border-transparent overflow-x-auto text-ellipsis"
                        style={{ direction: "ltr" }}
                      />
                    )}
                  />
                </td>
              ))}
              {/* খালি ঘরগুলো */}
              <td className="border-[3px] px-1 py-1 bg-primary/10"></td>
              <td className="border-[3px] px-2 py-1 bg-primary/10"></td>
              <td className="border-[3px] px-1 py-1 bg-primary/10"></td>
              <td className="border-[3px] px-2 py-1 bg-primary/10"></td>
            </tr>
          </thead>
          <tbody>
            {ingredientRows}
            {/* মোট হিসাবের row (দর পর্যন্ত) */}
            <tr className="bg-primary/20 font-bold">
              <td
                className="border-[3px] px-2 py-2 text-secondary text-right font-bold"
                colSpan={items.length + 4}
              >
                মোট
              </td>
              <td className="border-[3px] px-2 py-2 text-right font-bold">
                {toBangla(totalAmount.toFixed(2))}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      {/* SaveButton is now inside the form, so it will submit the form */}
      {/* <SaveButton loading={loading} handleSave={handleSave} /> */}
    </form>
  );
};

export default React.memo(DailyCalculation);
