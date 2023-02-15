// Данная функция конвертирует число в текст.
// Используется как скрипт для Google Sheets для формирования счетов на оплату.

function numToText(num) {
  // функция выдачи валюты в необходимом падеже без указания количества
  // корректность работы обеспечена только в рамках функции numToText
  // т.к. обеспечена передача в функцию только валидных данных
  const currency = (lastDigit) => {
    if (lastDigit.length === 2) {
      if (lastDigit[0] === "1") {
        return "рублей";
      } else {
        return currency(lastDigit.slice(1, 2));
      }
    } else {
      // от 0 до 9
      lastDigit = Number(lastDigit);
      if (lastDigit === 0 || lastDigit > 4) {
        return "рублей";
      } else if (lastDigit === 1) {
        return "рубль";
      } else if (lastDigit > 1 && lastDigit <= 4) {
        return "рубля";
      }
    }
  };

  // функция выдачи копеек в необходимом падеже с указанием количества
  // корректность работы обеспечена только в рамках функции numToText
  // т.к. обеспечена передача в функцию только валидных данных
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

  // КАРТЫ НАИМЕНОВАНИЙ
  // (для рубля => в мужском роде)

  // карта наименования единиц
  const units = {
    0: "",
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

  // карта наименования чисел первого десятка
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

  // карта наименования количества десятков
  // полное наименование формируется путем конкатенации с именем единиц (units)
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

  // карта наименований количества сотен
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

  // карта наименований количества тысяч
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

  // карта имён степеней тысячи (классов)
  // структура: mapDegree[k][n],
  // т.е. n * 1000 ** k,
  // где n - количественный множитель;
  // k - степень тысячи
  const mapDegree = {
    // k = 1 - тысячи
    1: {
      1: "тысяча",
      2: "тысячи",
      3: this[2],
      4: this[2],
      5: "тысяч",
      6: this[5],
      7: this[5],
      8: this[5],
      9: this[5],
    },
    // k = 2 - миллионы
    2: {
      1: "миллион",
      2: "миллиона",
      3: this[2],
      4: this[2],
      5: "миллионов",
      6: this[5],
      7: this[5],
      8: this[5],
      9: this[5],
    },
    // k = 3 - миллиарды
    3: {
      1: "миллиард",
      2: "миллиарда",
      3: this[2],
      4: this[2],
      5: "миллиардов",
      6: this[5],
      7: this[5],
      8: this[5],
      9: this[5],
    },
    // k = 4 - триллионы
    4: {
      1: "триллион",
      2: "триллиона",
      3: this[2],
      4: this[2],
      5: "триллионов",
      6: this[5],
      7: this[5],
      8: this[5],
      9: this[5],
    },
  };

  // конвертация полученного числа в строку (например 100.00)
  const fixedNum = num.toFixed(2).toString();
  // отделение целой части (все цифры до дробного разделителя)
  const integer = fixedNum.slice(0, fixedNum.length - 3);
  // отделение дробной части (все цифры после дробного разделителя)
  const fraction = fixedNum.slice(fixedNum.length - 2, fixedNum.length);

  //debugging
  console.log("num: ", num);
  console.log("fixedNum: ", fixedNum);
  console.log("integer: ", integer);
  console.log("fraction: ", fraction);
  console.log("-------------");

  // проверяем есть ли целая часть (рубли)
  // если нет, возвращаем копейки
  if (integer == 0) {
    console.log("Сработало условие 'целая часть равна нулю'"); //debugging
    return pennies(fraction);
  }

  console.log("Производится расчёт:"); //debugging

  const textInteger = []; // массив, состоящий из слов, составляющих полное наименование целой части числа
  const textCurrency = currency(integer.slice(integer.length - 2, integer.length));

  // циклом проходим по строке справа налево с шагом 3,
  // иммитируя проход по классам многозначного числа начиная с первого класса.
  // указатель current указывает на последнюю (правую) цифру класса.
  // hundredDegree - степень тысячи, вычисляется в процессе работы цикла,
  // используется для назначения имени степени тысячи в правилном падеже
  // nullClass - маркер нулевого класса (класс состоит из нулей - 000)

  const degreeName = (prePrevious, previous, current, length, hundredDegree) => {
    const res = [];
    if (length === 1) {
      // для чисел от 1 до 9
      res.unshift(units[current]);
    } else if (length === 2) {
      // для чисел от 10 до 99
      if (current === 0) {
        res.unshift(tens[previous]);
      } else if (previous === 1) {
        res.unshift(elevens[current]);
      } else if (previous > 1) {
        res.unshift(tens[previous], units[current]);
      }
    } else if (length > 2 && length <= 3) {
      // для чисел от 100 до 999
      if (current === 0) {
        if (previous === 0) {
          // prePrevios в таком случае не может быть равен нулю
          res.unshift(hundreds[prePrevious]);
        } else {
          res.unshift(hundreds[prePrevious], tens[previous]);
        }
      } else {
        if (previous === 0) {
          if (prePrevious === 0) {
            res.unshift(units[current]);
          } else {
            res.unshift(hundreds[prePrevious], units[current]);
          }
        } else if (previous === 1) {
          if (prePrevious === 0) {
            res.unshift(elevens[current]);
          } else {
            res.unshift(hundreds[prePrevious], elevens[previous]);
          }
        } else {
          res.unshift(hundreds[prePrevious], tens[previous], units[current]);
        }
      }
    } else if (length > 3 && length <= 20){
      // для чисел x >= 1000
    }
    return res;
  }

  for (let i = integer.length - 1, hundredDegree = 0; i >= 0; i = i - 3) {
    const current = Number(integer[i]);
    const previous = Number(integer[i - 1]);
    const prePrevious = Number(integer[i - 2]);

    textInteger.unshift(... degreeName(prePrevious, previous, current, integer.length, hundredDegree));
    hundredDegree++;
  }

  console.log(textInteger);

  textInteger[0] =
    textInteger[0].slice(0, 1).toUpperCase() +
    textInteger[0].slice(1, textInteger[0].length);

  result = textInteger.join(" ") + " " + textCurrency + " " + pennies(fraction);

  return result;
}

//pretesting:
console.log(numToText(1000));
