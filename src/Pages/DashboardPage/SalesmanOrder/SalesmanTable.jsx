import React from "react";
import InputCell from "./InputCell";
import { toBangla } from "./helpers";

const SalesmanTable = ({
  items,
  salesmen,
  cellValues,
  handleCellChange,
  handleCellBlur,
  ghorerMal,
  handleGhorerMalChange,
  inputRefs,
  handleKeyDown,
  getTotalPieces,
  totalGhorerMal,
  totalMotPcs,
}) => (
  <div className="overflow-x-auto">
    <table className="min-w-[600px] w-full border-collapse mb-4 text-xs xs:text-sm sm:text-base md:text-lg rounded-xl shadow">
      <thead>
        <tr className="bg-primary/10">
          <th className="border-[3px] px-2 py-2 text-secondary font-extrabold text-left min-w-[120px] max-w-[180px] w-[150px] sticky left-0 z-10 ">
            Item
          </th>
          {salesmen.map(s => (
            <th
              key={s._id}
              className="border-[3px] px-2 py-2 text-secondary font-extrabold text-center min-w-[90px] max-w-[120px] w-[100px]"
            >
              {s.name}
            </th>
          ))}
          <th className="border-[3px] px-2 py-2 text-secondary font-extrabold text-center min-w-[90px] max-w-[120px] w-[100px]">
            ঘরের মাল
          </th>
          <th className="border-[3px] px-2 py-2 text-secondary font-extrabold text-center min-w-[90px] max-w-[120px] w-[100px]">
            মোট পিস
          </th>
        </tr>
      </thead>
      <tbody>
        {items.map((item, rowIdx) => (
          <tr key={item._id} className="hover:bg-primary/5 transition">
            <td className="border-[2px] px-2 py-2 text-secondary font-bold min-w-[120px] max-w-[180px] w-[150px] sticky left-0 z-10 ">
              {item.name}
            </td>
            {salesmen.map((s, colIdx) => (
              <td
                key={s._id}
                className="border-[3px] border-secondary px-2 py-2 text-center min-w-[90px] max-w-[120px] w-[100px]"
              >
                <InputCell
                  value={cellValues[`${s._id}_${item._id}`]}
                  onChange={e => handleCellChange(s._id, item._id, e.target.value)}
                  onBlur={e => handleCellBlur(s._id, item._id, e.target.value)}
                  inputRef={el => (inputRefs.current[`${rowIdx}_${colIdx}_salesman`] = el)}
                  onKeyDown={e => handleKeyDown(e, rowIdx, colIdx, "salesman")}
                  placeholder="পিস"
                />
              </td>
            ))}
            <td className="border-[3px] border-secondary px-2 py-2 text-center min-w-[90px] max-w-[120px] w-[100px]">
              <InputCell
                value={ghorerMal[item._id]}
                onChange={e => handleGhorerMalChange(item._id, e.target.value)}
                inputRef={el => (inputRefs.current[`${rowIdx}_ghorerMal`] = el)}
                onKeyDown={e => handleKeyDown(e, rowIdx, salesmen.length)}
                placeholder="ঘরের মাল"
              />
            </td>
            <td className="border-[3px] border-secondary text-secondary px-2 py-2 text-center min-w-[90px] max-w-[120px] w-[100px] font-bold bg-primary/10">
              {toBangla(getTotalPieces(item._id))}
            </td>
          </tr>
        ))}
        <tr className="bg-primary/10 font-bold">
          <td
            className="border-[3px] border-secondary px-2 py-2 text-secondary text-right"
            colSpan={1 + salesmen.length}
          >
            মোট
          </td>
          <td className="border-[3px] border-secondary px-2 py-2 text-center text-secondary font-bold">
            {toBangla(totalGhorerMal)}
          </td>
          <td className="border-[3px] border-secondary px-2 py-2 text-center text-secondary font-bold">
            {toBangla(totalMotPcs)}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
);

export default SalesmanTable;
