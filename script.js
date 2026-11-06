// Учебный тренажёр автомобильной аптечки.
// Логика перенесена из Python/Tkinter в браузерный JavaScript.

const REQUIRED = {
  "Медицинская маска": 2,
  "Медицинские перчатки": 2,
  "Устройство Рот-Устройство-Рот": 2,
  "Кровоостанавливающий жгут": 1,
  "Бинт 5 м × 10 см": 3,
  "Бинт 7 м × 14 см": 3,
  "Стерильные салфетки 16 × 13 см №10": 2,
  "Рулонный пластырь 2 × 500 см": 1,
  "Изотермическое покрывало 160 × 210 см": 1,
  "Ножницы для перевязочного материала": 1,
  "Инструкция по первой помощи": 1,
  "Блокнот А7": 1,
  "Маркер или карандаш": 1,
  "Футляр или сумка": 1
};

const ALIASES = {
  "Хирургические ножницы общего назначения": "Ножницы для перевязочного материала",
  "Блокнот А6": "Блокнот А7"
};

const SINGLE_CHOICE_GROUPS = new Set([
  "Ножницы для перевязочного материала",
  "Блокнот А7"
]);

const ITEMS = [
  ["Медицинская маска", "😷"],
  ["Медицинские перчатки", "🧤"],
  ["Устройство Рот-Устройство-Рот", "🫁"],
  ["Кровоостанавливающий жгут", "🩸"],
  ["Бинт 5 м × 10 см", "🩹"],
  ["Бинт 7 м × 14 см", "🩹"],
  ["Стерильные салфетки 16 × 13 см №10", "🧻"],
  ["Рулонный пластырь 2 × 500 см", "🩹"],
  ["Изотермическое покрывало 160 × 210 см", "🌡"],
  ["Ножницы для перевязочного материала", "✂"],
  ["Хирургические ножницы общего назначения", "✂"],
  ["Инструкция по первой помощи", "📖"],
  ["Блокнот А7", "📓"],
  ["Блокнот А6", "📓"],
  ["Маркер или карандаш", "🖊"],
  ["Футляр или сумка", "🧰"]
];

const WRONG_ITEMS = [
  ["Эластичный бинт 2 м × 10 см", "🩹"],
  ["Эластичный бинт 2 м × 14 см", "🩹"],
  ["Бинт 3 м × 5 см", "🩹"],
  ["Бинт 5 м × 5 см", "🩹"],
  ["Бинт 7 м × 10 см", "🩹"],
  ["Бинт 10 м × 10 см", "🩹"],
  ["Бинт 10 м × 14 см", "🩹"],
  ["Бинт 3 м × 10 см", "🩹"],
  ["Бинт 5 м × 7 см", "🩹"],
  ["Эластичный бинт 3 м × 10 см", "🩹"],
  ["Нестерильная марля", "🧻"],
  ["Вата медицинская", "🧻"],
  ["Пластырь 1 × 100 см", "🩹"],
  ["Пластырь 2 × 100 см", "🩹"],
  ["Бактерицидный пластырь", "🩹"],
  ["Канцелярские ножницы", "✂"],
  ["Маникюрные ножницы", "✂"],
  ["Неподходящие ножницы", "✂"],
  ["Перчатки XS", "🧤"],
  ["Перчатки XL", "🧤"],
  ["Повреждённые перчатки", "🧤"],
  ["Тканевая маска", "😷"],
  ["Респиратор", "😷"],
  ["Эластичный бинт вместо жгута", "🩸"],
  ["Обезболивающие таблетки", "💊"],
  ["Антибиотики", "💊"],
  ["Перекись водорода", "🧴"],
  ["Йод", "🧴"],
  ["Зелёнка", "🧴"],
  ["Обычное одеяло", "🌡"],
  ["Покрывало 100 × 150 см", "🌡"],
  ["Покрывало 200 × 200 см", "🌡"],
  ["Красный маркер", "🖊"],
  ["Бумажные салфетки", "🧻"],
  ["Просроченный бинт", "🩹"],
  ["Грязный бинт", "🩹"],
  ["Ватные диски", "🫧"],
  ["Нашатырный спирт", "🧪"],
  ["Английские булавки", "🧷"],
  ["Стетоскоп", "🩺"],
  ["Термометр", "🌡"],
  ["Косметический крем", "🧴"],
  ["Перчатки без маркировки", "🧤"],
  ["Кровоостанавливающая повязка", "🩸"],
  ["Медицинский шприц", "💉"],
  ["Бинт трубчатый", "🩹"],
  ["Марлевый тампон", "🧻"],
  ["Спиртовые салфетки", "🧻"],
  ["Капли для глаз", "💧"],
  ["Медицинский скотч", "🩹"],
  ["Пинцет косметический", "🧷"],
  ["Зубная щётка", "🪥"],
  ["Влажные салфетки", "🧻"],
  ["Одноразовые бахилы", "🥾"],
  ["Медицинский халат", "🥼"],
  ["Пакет для мусора", "🗑"],
  ["Бутылка воды", "💧"],
  ["Лейкопластырь тканевый", "🩹"]
];

