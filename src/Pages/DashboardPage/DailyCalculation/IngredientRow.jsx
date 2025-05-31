import React from "react";

const IngredientRow = ({
  ingredient,
  rowIdx,
  items,
  values,
  retails,
  inputRefs,
  priceRefs,
  retailRefs,
  handleChange,
  handleKeyDown,
  handlePriceChange,
  handlePriceKeyDown,
  handleRetailChange,
  handleRetailKeyDown,
  toBangla,
  rowSum,
  getPrice,
}) => {
  // Calculate total kg for this row
  const totalKg = parseFloat(rowSum(values[rowIdx]).toFixed(2));
  const toEnglishNumber = (str) => str.replace(/[০-৯]/g, (d) => "০১২৩৪৫৬৭৮৯".indexOf(d));
  const price = parseFloat(toEnglishNumber(getPrice(rowIdx)));


  

  return (
    <tr className="hover:bg-primary/10">
      <td
        className="border-[3px] px-2 py-2 font-bold text-nowrap sticky left-0 z-20 text-secondary"
        style={{
          background: "var(--color-primary, #f3c7a6)",
          transition: "background 0.2s",
        }}
      >
        {ingredient}
      </td>
      {items.map((_, colIdx) => (
        <td
          key={colIdx}
          className="border-[3px] px-1 py-1 relative min-w-[120px] max-w-[120px] w-[120px]"
        >
          <input
            type="text"
            inputMode="numeric"
            pattern="[০-৯.]*"
            min="0"
            step="0.01"
            placeholder={ingredient}
            value={values[rowIdx][colIdx] ? toBangla(values[rowIdx][colIdx]) : ""}
            onChange={(e) => handleChange(rowIdx, colIdx, e)}
            onKeyDown={(e) => handleKeyDown(rowIdx, colIdx, e)}
            ref={inputRefs.current[rowIdx][colIdx]}
            className="min-w-0 w-full p-1 rounded text-[10px] xs:text-xs sm:text-sm text-center font-bold focus:outline-none focus:ring-0 focus:border-transparent overflow-x-auto text-ellipsis"
            style={{ direction: "ltr" }}
          />
        </td>
      ))}
      <td className="border-[3px] px-1 py-1 min-w-[60px] w-[60px]">
        <input
          type="text"
          inputMode="numeric"
          pattern="[০-৯.]*"
          min="0"
          step="0.01"
          placeholder="৳"
          value={retails[rowIdx] ? toBangla(retails[rowIdx]) : ""}
          onChange={(e) => handleRetailChange(rowIdx, e)}
          onKeyDown={(e) => handleRetailKeyDown(rowIdx, e)}
          className="min-w-0 w-full p-1 rounded text-[10px] xs:text-xs sm:text-sm text-center font-bold focus:outline-none focus:ring-0 focus:border-transparent overflow-x-auto text-ellipsis"
          style={{ direction: "ltr" }}
          ref={retailRefs.current[rowIdx]}
        />
      </td>
      <td className="border-[3px] px-2 py-2 text-right font-bold">
        {toBangla(rowSum(values[rowIdx]).toFixed(2))}
      </td>
      <td className="border-[3px] px-1 py-1 min-w-[60px] w-[60px]">
        <input
          type="text"
          inputMode="numeric"
          pattern="[০-৯.]*"
          min="0"
          step="0.01"
          placeholder="৳"
          value={toBangla(getPrice(rowIdx))}
          onChange={(e) => handlePriceChange(rowIdx, e)}
          onKeyDown={(e) => handlePriceKeyDown(rowIdx, e)}
          className="min-w-0 w-full p-1 rounded text-[10px] xs:text-xs sm:text-sm text-center font-bold focus:outline-none focus:ring-0 focus:border-transparent overflow-x-auto text-ellipsis"
          style={{ direction: "ltr" }}
          ref={priceRefs.current[rowIdx]}
          readOnly
        />
        {/* Log value visually beside input (for debug, remove in production) */}
        <span style={{ fontSize: 10, color: "#888", marginLeft: 4 }}>
          {/* মোট কেজি: {totalKg} */}
        </span>
      </td>
      <td className="border-[3px] px-2 py-2 text-right font-bold">
        {
          // মোট (kg) × দর (৳) + খুচরা (৳)
          toBangla(
            (
              totalKg * price +
              (parseFloat(retails[rowIdx]) || 0)
            ).toFixed(2)
          )
        }
      </td>
    </tr>
  );
};

export default IngredientRow;
