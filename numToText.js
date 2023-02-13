// Данная функция конвертирует число в текст.
// Используется как скрипт для Google Sheets для формирования счетов.

function numToText(num) {
  // функция выдачи валюты в необходимом падеже без указания количества
  const currency = (lastDigit) => {
    lastDigit = Number(lastDigit);

    if (lastDigit === 0 || lastDigit > 4) {
      return " рублей";
    } else if (lastDigit === 1) {
      return " рубль";
    } else if (lastDigit > 1 && lastDigit <= 4) {
      return " рубля";
    }
  };

  // функция выдачи копеек в необходимом падеже с указанием количества
  const pennies = (fraction) => {
    lastDigit =
      Number(fraction) > 20
        ? Number(String(fraction).slice(1, 2))
        : Number(fraction);
    if (lastDigit < 20) {
      if (lastDigit === 0 || lastDigit > 4) {
        return fraction + " копеек";
      } else if (lastDigit === 1) {
        return fraction + " копейка";
      } else if (lastDigit > 1 && lastDigit <= 4) {
        return fraction + " копейки";
      }
    }
  };

  let result = "";

  const units = {
    1: "один",
    2: "два",
    3: "три",
    4: "четыре",
    5: "пять",
    6: "шесть",
    7: "семь",
    8: "восемь",
    9: "девять",
  };
  const elevens = {
    1: "одиннадцать",
    2: "двенадцать",
    3: "тринадцать",
    4: "четырнадцать",
    5: "пятнадцать",
    6: "шестнадцать",
    7: "семнадцать",
    8: "восемнадцать",
    9: "девятнадцать",
  };
  const tens = {
    1: "десять",
    2: "двадцать",
    3: "тридцать",
    4: "сорок",
    5: "пятьдесят",
    6: "шестьдесят",
    7: "семьдесят",
    8: "восемьдесят",
    9: "девяносто",
  };
  const hundreds = {
    1: "сто",
    2: "двести",
    3: "триста",
    4: "четыреста",
    5: "пятьсот",
    6: "шестьсот",
    7: "семьсот",
    8: "восемьсот",
    9: "девятьсот",
  };
  const thousands = {
    1: "одна",
    2: "две",
    3: "три",
    4: units[4],
    5: units[5],
    6: units[6],
    7: units[7],
    8: units[8],
    9: units[9],
  };

  const fixedNum = num.toFixed(2).toString(); // 100.00
  const length = fixedNum.length;
  const integer = fixedNum.slice(0, length - 3);
  const fraction = fixedNum.slice(length - 2, length);

  let rubles = "";

  console.log("fixedNum: ", fixedNum);
  console.log("integer: ", integer);
  console.log("fraction: ", fraction);
  console.log("-------------");

  if (integer == 0) {
    console.log("Сработало условие 'целая часть равна нулю'");
    return pennies(fraction);
  }

  console.log("Производится расчёт:");

  let textInteger = "";
  let textCurrency = "";

  for (let i = integer.length - 1; i >= 0; i = i - 3) {
    const current = Number(integer[i]);

    console.log("integer.length: ", integer.length);
    console.log("i: ", i);
    console.log("current: ", current);
    console.log("-------------");

    if (integer.length === 1) {
      // от 1 до 9
      textInteger = units[current];
      textCurrency = currency(current);
    } else if (integer.length === 2) {
      // от 10 до 99
      const previous = Number(integer[i - 1]);
      if (current === 0) {
        textInteger = tens[previous];
        textCurrency = currency(current);
      } else if (previous === 1) {
        textInteger = elevens[current];
        textCurrency = currency(`${previous}${current}`);
      } else if (previous > 1) {
        textInteger = `${tens[previous]} ${units[current]}`;
        textCurrency = currency(current);
      }
    } else if (integer.length > 2 && integer.length < 4) {
      // от 100 до 999
      const previous = Number(integer[i - 1]);
      const prePrevious = Number(integer[i - 2]);

      if (current === 0) {
        if (previous === 0) {
          if (prePrevious === 0) {
            // дописать
          } else {
            textInteger = hundreds[prePrevious];
            textCurrency = currency(current);
          }
        } else {
          textInteger = `${hundreds[prePrevious]} ${tens[previous]}`;
          textCurrency = currency(current);
        }
      } else {
        if (previous === 0) {
          if (prePrevious === 0) {
            //дописать
          } else {
            textInteger = `${hundreds[prePrevious]} ${units[current]}`;
            textCurrency = currency(current);
          }
        } else if (previous === 1) {
          if (prePrevious === 0) {
            //дописать
          } else {
            textInteger = `${hundreds[prePrevious]} ${elevens[previous]}`;
            textCurrency = currency(`${previous}${current}`);
          }
        } else {
          textInteger = `${hundreds[prePrevious]} ${tens[previous]} ${units[current]}`;
          textCurrency = currency(current);
        }
      }
    }
  }

  result = textInteger.slice(0, 1).toUpperCase() + textInteger.slice(1, textInteger.length) + textCurrency + " " + pennies(fraction);
  return result;
}

console.log("358:", numToText(1358));
