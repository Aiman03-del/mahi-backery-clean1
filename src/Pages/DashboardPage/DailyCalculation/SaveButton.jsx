import React from "react";

const SaveButton = ({ loading, handleSave }) => (
  <button
    onClick={handleSave}
    disabled={loading}
    className="ml-2 px-4 py-1.5 rounded bg-accent text-white font-bold shadow hover:bg-accent/90 disabled:opacity-60"
  >
    {loading ? "সেভ হচ্ছে..." : "সেভ"}
  </button>
);

export default SaveButton;
