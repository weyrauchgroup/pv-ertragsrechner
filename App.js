import React, { useState } from "react";

export default function App() {
  const [inputs, setInputs] = useState({
    roof1_kwp: "5,0",
    roof1_orientation: "Süd",
    roof1_tilt: 30,
    roof2_kwp: "3,0",
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

  // ... restlicher Code bleibt unverändert wie oben