const WRONG_ITEMS_PER_ROUND = 18;

const REASONS = {
  "Эластичный бинт 2 м × 10 см": "Не соответствует требуемому бинту 5 м × 10 см.",
  "Эластичный бинт 2 м × 14 см": "Не соответствует требуемому бинту 7 м × 14 см.",
  "Бинт 3 м × 5 см": "Неподходящие размеры бинта.",
  "Бинт 5 м × 5 см": "Ширина бинта не соответствует требуемой.",
  "Бинт 7 м × 10 см": "Ширина бинта не соответствует требуемой.",
  "Бинт 10 м × 10 см": "Размер не соответствует предусмотренному варианту.",
  "Бинт 10 м × 14 см": "Размер не соответствует предусмотренному варианту.",
  "Бинт 3 м × 10 см": "Размер не соответствует предусмотренному варианту.",
  "Бинт 5 м × 7 см": "Ширина бинта не соответствует требуемой.",
  "Эластичный бинт 3 м × 10 см": "Не соответствует предусмотренному варианту бинта.",
  "Нестерильная марля": "Не заменяет стерильные медицинские салфетки.",
  "Вата медицинская": "Не входит в используемый перечень комплектации.",
  "Пластырь 1 × 100 см": "Не соответствует требуемому размеру рулонного пластыря.",
  "Пластырь 2 × 100 см": "Не соответствует требуемой длине пластыря.",
  "Бактерицидный пластырь": "Не заменяет требуемый рулонный пластырь.",
  "Канцелярские ножницы": "Не предназначены для разрезания перевязочного материала.",
  "Маникюрные ножницы": "Не подходят для оказания первой помощи.",
  "Неподходящие ножницы": "Не соответствуют назначению медицинских ножниц.",
  "Перчатки XS": "Проверь назначение и пригодность перчаток.",
  "Перчатки XL": "Проверь назначение и пригодность перчаток.",
  "Повреждённые перчатки": "Повреждённые перчатки не обеспечивают защиту.",
  "Тканевая маска": "Не является одноразовой медицинской маской.",
  "Респиратор": "Не заменяет предусмотренную медицинскую маску.",
  "Эластичный бинт вместо жгута": "Эластичный бинт не заменяет кровоостанавливающий жгут.",
  "Обезболивающие таблетки": "Лекарственные препараты не входят в этот учебный перечень.",
  "Антибиотики": "Лекарственные препараты не входят в этот учебный перечень.",
  "Перекись водорода": "Не входит в используемый перечень комплектации.",
  "Йод": "Не входит в используемый перечень комплектации.",
  "Зелёнка": "Не входит в используемый перечень комплектации.",
  "Обычное одеяло": "Требуется изотермическое покрывало.",
  "Покрывало 100 × 150 см": "Размер не соответствует требуемому.",
  "Покрывало 200 × 200 см": "Не соответствует предусмотренному варианту.",
  "Красный маркер": "Предусмотрен чёрный или синий маркер либо карандаш.",
  "Бумажные салфетки": "Не заменяют стерильные медицинские салфетки.",
  "Просроченный бинт": "Изделие с истёкшим сроком годности непригодно.",
  "Грязный бинт": "Загрязнённое изделие непригодно для комплектации.",
  "Ватные диски": "Не входят в используемый перечень комплектации.",
  "Нашатырный спирт": "Не входит в используемый перечень комплектации.",
  "Английские булавки": "Не входят в используемый перечень комплектации.",
  "Стетоскоп": "Не входит в используемый перечень комплектации.",
  "Термометр": "Не входит в используемый перечень комплектации.",
  "Косметический крем": "Не является необходимым изделием аптечки.",
  "Перчатки без маркировки": "Нельзя подтвердить, что это медицинские перчатки.",
  "Кровоостанавливающая повязка": "Не заменяет предусмотренный кровоостанавливающий жгут.",
  "Медицинский шприц": "Не входит в используемый перечень комплектации.",
  "Бинт трубчатый": "Не соответствует предусмотренному варианту бинта.",
  "Марлевый тампон": "Не заменяет стерильные салфетки установленного размера.",
  "Спиртовые салфетки": "Не заменяют предусмотренные стерильные салфетки.",
  "Капли для глаз": "Не входят в используемый перечень комплектации.",
  "Медицинский скотч": "Не соответствует предусмотренному рулонному пластырю.",
  "Пинцет косметический": "Не входит в используемый перечень комплектации.",
  "Зубная щётка": "Не входит в используемый перечень комплектации.",
  "Влажные салфетки": "Не заменяют стерильные медицинские салфетки.",
  "Одноразовые бахилы": "Не входят в используемый перечень комплектации.",
  "Медицинский халат": "Не входит в используемый перечень комплектации.",
  "Пакет для мусора": "Не входит в используемый перечень комплектации.",
  "Бутылка воды": "Не входит в используемый перечень комплектации.",
  "Лейкопластырь тканевый": "Не заменяет предусмотренный рулонный пластырь."
};

