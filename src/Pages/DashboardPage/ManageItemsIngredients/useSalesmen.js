import { useState } from "react";
import { toast } from "react-hot-toast";

const api = "https://mahi-bakery.onrender.com/api";

export default function useSalesmen() {
  const [salesmen, setSalesmen] = useState([]);

  const fetchSalesmen = async () => {
    try {
      const res = await fetch(`${api}/salesmen`);
      const data = await res.json();
      setSalesmen(data || []);
    } catch {
      toast.error("Failed to fetch salesmen");
    }
  };

  const handleSaveSalesman = async (id, name, phone) => {
    await fetch(`${api}/salesmen/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, phone }),
    });
    fetchSalesmen();
  };

  const handleDeleteSalesman = async id => {
    if (!window.confirm("Are you sure to delete this salesman?")) return;
    await fetch(`${api}/salesmen/${id}`, { method: "DELETE" });
    fetchSalesmen();
  };

  return {
    salesmen,
    fetchSalesmen,
    handleSaveSalesman,
    handleDeleteSalesman,
  };
}
