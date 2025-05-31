import React, { useState } from "react";

const EditableCard = ({ item, onSave, onDelete, type, onEditSave }) => {
  const [edit, setEdit] = useState(false);
  const [price, setPrice] = useState(item.price || "");
  const [saving, setSaving] = useState(false);

  // Handle Enter key for save
  const handleKeyDown = async (e) => {
    if (e.key === "Enter") {
      await handleSave();
    }
  };

  const handleSave = async () => {
    setSaving(true);
    await onSave(item._id, item.name, price);
    setEdit(false);
    setSaving(false);
    if (onEditSave) onEditSave();
  };

  return (
    <div className="bg-white border border-accent/30 rounded-lg shadow p-4 flex items-center justify-between gap-2 mb-3">
      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
        <span className="text-2xl">{type === "item" ? "🍞" : "🥣"}</span>
        <div>
          <span className="font-semibold text-secondary">{item.name}</span>
          <div className="text-sm text-gray-500">
            {edit ? (
              <input
                type="text"
                value={price}
                onChange={e => setPrice(e.target.value)}
                className="border border-accent/40 rounded px-2 py-1 text-secondary w-24 mt-1"
                placeholder="দাম (৳)"
                autoFocus
                onKeyDown={handleKeyDown}
                disabled={saving}
              />
            ) : (
              <span>
                দাম:{" "}
                <span className="font-bold">
                  {item.price ? item.price : "—"}
                </span>{" "}
                ৳
              </span>
            )}
          </div>
        </div>
      </div>
      <div className="flex gap-2">
        {edit ? (
          <>
            <button
              className="bg-green-500 text-white px-3 py-1 rounded"
              onClick={handleSave}
              disabled={saving}
            >
              Save
            </button>
            <button
              className="bg-gray-400 text-white px-3 py-1 rounded"
              onClick={() => {
                setEdit(false);
                setPrice(item.price || "");
              }}
              disabled={saving}
            >
              Cancel
            </button>
          </>
        ) : (
          <>
            <button
              className="bg-primary text-white px-3 py-1 rounded"
              onClick={() => setEdit(true)}
            >
              Edit
            </button>
            <button
              className="bg-white text-accent px-3 py-1 rounded border border-accent transition
                hover:bg-accent hover:text-white"
              onClick={() => onDelete(item._id)}
            >
              Delete
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default EditableCard;
