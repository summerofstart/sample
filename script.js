// ユニット変換のデータと関数

// 単位カテゴリーごとの基本データ
const unitCategories = {
  length: [
    { id: "m", label: "Meters", toBase: 1 },
    { id: "km", label: "Kilometers", toBase: 1000 },
    { id: "cm", label: "Centimeters", toBase: 0.01 },
    { id: "mm", label: "Millimeters", toBase: 0.001 },
    { id: "ft", label: "Feet", toBase: 0.3048 },
    { id: "in", label: "Inches", toBase: 0.0254 },
    { id: "yd", label: "Yards", toBase: 0.9144 },
    { id: "mi", label: "Miles", toBase: 1609.34 }
  ],
  weight: [
    { id: "kg", label: "Kilograms", toBase: 1 },
    { id: "g", label: "Grams", toBase: 0.001 },
    { id: "mg", label: "Milligrams", toBase: 0.000001 },
    { id: "lb", label: "Pounds", toBase: 0.453592 },
    { id: "oz", label: "Ounces", toBase: 0.0283495 }
  ]
};

// 単位変換関数
function convert(value, fromUnit, toUnit, category) {
  const units = unitCategories[category];
  const from = units.find(u => u.id === fromUnit);
  const to = units.find(u => u.id === toUnit);
  if (!from || !to) return null;

  const baseValue = value * from.toBase;
  return baseValue / to.toBase;
}

// 最近の変換結果を保存
let recentConversions = [];

// 単位変換を実行し、結果を表示
function handleConvert() {
  const fromValue = parseFloat(document.getElementById("fromValue").value);
  const fromUnit = document.getElementById("fromUnit").value;
  const toUnit = document.getElementById("toUnit").value;
  const category = document.getElementById("category").value;

  if (isNaN(fromValue)) {
    alert("Please enter a valid number");
    return;
  }

  const result = convert(fromValue, fromUnit, toUnit, category);
  if (result !== null) {
    document.getElementById("result").textContent = `${fromValue} ${fromUnit} is ${result.toFixed(2)} ${toUnit}`;

    // 最近の変換結果を更新
    recentConversions.unshift({ from: fromValue, to: result, fromUnit, toUnit, category });
    if (recentConversions.length > 10) recentConversions.pop();
    displayRecentConversions();
  } else {
    alert("Conversion not possible with the selected units.");
  }
}

// 最近の変換結果を表示
function displayRecentConversions() {
  const recentList = document.getElementById("recentConversions");
  recentList.innerHTML = "";

  recentConversions.forEach(conv => {
    const item = document.createElement("li");
    item.textContent = `${conv.from} ${conv.fromUnit} = ${conv.to.toFixed(2)} ${conv.toUnit} (${conv.category})`;
    recentList.appendChild(item);
  });
}

// ページ読み込み時にイベントリスナーを追加
window.addEventListener("load", () => {
  document.getElementById("convertButton").addEventListener("click", handleConvert);
});
