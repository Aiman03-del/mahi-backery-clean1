import EditableSalesmanCard from "./EditableSalesmanCard";

const SalesmenTab = ({
  salesmen,
  fetchSalesmen,
  handleSaveSalesman,
  handleDeleteSalesman,
}) => (
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
);

export default SalesmenTab;