const state = {
  placed: [],
  hints: true,
  review: false,
  shuffledItems: [],
  dragName: null
};

const el = {
  inventory: document.getElementById("inventory"),
  search: document.getElementById("search"),
  bag: document.getElementById("bag"),
  placed: document.getElementById("placed"),
  counter: document.getElementById("counter"),
  dropHint: document.getElementById("dropHint"),
  status: document.getElementById("status"),
  modeButton: document.getElementById("modeButton"),
  checkButton: document.getElementById("checkButton"),
  resetButton: document.getElementById("resetButton"),
  resultsDialog: document.getElementById("resultsDialog"),
  resultTitle: document.getElementById("resultTitle"),
  resultBody: document.getElementById("resultBody"),
  closeResults: document.getElementById("closeResults"),
  closeResultsBottom: document.getElementById("closeResultsBottom"),
  confirmDialog: document.getElementById("confirmDialog"),
  cancelReset: document.getElementById("cancelReset"),
  confirmReset: document.getElementById("confirmReset")
};

function canonical(name) {
  return ALIASES[name] || name;
}

function counts() {
  const result = new Map();
  for (const name of state.placed) {
    const key = canonical(name);
    result.set(key, (result.get(key) || 0) + 1);
  }
  return result;
}

function getGroups() {
  const groups = new Map();
  for (const name of state.placed) {
    let key = canonical(name);
    if (!Object.hasOwn(REQUIRED, key)) key = name;
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(name);
  }
  return groups;
}

function generateItems() {
  const selected = [...ITEMS];
  const pool = [...WRONG_ITEMS];
  const amount = Math.min(WRONG_ITEMS_PER_ROUND, pool.length);

  for (let i = 0; i < amount; i++) {
    const index = Math.floor(Math.random() * pool.length);
    selected.push(pool.splice(index, 1)[0]);
  }

  for (let i = selected.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [selected[i], selected[j]] = [selected[j], selected[i]];
  }

  state.shuffledItems = selected;
}

function renderItems() {
  const query = el.search.value.trim().toLocaleLowerCase("ru");
  el.inventory.replaceChildren();

  for (const [name, emoji] of state.shuffledItems) {
    if (query && !name.toLocaleLowerCase("ru").includes(query)) continue;

    const card = document.createElement("div");
    card.className = "item-card";
    card.draggable = true;
    card.dataset.name = name;
    card.innerHTML = `<span class="emoji"></span><span class="item-name"></span>`;
    card.querySelector(".emoji").textContent = emoji;
    card.querySelector(".item-name").textContent = name;

    card.addEventListener("dragstart", event => {
      state.dragName = name;
      event.dataTransfer.setData("text/plain", name);
      event.dataTransfer.effectAllowed = "copy";
    });

    card.addEventListener("click", () => addItem(name));
    el.inventory.append(card);
  }
}

