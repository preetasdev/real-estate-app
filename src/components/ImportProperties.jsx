import * as XLSX from "xlsx";
import { useApp } from "../context/AppContext";

export default function ImportProperties() {
  const { addProperty } = useApp();

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
        addProperty({
          title: row.Title || "",
          location: row.Location || "",
          price: row.Price || "",
          type: row.Type || "Sale",
          variant: row.Variant || "2BHK",
          propertyType: row.PropertyType || "Apartment",

          possessionStatus: row.PossessionStatus || "Ready",
          possessionTime: row.PossessionTime || "",

          carpetArea: row.CarpetArea || "",
          balcony: row.Balcony || "0",
          parking: row.Parking || "No",
          propertyVia: row.PropertyVia || "Owner",

          facing: row.Facing || "East",
          floorNo: row.FloorNo || "",
          totalFloor: row.TotalFloor || "",
          furnishing: row.Furnishing || "Unfurnished",

          description: row.Description || "",
        });
      });

      alert("Properties imported successfully!");
    };

    reader.readAsArrayBuffer(file);
  };

  return (
    <label className="bg-green-600 text-white px-4 py-2 rounded cursor-pointer">
      Import Properties
      <input
        type="file"
        accept=".xlsx, .xls"
        onChange={handleFile}
        hidden
      />
    </label>
  );
}