function numToText(num, set = 1) {
  const units = [
    "",
    "один",
    "два",
    "три",
    "четыре",
    "пять",
    "шесть",
    "семь",
    "восемь",
    "девять",
  ];
  const teens = [
    "десять",
    "одиннадцать",
    "двенадцать",
    "тринадцать",
    "четырнадцать",
    "пятнадцать",
    "шестнадцать",
    "семнадцать",
    "восемнадцать",
    "девятнадцать",
  ];
  const tens = [
    "",
    "",
    "двадцать",
    "тридцать",
    "сорок",
    "пятьдесят",
    "шестьдесят",
    "семьдесят",
    "восемьдесят",
    "девяносто",
  ];
  const hundreds = [
    "",
    "сто",
    "двести",
    "триста",
    "четыреста",
    "пятьсот",
    "шестьсот",
    "семьсот",
    "восемьсот",
    "девятьсот",
  ];
  const femaleUnits = [
    "",
    "одна",
    "две",
    "три",
    "четыре",
    "пять",
    "шесть",
    "семь",
    "восемь",
    "девять",
  ];

  const grades = [
    ["", "", ""],
    ["тысяча", "тысячи", "тысяч"],
    ["миллион", "миллиона", "миллионов"],
    ["миллиард", "миллиарда", "миллиардов"],
    ["триллион", "триллиона", "триллионов"],
  ];

  // ИСПРАВЛЕННАЯ функция склонений
  function getPlural(number, forms) {
    const n = Math.abs(number) % 100;
    const n1 = n % 10;

    if (n > 10 && n < 20) return forms[2];
    if (n1 > 1 && n1 < 5) return forms[1];
    if (n1 === 1) return forms[0];
    return forms[2];
  }

  function convertHundreds(num, isFemale = false) {
    if (num === 0) return "";

    const result = [];
    const h = Math.floor(num / 100);
    const t = Math.floor((num % 100) / 10);
    const u = num % 10;

    if (h > 0) result.push(hundreds[h]);

    if (t === 1) {
      result.push(teens[u]);
    } else {
      if (t > 0) result.push(tens[t]);
      if (u > 0) {
        const unitsArray = isFemale ? femaleUnits : units;
        result.push(unitsArray[u]);
      }
    }

    return result.join(" ");
  }

  function normalizeInput(input) {
    if (Array.isArray(input)) {
      input = input.join("");
    }

    if (typeof input === "string") {
      input = input.replace(/\s+/g, "").replace(",", ".");
      if (!/^\d+(\.\d{1,2})?$/.test(input)) {
        throw new Error("Невалидные данные");
      }
      return parseFloat(input);
    }

    if (typeof input === "number") {
      return input;
    }

    throw new Error("Невалидные данные");
  }

  try {
    const normalizedNum = normalizeInput(num);

    if (normalizedNum > 9999999999999.99) {
      return "ОШИБКА: слишком большое число";
    }

    const fixedNum = normalizedNum.toFixed(2);
    const [integerPart, fractionPart] = fixedNum.split(".");
    const integer = parseInt(integerPart);
    const fraction = parseInt(fractionPart);

    // ИСПРАВЛЕНО: специальная обработка нуля
    if (integer === 0 && fraction === 0) {
      return "Ноль рублей 00 копеек";
    }

    if (integer === 0) {
      const kopeckForm = getPlural(fraction, ["копейка", "копейки", "копеек"]);
      return `${fraction.toString().padStart(2, "0")} ${kopeckForm}`;
    }

    const groups = [];
    let temp = integer;

    while (temp > 0) {
      groups.unshift(temp % 1000);
      temp = Math.floor(temp / 1000);
    }

    const textParts = [];
    const totalGroups = groups.length;

    groups.forEach((group, index) => {
      if (group === 0) return;

      const gradeIndex = totalGroups - index - 1;
      const isFemale = gradeIndex === 1;

      const groupText = convertHundreds(group, isFemale);
      textParts.push(groupText);

      if (gradeIndex > 0) {
        const gradeForm = getPlural(group, grades[gradeIndex]);
        textParts.push(gradeForm);
      }
    });

    let result = textParts.join(" ");
    // ИСПРАВЛЕНО: правильная капитализация
    result = result.charAt(0).toUpperCase() + result.slice(1);

    if (set === 0) {
      return result;
    }

    const rubleForm = getPlural(integer, ["рубль", "рубля", "рублей"]);
    const kopeckForm = getPlural(fraction, ["копейка", "копейки", "копеек"]);

    return `${result} ${rubleForm} ${fraction
      .toString()
      .padStart(2, "0")} ${kopeckForm}`;
  } catch (error) {
    return `ОШИБКА: ${error.message}`;
  }
}
