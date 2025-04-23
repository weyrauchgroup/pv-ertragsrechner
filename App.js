import React, { useState } from "react";

export default function App() {
  const [inputs, setInputs] = useState({
    roof1_kwp: 5,
    roof1_orientation: "Süd",
    roof1_tilt: 30,
    roof2_kwp: 3,
    roof2_orientation: "Ost/West",
    roof2_tilt: 25,
    region: "Mitteldeutschland",
    selfUsePercent: 30,
    dayNightSplit: 70,
    electricityPrice: 0.35,
    feedInTariff: 0.08,
    storageCapacity: 5,
    systemCost: 12000,
    storageCost: 6000,
  });

  const [errors, setErrors] = useState({});

  const regions = {
    Norddeutschland: 900,
    Mitteldeutschland: 1000,
    Süddeutschland: 1100,
  };

  const orientationFactor = {
    Süd: 1.0,
    "Ost/West": 0.9,
    Nord: 0.7,
  };

  const tiltFactor = (tilt) => {
    if (tilt < 10 || tilt > 60) return 0.9;
    if (tilt >= 20 && tilt <= 40) return 1.0;
    return 0.95;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const numeric = !name.includes("orientation") && name !== "region";

    let newValue = value;
    let newErrors = { ...errors };

    if (value === "") {
      newValue = "";
      newErrors[name] = "Eingabe erforderlich";
    } else if (numeric && isNaN(value)) {
      newErrors[name] = "Nur Zahlen erlaubt";
    } else {
      newValue = numeric ? parseFloat(value) : value;
      delete newErrors[name];
    }

    setInputs((prev) => ({ ...prev, [name]: newValue }));
    setErrors(newErrors);
  };

  const calcYield = (kwp, orientation, tilt) => {
    const base = regions[inputs.region];
    return kwp * base * orientationFactor[orientation] * tiltFactor(tilt);
  };

  const yield1 = calcYield(inputs.roof1_kwp, inputs.roof1_orientation, inputs.roof1_tilt);
  const yield2 = calcYield(inputs.roof2_kwp, inputs.roof2_orientation, inputs.roof2_tilt);
  const totalYield = yield1 + yield2;

  const storageEffect = Math.min(inputs.storageCapacity / 10, 1);
  const selfUseRate = Math.min(inputs.selfUsePercent + storageEffect * 30, 100);
  const selfUsed = (totalYield * selfUseRate) / 100;
  const fedIn = totalYield - selfUsed;
  const saving = selfUsed * inputs.electricityPrice;
  const feedInRevenue = fedIn * inputs.feedInTariff;
  const totalRevenue = saving + feedInRevenue;
  const totalCost = inputs.systemCost + inputs.storageCost;
  const payback = totalRevenue > 0 ? totalCost / totalRevenue : Infinity;

  const renderInput = (key, label, isSelect = false, options = []) => (
    <div key={key} style={{ marginBottom: "1rem" }}>
      <label style={{ display: "block", fontWeight: "bold", color: "#0055aa" }}>{label}</label>
      {isSelect ? (
        <select
          name={key}
          value={inputs[key]}
          onChange={handleChange}
          style={{ padding: "0.4rem", width: "100%", border: "1px solid #007bff" }}
        >
          {options.map((opt) => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
      ) : (
        <input
          name={key}
          value={inputs[key]}
          onChange={handleChange}
          style={{ padding: "0.4rem", width: "100%", border: errors[key] ? "1px solid red" : "1px solid #007bff" }}
        />
      )}
      {errors[key] && <span style={{ color: "red", fontSize: "0.9rem" }}>{errors[key]}</span>}
    </div>
  );

  return (
    <div style={{ fontFamily: "sans-serif", padding: "2rem" }}>
      <h1>PV-Ertragsrechner</h1>
      {renderInput("roof1_kwp", "Dachfläche 1 (kWp)")}
      {renderInput("roof1_orientation", "Ausrichtung Dach 1", true, Object.keys(orientationFactor))}
      {renderInput("roof1_tilt", "Neigung Dach 1 (°)")}

      {renderInput("roof2_kwp", "Dachfläche 2 (kWp)")}
      {renderInput("roof2_orientation", "Ausrichtung Dach 2", true, Object.keys(orientationFactor))}
      {renderInput("roof2_tilt", "Neigung Dach 2 (°)")}

      {renderInput("region", "Standort", true, Object.keys(regions))}
      {renderInput("selfUsePercent", "Basis-Eigenverbrauch (%)")}
      {renderInput("dayNightSplit", "Tag/Nacht-Verteilung (%)")}
      {renderInput("electricityPrice", "Strompreis (€/kWh)")}
      {renderInput("feedInTariff", "Einspeisevergütung (€/kWh)")}
      {renderInput("storageCapacity", "Speicherkapazität (kWh)")}
      {renderInput("systemCost", "Anlagenpreis (€)")}
      {renderInput("storageCost", "Speicherpreis (€)")}

      <div style={{ background: "#e6ffe6", padding: "1rem", borderRadius: "8px" }}>
        <h2>Ergebnisse</h2>
        <p>Jahresertrag Dachfläche 1: {yield1.toFixed(0)} kWh</p>
        <p>Jahresertrag Dachfläche 2: {yield2.toFixed(0)} kWh</p>
        <p>Gesamtertrag: {totalYield.toFixed(0)} kWh</p>
        <p>Eigenverbrauchsanteil: {selfUseRate.toFixed(1)} %</p>
        <p>Selbst genutzte Energie: {selfUsed.toFixed(0)} kWh</p>
        <p>Eingespeiste Energie: {fedIn.toFixed(0)} kWh</p>
        <p>Stromkostenersparnis: {saving.toFixed(2)} €</p>
        <p>Einspeisevergütung: {feedInRevenue.toFixed(2)} €</p>
        <p>Gesamtertrag: {totalRevenue.toFixed(2)} €</p>
        <p>Amortisationszeit: {payback.toFixed(1)} Jahre</p>
      </div>
    </div>
  );
}