function reason(name) {
  return REASONS[name] || "Этот предмет не входит в используемый перечень.";
}

function addItem(name) {
  const key = canonical(name);

  if (SINGLE_CHOICE_GROUPS.has(key)) {
    const alreadyAdded = state.placed.some(item => canonical(item) === key);
    if (alreadyAdded) {
      const message = key === "Ножницы для перевязочного материала"
        ? "Уже добавлены другие ножницы. Достаточно одного из этих вариантов."
        : "Уже добавлен другой блокнот. Достаточно одного из этих вариантов.";
      setStatus(message);
      return;
    }
  }

  state.placed.push(name);
  state.review = false;
  renderBag();

  if (state.hints) giveHint(name);
}

function addGroupItem(key) {
  addItem(key);
}

function removeGroupItem(key) {
  for (let i = state.placed.length - 1; i >= 0; i--) {
    let current = canonical(state.placed[i]);
    if (!Object.hasOwn(REQUIRED, current)) current = state.placed[i];

    if (current === key) {
      state.placed.splice(i, 1);
      break;
    }
  }

  state.review = false;
  renderBag();
}

function giveHint(name) {
  const key = canonical(name);
  const current = counts();

  if (!Object.hasOwn(REQUIRED, key)) {
    setStatus("Неподходящий предмет: " + name);
  } else if (current.get(key) !== REQUIRED[key]) {
    setStatus("Количество предмета пока неправильное.");
  } else if (name !== key) {
    setStatus("Альтернативный вариант принят: " + name);
  } else {
    setStatus("Предмет добавлен правильно.");
  }
}

function renderBag() {
  el.placed.replaceChildren();
  const groups = getGroups();

  for (const [key, names] of groups) {
    const count = names.length;
    const correct = Object.hasOwn(REQUIRED, key);
    let color = correct
      ? (count === REQUIRED[key] ? "good" : "warn")
      : "bad";

    if (!state.hints && !state.review) color = "neutral";

    const row = document.createElement("div");
    row.className = `placed-row ${color}`;

    const info = document.createElement("div");
    info.className = "placed-info";

    const name = document.createElement("div");
    name.className = "placed-name";
    name.textContent = names[0];
    info.append(name);

    if ((state.hints || state.review) && !correct) {
      const explanation = document.createElement("div");
      explanation.className = "placed-reason";
      explanation.textContent = reason(names[0]);
      info.append(explanation);
    }

    const quantity = document.createElement("span");
    quantity.className = "quantity";
    quantity.textContent = `${count}×`;

    const minus = document.createElement("button");
    minus.className = "quantity-button minus";
    minus.type = "button";
    minus.textContent = "−";
    minus.setAttribute("aria-label", `Убрать один предмет: ${key}`);
    minus.addEventListener("click", () => removeGroupItem(key));

    const plus = document.createElement("button");
    plus.className = "quantity-button plus";
    plus.type = "button";
    plus.textContent = "+";
    plus.setAttribute("aria-label", `Добавить предмет: ${key}`);
    plus.addEventListener("click", () => addGroupItem(key));

    row.append(info, quantity, minus, plus);
    el.placed.append(row);
  }

  el.counter.textContent = `Предметов: ${state.placed.length}`;
  el.dropHint.classList.toggle("hidden", state.placed.length > 0);
}

function setStatus(message) {
  el.status.textContent = message;
}

function toggleMode() {
  state.hints = !state.hints;

  state.placed = [];
  state.review = false;

  if (state.hints) {
    el.modeButton.textContent = "РЕЖИМ ПОДСКАЗОК";
    el.modeButton.classList.remove("exam");
    setStatus("Режим подсказок. Аптечка очищена.");
  } else {
    el.modeButton.textContent = "РЕЖИМ ЭКЗАМЕНА";
    el.modeButton.classList.add("exam");
    setStatus("Режим экзамена. Аптечка очищена.");
  }

  renderBag();
}

