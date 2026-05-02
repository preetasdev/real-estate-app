import * as XLSX from "xlsx";
import { useApp } from "../context/AppContext";

export default function ImportClients() {
  const { addClient } = useApp();

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = (evt) => {
      const data = new Uint8Array(evt.target.result);
      const workbook = XLSX.read(data, { type: "array" });

      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const json = XLSX.utils.sheet_to_json(sheet);

      json.forEach((row) => {
        addClient({
          name: row.Name || "",
          phone: row.Phone || "",
          budget: row.Budget || "",
          requirement: row.Requirement || "",
          locationPreference: row.LocationPreference || "",
          profileType: row.ProfileType || "Family",
          propertyStatus: row.PropertyStatus || "Ready",
          moveInTimeline: row.MoveInTimeline || "Immediate",
          notes: row.Notes || "",
        });
      });

      alert("Clients imported successfully!");
    };

    reader.readAsArrayBuffer(file);
  };

  return (
    <label className="bg-green-600 text-white px-4 py-2 rounded cursor-pointer">
      Import Clients
      <input
        type="file"
        accept=".xlsx, .xls"
        onChange={handleFile}
        hidden
      />
    </label>
  );
}