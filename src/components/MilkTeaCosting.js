import React, { useState, useEffect } from "react";
import "./MilkTeaCosting.css";

export default function MilkTeaCosting() {
  const defaultIngredients = [
    { name: "Chatramue Thai Tea Mix", packSize: 200, unit: "g", packPrice: 150, qtyPerCup: 20 },
    { name: "Sugar", packSize: 1000, unit: "g", packPrice: 60, qtyPerCup: 20 },
    { name: "Milk", packSize: 1000, unit: "ml", packPrice: 80, qtyPerCup: 50 },
    { name: "Condensed Milk", packSize: 395, unit: "g", packPrice: 55, qtyPerCup: 30 },
    { name: "Oatside Almond Milk", packSize: 1000, unit: "ml", packPrice: 200, qtyPerCup: 50 }
  ];

  const [ingredients, setIngredients] = useState(() => {
    const saved = localStorage.getItem("ingredients");
    let loaded = saved ? JSON.parse(saved) : [];

    // Merge missing default ingredients
    defaultIngredients.forEach(def => {
      if (!loaded.some(item => item.name === def.name)) {
        loaded.push(def);
      }
    });

    localStorage.setItem("ingredients", JSON.stringify(loaded));
    return loaded;
  });

  const [newIngredient, setNewIngredient] = useState({
    name: "",
    packSize: "",
    unit: "g",
    packPrice: "",
    qtyPerCup: ""
  });

  const [sellingPrice, setSellingPrice] = useState("");
  const [cupsSold, setCupsSold] = useState("");

  // Save ingredients to localStorage on change
  useEffect(() => {
    localStorage.setItem("ingredients", JSON.stringify(ingredients));
  }, [ingredients]);

  const handleChange = (e, index) => {
    const { name, value } = e.target;
    const updated = [...ingredients];
    updated[index][name] = value;
    setIngredients(updated);
  };

  const handleDelete = (index) => {
    const password = prompt("⚠️ Enter password to confirm delete:");
    if (password === "CONFIRM") {
      const updated = ingredients.filter((_, i) => i !== index);
      setIngredients(updated);
    } else if (password !== null) {
      alert("❌ Wrong password. Deletion cancelled.");
    }
  };

  const handleAdd = () => {
    if (!newIngredient.name || !newIngredient.packSize || !newIngredient.packPrice || !newIngredient.qtyPerCup) return;
    setIngredients([...ingredients, newIngredient]);
    setNewIngredient({ name: "", packSize: "", unit: "g", packPrice: "", qtyPerCup: "" });
  };

  const calculateCostPerCup = (item) => {
    if (!item.packSize || !item.packPrice || !item.qtyPerCup) return 0;
    let basePackSize = parseFloat(item.packSize);
    switch (item.unit) {
      case "kg":
        basePackSize *= 1000;
        break;
      case "l":
        basePackSize *= 1000;
        break;
      default:
        break;
    }
    const costPerUnit = item.packPrice / basePackSize;
    return costPerUnit * parseFloat(item.qtyPerCup);
  };

  const totalCostPerCup = ingredients.reduce((sum, item) => sum + calculateCostPerCup(item), 0);
  const profitPerCup = sellingPrice ? sellingPrice - totalCostPerCup : 0;
  const profitMargin = sellingPrice ? ((profitPerCup / sellingPrice) * 100).toFixed(2) : 0;

  const projectedRevenue = sellingPrice && cupsSold ? sellingPrice * parseFloat(cupsSold) : 0;
  const projectedCost = cupsSold ? totalCostPerCup * parseFloat(cupsSold) : 0;
  const projectedProfit = projectedRevenue - projectedCost;

  return (
    <div className="container">
      <h1>Milk Tea Costing Sheet</h1>
      <table>
        <thead>
          <tr>
            <th>Ingredient</th>
            <th>Pack Size + Unit</th>
            <th>Pack Price (₱)</th>
            <th>Qty per Cup</th>
            <th>Cost per Cup (₱)</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {ingredients.map((item, index) => (
            <tr key={index}>
              <td>
                <input type="text" name="name" value={item.name} onChange={(e) => handleChange(e, index)} />
              </td>
              <td>
                <div className="unit-input">
                  <input type="number" name="packSize" value={item.packSize} onChange={(e) => handleChange(e, index)} />
                  <select name="unit" value={item.unit} onChange={(e) => handleChange(e, index)}>
                    <option value="g">g</option>
                    <option value="kg">kg</option>
                    <option value="ml">ml</option>
                    <option value="l">L</option>
                    <option value="pcs">pcs</option>
                  </select>
                </div>
              </td>
              <td>
                <input type="number" name="packPrice" value={item.packPrice} onChange={(e) => handleChange(e, index)} />
              </td>
              <td>
                <input type="number" name="qtyPerCup" value={item.qtyPerCup} onChange={(e) => handleChange(e, index)} />
              </td>
              <td>₱{calculateCostPerCup(item).toFixed(2)}</td>
              <td>
                <button className="delete-btn" onClick={() => handleDelete(index)}>Delete</button>
              </td>
            </tr>
          ))}
          <tr>
            <td>
              <input
                type="text"
                placeholder="Ingredient"
                value={newIngredient.name}
                onChange={(e) => setNewIngredient({ ...newIngredient, name: e.target.value })}
              />
            </td>
            <td>
              <div className="unit-input">
                <input
                  type="number"
                  placeholder="Size"
                  value={newIngredient.packSize}
                  onChange={(e) => setNewIngredient({ ...newIngredient, packSize: e.target.value })}
                />
                <select
                  value={newIngredient.unit}
                  onChange={(e) => setNewIngredient({ ...newIngredient, unit: e.target.value })}
                >
                  <option value="g">g</option>
                  <option value="kg">kg</option>
                  <option value="ml">ml</option>
                  <option value="l">L</option>
                  <option value="pcs">pcs</option>
                </select>
              </div>
            </td>
            <td>
              <input
                type="number"
                placeholder="Price"
                value={newIngredient.packPrice}
                onChange={(e) => setNewIngredient({ ...newIngredient, packPrice: e.target.value })}
              />
            </td>
            <td>
              <input
                type="number"
                placeholder="Qty"
                value={newIngredient.qtyPerCup}
                onChange={(e) => setNewIngredient({ ...newIngredient, qtyPerCup: e.target.value })}
              />
            </td>
            <td>-</td>
            <td>
              <button className="add-btn" onClick={handleAdd}>Add</button>
            </td>
          </tr>
        </tbody>
      </table>

      <div className="summary">
        <p><strong>Total Cost per Cup:</strong> ₱{totalCostPerCup.toFixed(2)}</p>

        <div className="selling-input">
          <label>Set Selling Price (₱): </label>
          <input
            type="number"
            value={sellingPrice}
            onChange={(e) => setSellingPrice(parseFloat(e.target.value) || "")}
          />
        </div>

        {sellingPrice && (
          <>
            <p><strong>Profit per Cup:</strong> ₱{profitPerCup.toFixed(2)}</p>
            <p><strong>Profit Margin:</strong> {profitMargin}%</p>
          </>
        )}

        <div className="selling-input">
          <label>Number of Cups Sold: </label>
          <input
            type="number"
            value={cupsSold}
            onChange={(e) => setCupsSold(e.target.value)}
            placeholder="0"
          />
        </div>

        {cupsSold && sellingPrice && (
          <div className="projected-earnings">
            <p><strong>Total Revenue:</strong> ₱{projectedRevenue.toFixed(2)}</p>
            <p><strong>Total Cost:</strong> ₱{projectedCost.toFixed(2)}</p>
            <p><strong>Total Profit:</strong> ₱{projectedProfit.toFixed(2)}</p>
          </div>
        )}
      </div>
    </div>
  );
}
