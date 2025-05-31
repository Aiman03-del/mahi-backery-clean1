import React, { useEffect, useState } from "react";
import EditableCard from "./EditableCard";
import EditableSalesmanCard from "./EditableSalesmanCard";
import { getTimestampFromObjectId, paginate } from "./helpers";
import useSalesmen from "./useSalesmen";

const api = "https://mahi-bakery.onrender.com/api";
const PAGE_SIZE = 6;

const ManageItemsIngredients = () => {
  const [items, setItems] = useState([]);
  const [ingredients, setIngredients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("items");
  const [page, setPage] = useState(0);

  // Custom hook for salesmen
  const {
    salesmen,
    fetchSalesmen,
    handleSaveSalesman,
    handleDeleteSalesman,
  } = useSalesmen();

  // Update fetchData to also fetch salesmen
  const fetchData = async (keepPage = false) => {
    setLoading(true);
    const res = await fetch(`${api}/manage`);
    const data = await res.json();
    setItems(data.items || []);
    setIngredients(data.ingredients || []);
    await fetchSalesmen();
    setLoading(false);
    if (!keepPage) setPage(0);
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line
  }, []);

  // Sort: পুরাতন (createdAt/objectId timestamp ছোট) উপরে, নতুন নিচে
  const sortOldFirst = arr =>
    [...arr].sort(
      (a, b) =>
        (a.createdAt
          ? new Date(a.createdAt).getTime()
          : getTimestampFromObjectId(a._id)) -
        (b.createdAt
          ? new Date(b.createdAt).getTime()
          : getTimestampFromObjectId(b._id))
    );
  const sortNewFirst = arr =>
    [...arr].sort(
      (a, b) =>
        (b.createdAt
          ? new Date(b.createdAt).getTime()
          : getTimestampFromObjectId(b._id)) -
        (a.createdAt
          ? new Date(a.createdAt).getTime()
          : getTimestampFromObjectId(a._id))
    );

  // Pagination helpers
  const handlePrev = () => setPage(p => Math.max(0, p - 1));
  const handleNext = (total) =>
    setPage(p => (p + 1 < Math.ceil(total / PAGE_SIZE) ? p + 1 : p));

  // Render section
  const renderSection = (data, type) => {
    if (!data.length) {
      return <div className="text-gray-400 text-center">No {type} found.</div>;
    }
    // পুরাতন ৩টা, নতুন ৩টা (pagination)
    const oldSorted = sortOldFirst(data);
    const newSorted = sortNewFirst(data);

    const oldItems = paginate(oldSorted, page, Math.ceil(PAGE_SIZE / 2));
    const newItems = paginate(newSorted, page, Math.floor(PAGE_SIZE / 2));

    return (
      <>
        {/* পুরাতন গুলো */}
        {oldItems.map(item => (
          <EditableCard
            key={item._id}
            item={item}
            onSave={type === "item" ? handleSaveItem : handleSaveIngredient}
            onDelete={type === "item" ? handleDeleteItem : handleDeleteIngredient}
            type={type}
            onEditSave={() => fetchData(true)}
          />
        ))}
        {/* নতুন গুলো */}
        {newItems.map(item => (
          <EditableCard
            key={item._id}
            item={item}
            onSave={type === "item" ? handleSaveItem : handleSaveIngredient}
            onDelete={type === "item" ? handleDeleteItem : handleDeleteIngredient}
            type={type}
            onEditSave={() => fetchData(true)}
          />
        ))}
        {/* Pagination */}
        <div className="flex justify-center gap-4 mt-4">
          <button
            className="px-3 py-1 rounded bg-gray-200 text-secondary font-semibold disabled:opacity-50"
            onClick={handlePrev}
            disabled={page === 0}
          >
            Prev
          </button>
          <button
            className="px-3 py-1 rounded bg-gray-200 text-secondary font-semibold disabled:opacity-50"
            onClick={() => handleNext(data.length)}
            disabled={(page + 1) * PAGE_SIZE >= data.length}
          >
            Next
          </button>
        </div>
      </>
    );
  };

  const handleSaveItem = async (id, name, price) => {
    await fetch(`${api}/items/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, price }),
    });
    // No fetchData here
  };

  const handleDeleteItem = async id => {
    if (!window.confirm("Are you sure to delete this item?")) return;
    await fetch(`${api}/items/${id}`, { method: "DELETE" });
    fetchData();
  };

  const handleSaveIngredient = async (id, name, price) => {
    await fetch(`${api}/ingredients/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, price }),
    });
    // No fetchData here
  };

  const handleDeleteIngredient = async id => {
    if (!window.confirm("Are you sure to delete this ingredient?")) return;
    await fetch(`${api}/ingredients/${id}`, { method: "DELETE" });
    fetchData();
  };

  // Reset pagination when tab changes
  useEffect(() => {
    setPage(0);
  }, [activeTab]);

  return (
    <div className="p-4 ">
      <h1 className="text-2xl font-bold text-center mb-6 text-accent">
        Manage Food Items, Ingredients & Salesmen
      </h1>
      <div className="flex  justify-center mb-6 gap-2">
        <button
          className={`px-4 py-2 rounded-t-lg font-semibold ${
            activeTab === "items"
              ? "bg-accent text-white"
              : "bg-gray-200 text-secondary"
          }`}
          onClick={() => setActiveTab("items")}
        >
          Items
        </button>
        <button
          className={`px-4 py-2 rounded-t-lg font-semibold ${
            activeTab === "ingredients"
              ? "bg-accent text-white"
              : "bg-gray-200 text-secondary"
          }`}
          onClick={() => setActiveTab("ingredients")}
        >
          Ingredients
        </button>
        <button
          className={`px-4 py-2 rounded-t-lg font-semibold ${
            activeTab === "salesmen"
              ? "bg-accent text-white"
              : "bg-gray-200 text-secondary"
          }`}
          onClick={() => setActiveTab("salesmen")}
        >
          Salesmen
        </button>
      </div>
      {loading ? (
        <div className="text-center">Loading...</div>
      ) : (
        <>
          {activeTab === "items" && (
            <div>
              <h2 className="text-lg font-semibold mb-4">Food Items</h2>
              {renderSection(items, "item")}
            </div>
          )}
          {activeTab === "ingredients" && (
            <div>
              <h2 className="text-lg font-semibold mb-4">Ingredients</h2>
              {renderSection(ingredients, "ingredient")}
            </div>
          )}
          {activeTab === "salesmen" && (
            <div>
              <h2 className="text-lg font-semibold mb-4">Salesmen</h2>
              {salesmen.length === 0 ? (
                <div className="text-gray-400 text-center">No salesmen found.</div>
              ) : (
                salesmen.map(salesman => (
                  <EditableSalesmanCard
                    key={salesman._id}
                    salesman={salesman}
                    onSave={handleSaveSalesman}
                    onDelete={handleDeleteSalesman}
                    onEditSave={fetchSalesmen}
                  />
                ))
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ManageItemsIngredients;
