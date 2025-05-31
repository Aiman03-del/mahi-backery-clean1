import EditableCard from "./EditableCard";

// sortOldFirst, sortNewFirst utility functions
const sortOldFirst = (arr, getTimestampFromObjectId) =>
  [...arr].sort(
    (a, b) =>
      (a.createdAt
        ? new Date(a.createdAt).getTime()
        : getTimestampFromObjectId(a._id)) -
      (b.createdAt
        ? new Date(b.createdAt).getTime()
        : getTimestampFromObjectId(b._id))
  );
const sortNewFirst = (arr, getTimestampFromObjectId) =>
  [...arr].sort(
    (a, b) =>
      (b.createdAt
        ? new Date(b.createdAt).getTime()
        : getTimestampFromObjectId(b._id)) -
      (a.createdAt
        ? new Date(a.createdAt).getTime()
        : getTimestampFromObjectId(a._id))
  );

const IngredientsTab = ({
  ingredients,
  page,
  setPage,
  PAGE_SIZE,
  getTimestampFromObjectId,
  paginate,
  fetchData,
}) => {
  // Ingredient CRUD
  const handleSaveIngredient = async (id, name, price) => {
    await fetch(`https://mahi-bakery.onrender.com/api/ingredients/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, price }),
    });
    // No fetchData here
  };

  const handleDeleteIngredient = async id => {
    if (!window.confirm("Are you sure to delete this ingredient?")) return;
    await fetch(`https://mahi-bakery.onrender.com/api/ingredients/${id}`, { method: "DELETE" });
    fetchData();
  };

  const handlePrev = () => setPage(p => Math.max(0, p - 1));
  const handleNext = (total) =>
    setPage(p => (p + 1 < Math.ceil(total / PAGE_SIZE) ? p + 1 : p));

  if (!ingredients.length) {
    return <div className="text-gray-400 text-center">No ingredient found.</div>;
  }

  const oldSorted = sortOldFirst(ingredients, getTimestampFromObjectId);
  const newSorted = sortNewFirst(ingredients, getTimestampFromObjectId);

  const oldItems = paginate(oldSorted, page, Math.ceil(PAGE_SIZE / 2));
  const newItems = paginate(newSorted, page, Math.floor(PAGE_SIZE / 2));

  return (
    <>
      {oldItems.map(item => (
        <EditableCard
          key={item._id}
          item={item}
          onSave={handleSaveIngredient}
          onDelete={handleDeleteIngredient}
          type="ingredient"
          onEditSave={() => fetchData(true)}
        />
      ))}
      {newItems.map(item => (
        <EditableCard
          key={item._id}
          item={item}
          onSave={handleSaveIngredient}
          onDelete={handleDeleteIngredient}
          type="ingredient"
          onEditSave={() => fetchData(true)}
        />
      ))}
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
          onClick={() => handleNext(ingredients.length)}
          disabled={(page + 1) * PAGE_SIZE >= ingredients.length}
        >
          Next
        </button>
      </div>
    </>
  );
};

export default IngredientsTab;
