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

const ItemsTab = ({
  items,
  page,
  setPage,
  PAGE_SIZE,
  getTimestampFromObjectId,
  paginate,
  fetchData,
}) => {
  // Item CRUD
  const handleSaveItem = async (id, name, price) => {
    await fetch(`https://mahi-bakery.onrender.com/api/items/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, price }),
    });
    // No fetchData here
  };

  const handleDeleteItem = async id => {
    if (!window.confirm("Are you sure to delete this item?")) return;
    await fetch(`https://mahi-bakery.onrender.com/api/items/${id}`, { method: "DELETE" });
    fetchData();
  };

  const handlePrev = () => setPage(p => Math.max(0, p - 1));
  const handleNext = (total) =>
    setPage(p => (p + 1 < Math.ceil(total / PAGE_SIZE) ? p + 1 : p));

  if (!items.length) {
    return <div className="text-gray-400 text-center">No item found.</div>;
  }

  const oldSorted = sortOldFirst(items, getTimestampFromObjectId);
  const newSorted = sortNewFirst(items, getTimestampFromObjectId);

  const oldItems = paginate(oldSorted, page, Math.ceil(PAGE_SIZE / 2));
  const newItems = paginate(newSorted, page, Math.floor(PAGE_SIZE / 2));

  return (
    <>
      {oldItems.map(item => (
        <EditableCard
          key={item._id}
          item={item}
          onSave={handleSaveItem}
          onDelete={handleDeleteItem}
          type="item"
          onEditSave={() => fetchData(true)}
        />
      ))}
      {newItems.map(item => (
        <EditableCard
          key={item._id}
          item={item}
          onSave={handleSaveItem}
          onDelete={handleDeleteItem}
          type="item"
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
          onClick={() => handleNext(items.length)}
          disabled={(page + 1) * PAGE_SIZE >= items.length}
        >
          Next
        </button>
      </div>
    </>
  );
};

export default ItemsTab;
