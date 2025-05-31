import React, { useState } from "react";

const EditableSalesmanCard = ({ salesman, onSave, onDelete, onEditSave }) => {
  const [edit, setEdit] = useState(false);
  const [name, setName] = useState(salesman.name || "");
  const [phone, setPhone] = useState(salesman.phone || "");
  const [saving, setSaving] = useState(false);

  const handleKeyDown = async (e) => {
    if (e.key === "Enter") {
      await handleSave();
    }
  };

  const handleSave = async () => {
    setSaving(true);
    await onSave(salesman._id, name, phone);
    setEdit(false);
    setSaving(false);
    if (onEditSave) onEditSave();
  };

  return (
    <div className="bg-white border border-accent/30 rounded-lg shadow p-4 flex items-center justify-between gap-2 mb-3">
      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
        <span className="text-2xl">👤</span>
        <div>
          {edit ? (
            <>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                className="border border-accent/40 rounded px-2 py-1 text-secondary w-32 mt-1 mr-2"
                placeholder="নাম"
                autoFocus
                onKeyDown={handleKeyDown}
                disabled={saving}
              />
              <input
                type="text"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                className="border border-accent/40 rounded px-2 py-1 text-secondary w-32 mt-1"
                placeholder="ফোন"
                onKeyDown={handleKeyDown}
                disabled={saving}
              />
            </>
          ) : (
            <>
              <span className="font-semibold text-secondary">{salesman.name}</span>
              <div className="text-sm text-gray-500">{salesman.phone || ""}</div>
            </>
          )}
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
                setName(salesman.name || "");
                setPhone(salesman.phone || "");
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
              className="bg-white text-accent px-3 py-1 rounded border border-accent transition hover:bg-accent hover:text-white"
              onClick={() => onDelete(salesman._id)}
            >
              Delete
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default EditableSalesmanCard;