function check() {
  const current = counts();
  const missing = [];
  const excessive = [];

  const wrong = [...new Set(
    state.placed.filter(name => !Object.hasOwn(REQUIRED, canonical(name)))
  )];

  let correctCount = 0;
  const total = Object.values(REQUIRED).reduce((sum, value) => sum + value, 0);

  for (const [name, required] of Object.entries(REQUIRED)) {
    const actual = current.get(name) || 0;
    correctCount += Math.min(actual, required);

    if (actual < required) missing.push([name, required - actual]);
    if (actual > required) excessive.push([name, actual - required]);
  }

  let score = Math.round(correctCount / total * 100);
  score = Math.max(
    0,
    score - 3 * wrong.length - 2 * excessive.reduce((sum, item) => sum + item[1], 0)
  );

  showResults(score, current, wrong);

  state.placed = [];
  state.review = false;
  renderBag();
  setStatus("Проверка завершена. Аптечка очищена.");
}

function showResults(score, current, wrong) {
  el.resultTitle.textContent = `РЕЗУЛЬТАТ: ${score}%`;

  const table = document.createElement("table");
  table.className = "result-table";

  const thead = document.createElement("thead");
  thead.innerHTML = "<tr><th>Предмет</th><th>Нужно</th><th>Положено</th><th>Результат</th></tr>";
  table.append(thead);

  const tbody = document.createElement("tbody");

  for (const [name, required] of Object.entries(REQUIRED)) {
    const actual = current.get(name) || 0;
    let status;
    let rowClass;

    if (actual === required) {
      status = "ПРАВИЛЬНО";
      rowClass = "good-row";
    } else if (actual < required) {
      status = `НЕ ХВАТАЕТ ${required - actual}`;
      rowClass = "bad-row";
    } else {
      status = `ЛИШНИХ ${actual - required}`;
      rowClass = "bad-row";
    }

    const tr = document.createElement("tr");
    tr.className = rowClass;
    [name, required, actual, status].forEach(value => {
      const td = document.createElement("td");
      td.textContent = value;
      tr.append(td);
    });
    tbody.append(tr);
  }

  for (const name of wrong) {
    const tr = document.createElement("tr");
    tr.className = "bad-row";
    [name, "—", current.get(name) || 0, reason(name)].forEach(value => {
      const td = document.createElement("td");
      td.textContent = value;
      tr.append(td);
    });
    tbody.append(tr);
  }

  table.append(tbody);

  const scoreLine = document.createElement("div");
  scoreLine.className = "score";
  scoreLine.textContent = `РЕЗУЛЬТАТ: ${score}%`;

  el.resultBody.replaceChildren(scoreLine, table);
  el.resultsDialog.showModal();
}

function reset() {
  state.placed = [];
  state.review = false;
  generateItems();
  el.search.value = "";
  renderItems();
  renderBag();
  setStatus("Аптечка очищена. Список неправильных предметов изменён.");
}

el.search.addEventListener("input", renderItems);
el.modeButton.addEventListener("click", toggleMode);
el.checkButton.addEventListener("click", check);

el.resetButton.addEventListener("click", () => {
  el.confirmDialog.showModal();
});

el.cancelReset.addEventListener("click", () => {
  el.confirmDialog.close();
});

el.confirmReset.addEventListener("click", () => {
  el.confirmDialog.close();
  reset();
});

el.closeResults.addEventListener("click", () => el.resultsDialog.close());
el.closeResultsBottom.addEventListener("click", () => el.resultsDialog.close());

el.bag.addEventListener("dragover", event => {
  event.preventDefault();
  el.bag.classList.add("drag-over");
  event.dataTransfer.dropEffect = "copy";
});

el.bag.addEventListener("dragleave", event => {
  if (!el.bag.contains(event.relatedTarget)) {
    el.bag.classList.remove("drag-over");
  }
});

el.bag.addEventListener("drop", event => {
  event.preventDefault();
  el.bag.classList.remove("drag-over");
  const name = event.dataTransfer.getData("text/plain") || state.dragName;
  if (name) addItem(name);
  state.dragName = null;
});

generateItems();
renderItems();
renderBag();