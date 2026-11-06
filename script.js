
// Учебный тренажёр автомобильной аптечки.
// Муниципальный этап ВсОШ по ОБЗР, 9 класс, 2026–2027.
// Контрольное время: 2 минуты 30 секунд.
// Максимум: 20 баллов.

const REQUIRED = {
  "Медицинская маска одноразовая": 2,
  "Медицинские перчатки (пара)": 2,
  "Устройство Рот-Устройство-Рот": 2,
  "Кровоостанавливающий жгут": 1,
  "Бинт 5 м × 10 см": 3,
  "Бинт 7 м × 14 см": 3,
  "Стерильные салфетки 16 × 13 см №10": 2,
  "Рулонный лейкопластырь 2 × 500 см": 1,
  "Изотермическое покрывало 160 × 210 см": 1,
  "Ножницы для разрезания перевязочного материала и ткани": 1,
  "Блокнот формата не менее А7": 1,
  "Маркер чёрный/синий или карандаш": 1
};

const ALIASES = {
  "Медицинская маска": "Медицинская маска одноразовая",
  "Медицинская маска нестерильная одноразовая": "Медицинская маска одноразовая",
  "Медицинские перчатки": "Медицинские перчатки (пара)",
  "Блокнот А7": "Блокнот формата не менее А7",
  "Блокнот А6": "Блокнот формата не менее А7",
  "Маркер чёрный": "Маркер чёрный/синий или карандаш",
  "Маркер черный": "Маркер чёрный/синий или карандаш",
  "Маркер синий": "Маркер чёрный/синий или карандаш",
  "Карандаш": "Маркер чёрный/синий или карандаш"
};

// Количество оборудования, которое изначально лежит на столе.
// Перчатки считаются парами.
// Формат: [название, эмодзи, количество]

const ITEMS = [
  ["Медицинская маска нестерильная одноразовая", "😷", 4],
  ["Медицинские перчатки (пара)", "🧤", 4],
  ["Устройство Рот-Устройство-Рот", "🫁", 2],
  ["Кровоостанавливающий жгут", "🩸", 3],
  ["Бинт 5 м × 10 см", "🩹", 5],
  ["Бинт 7 м × 14 см", "🩹", 5],
  ["Салфетки спиртовые 135 × 185 мм", "🧻", 4],
  ["Раствор бриллиантовой зелени 25 мл", "🧴", 1],
  ["Раствор йода 25 мл", "🧴", 1],
  ["Стерильные салфетки 16 × 13 см №10", "🧻", 3],
  ["Рулонный лейкопластырь 2 × 500 см", "🩹", 2],
  ["Пластырь бактерицидный 6 × 10 см", "🩹", 2],
  ["Изотермическое покрывало 160 × 210 см", "🌡️", 2],
  ["Ножницы для разрезания перевязочного материала и ткани", "✂️", 1],
  ["Блокнот А7", "📓", 1],
  ["Маркер чёрный", "🖊️", 1],
  ["Маркер синий", "🖊️", 1],
  ["Маркер красный", "🖊️", 1],
  ["Маркер жёлтый", "🖊️", 1],
  ["Карандаш", "✏️", 1],
  ["Ручка", "🖊️", 1]
];

const TIME_LIMIT_SECONDS = 150;
const MAX_SCORE = 20;

const REASONS = {
  "Салфетки спиртовые 135 × 185 мм":
    "Не входят в таблицу минимальной комплектации.",
  "Раствор бриллиантовой зелени 25 мл":
    "Не входит в таблицу минимальной комплектации.",
  "Раствор йода 25 мл":
    "Не входит в таблицу минимальной комплектации.",
  "Пластырь бактерицидный 6 × 10 см":
    "Не входит в таблицу минимальной комплектации.",
  "Маркер красный":
    "Разрешён только чёрный или синий маркер либо карандаш.",
  "Маркер жёлтый":
    "Разрешён только чёрный или синий маркер либо карандаш.",
  "Ручка":
    "В таблице указаны чёрный/синий маркер или карандаш."
};

const state = {
  placed: [],
  hints: true,
  review: false,
  shuffledItems: [],
  dragName: null,
  timerId: null,
  startedAt: null,
  secondsLeft: TIME_LIMIT_SECONDS,
  finishedByTime: false
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

// Таймер
const timerDisplay = document.createElement("div");
timerDisplay.id = "timer";
timerDisplay.textContent = "Время: 02:30";

Object.assign(timerDisplay.style, {
  color: "#ffffff",
  textAlign: "center",
  fontSize: "18px",
  fontWeight: "700",
  padding: "4px 0 10px",
  fontVariantNumeric: "tabular-nums"
});

el.status.insertAdjacentElement("afterend", timerDisplay);

// Нормализация названий
function canonical(name) {
  return ALIASES[name] || name;
}

// Количество предметов в аптечке
function counts() {
  const result = new Map();

  for (const name of state.placed) {
    const key = canonical(name);
    result.set(key, (result.get(key) || 0) + 1);
  }

  return result;
}

// Группировка предметов аптечки
function getGroups() {
  const groups = new Map();

  for (const name of state.placed) {
    const key = canonical(name);

    if (!groups.has(key)) {
      groups.set(key, []);
    }

    groups.get(key).push(name);
  }

  return groups;
}

// Использованное количество предмета
function getUsed(name) {
  return state.placed.filter(item => item === name).length;
}

// Оставшееся количество на столе
function getAvailable(name) {
  const item = ITEMS.find(item => item[0] === name);

  if (!item) return 0;

  return Math.max(0, item[2] - getUsed(name));
}

// Перемешивание оборудования
function generateItems() {
  const selected = [...ITEMS];

  for (let i = selected.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [selected[i], selected[j]] = [selected[j], selected[i]];
  }

  state.shuffledItems = selected;
}

// Отрисовка предметов на столе
function renderItems() {
  const query = el.search.value.trim().toLocaleLowerCase("ru");

  el.inventory.replaceChildren();

  for (const [name, emoji, total] of state.shuffledItems) {
    if (
      query &&
      !name.toLocaleLowerCase("ru").includes(query)
    ) {
      continue;
    }

    const available = getAvailable(name);

    const card = document.createElement("div");
    card.className = "item-card";
    card.draggable = available > 0;
    card.dataset.name = name;

    if (available === 0) {
      card.classList.add("unavailable");
    }

    const icon = document.createElement("span");
    icon.className = "emoji";
    icon.textContent = emoji;

    const title = document.createElement("span");
    title.className = "item-name";
    title.textContent = name;

    const quantity = document.createElement("span");
    quantity.className = "quantity";
    quantity.textContent = `${available} / ${total}`;

    card.append(icon, title, quantity);

    card.addEventListener("dragstart", event => {
      if (getAvailable(name) <= 0) {
        event.preventDefault();
        return;
      }

      state.dragName = name;
      event.dataTransfer.setData("text/plain", name);
      event.dataTransfer.effectAllowed = "copy";
    });

    card.addEventListener("click", () => addItem(name));

    el.inventory.append(card);
  }
}

// Объяснение неправильного предмета
function reason(name) {
  return REASONS[name] ||
    "Этот предмет не входит в таблицу минимальной комплектации.";
}

// Запуск таймера
function startTimer() {
  if (state.timerId !== null || state.startedAt !== null) return;

  state.startedAt = Date.now();

  state.timerId = window.setInterval(() => {
    const elapsed = Math.floor(
      (Date.now() - state.startedAt) / 1000
    );

    state.secondsLeft = Math.max(
      0,
      TIME_LIMIT_SECONDS - elapsed
    );

    renderTimer();

    if (state.secondsLeft <= 0) {
      stopTimer();
      state.finishedByTime = true;

      setStatus("Время вышло. Проверяем аптечку.");
      check(true);
    }
  }, 250);
}

function stopTimer() {
  if (state.timerId !== null) {
    window.clearInterval(state.timerId);
    state.timerId = null;
  }
}

function renderTimer() {
  const minutes = Math.floor(state.secondsLeft / 60);
  const seconds = state.secondsLeft % 60;

  timerDisplay.textContent =
    `Время: ${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;

  timerDisplay.style.color =
    state.secondsLeft <= 20 ? "#ff8c8c" : "#ffffff";
}

function resetTimer() {
  stopTimer();

  state.startedAt = null;
  state.secondsLeft = TIME_LIMIT_SECONDS;
  state.finishedByTime = false;

  renderTimer();
}

// Добавление предмета в аптечку
function addItem(name) {
  if (state.finishedByTime) return;

  if (getAvailable(name) <= 0) {
    setStatus("Эти предметы закончились на столе.");
    return;
  }

  startTimer();

  state.placed.push(name);
  state.review = false;

  renderItems();
  renderBag();

  if (state.hints) {
    giveHint(name);
  }
}

function addGroupItem(key, preferredName) {
  const name = preferredName || key;
  addItem(name);
}

// Удаление предмета из аптечки с возвратом на стол
function removeGroupItem(key) {
  for (let i = state.placed.length - 1; i >= 0; i--) {
    if (canonical(state.placed[i]) === key) {
      state.placed.splice(i, 1);
      break;
    }
  }

  state.review = false;

  renderItems();
  renderBag();
}

// Подсказки
function giveHint(name) {
  const key = canonical(name);
  const current = counts();

  if (!Object.hasOwn(REQUIRED, key)) {
    setStatus("Неподходящий предмет: " + name);
  } else if (current.get(key) > REQUIRED[key]) {
    setStatus("Предмет добавлен, но его количество превышено.");
  } else if (current.get(key) < REQUIRED[key]) {
    setStatus("Предмет добавлен. Нужно ещё: " +
      (REQUIRED[key] - current.get(key)));
  } else if (name !== key) {
    setStatus("Допустимый вариант принят: " + name);
  } else {
    setStatus("Предмет и его количество соответствуют заданию.");
  }
}

// Отрисовка содержимого аптечки
function renderBag() {
  el.placed.replaceChildren();

  const groups = getGroups();

  for (const [key, names] of groups) {
    const count = names.length;
    const correct = Object.hasOwn(REQUIRED, key);

    let color = correct
      ? (count === REQUIRED[key] ? "good" : "warn")
      : "bad";

    if (!state.hints && !state.review) {
      color = "neutral";
    }

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

    if (
      correct &&
      count !== REQUIRED[key] &&
      (state.hints || state.review)
    ) {
      const explanation = document.createElement("div");
      explanation.className = "placed-reason";
      explanation.style.color = "#795600";
      explanation.textContent =
        `Нужно: ${REQUIRED[key]}. Сейчас: ${count}.`;

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

    minus.addEventListener("click", () => {
      removeGroupItem(key);
    });

    const plus = document.createElement("button");
    plus.className = "quantity-button plus";
    plus.type = "button";
    plus.textContent = "+";
    plus.setAttribute("aria-label", `Добавить предмет: ${key}`);

    plus.addEventListener("click", () => {
      addGroupItem(key, names[0]);
    });

    row.append(info, quantity, minus, plus);
    el.placed.append(row);
  }

  el.counter.textContent = `Предметов: ${state.placed.length}`;

  el.dropHint.classList.toggle(
    "hidden",
    state.placed.length > 0
  );
}

function setStatus(message) {
  el.status.textContent = message;
}

// Переключение режима
function toggleMode() {
  state.hints = !state.hints;
  state.placed = [];
  state.review = false;

  resetTimer();

  if (state.hints) {
    el.modeButton.textContent = "РЕЖИМ ПОДСКАЗОК";
    el.modeButton.classList.remove("exam");

    setStatus("Режим подсказок. Аптечка очищена.");
  } else {
    el.modeButton.textContent = "РЕЖИМ ЭКЗАМЕНА";
    el.modeButton.classList.add("exam");

    setStatus(
      "Режим экзамена. На выполнение даётся 2 минуты 30 секунд."
    );
  }

  renderItems();
  renderBag();
}

// Проверка аптечки
function check(timeExpired = false) {
  stopTimer();

  const current = counts();
  const wrongCounts = new Map();

  for (const name of state.placed) {
    if (!Object.hasOwn(REQUIRED, canonical(name))) {
      wrongCounts.set(
        name,
        (wrongCounts.get(name) || 0) + 1
      );
    }
  }

  let quantityErrors = 0;
  const quantityDetails = [];

  for (const [name, required] of Object.entries(REQUIRED)) {
    const actual = current.get(name) || 0;

    if (actual !== required) {
      quantityErrors++;

      quantityDetails.push({
        name,
        required,
        actual,
        difference: actual - required
      });
    }
  }

  const wrongItemCount = [...wrongCounts.values()]
    .reduce((sum, value) => sum + value, 0);

  const notAttempted = state.placed.length === 0;

  const timePenalty =
    (timeExpired || state.finishedByTime) ? 20 : 0;

  const nonAttemptPenalty = notAttempted ? 20 : 0;

  let penalty =
    wrongItemCount +
    quantityErrors +
    timePenalty +
    nonAttemptPenalty;

  penalty = Math.min(MAX_SCORE, penalty);

  const score = Math.max(0, MAX_SCORE - penalty);

  showResults(
    score,
    current,
    wrongCounts,
    quantityDetails,
    {
      wrongItemCount,
      quantityErrors,
      timePenalty,
      nonAttemptPenalty,
      penalty
    }
  );

  state.placed = [];
  state.review = false;

  resetTimer();
  renderItems();
  renderBag();

  setStatus("Проверка завершена. Аптечка очищена.");
}

// Вывод результатов
function showResults(
  score,
  current,
  wrongCounts,
  quantityDetails,
  penalties
) {
  el.resultTitle.textContent =
    `РЕЗУЛЬТАТ: ${score} ИЗ 20 БАЛЛОВ`;

  const scoreLine = document.createElement("div");
  scoreLine.className = "score";
  scoreLine.textContent = `${score} / 20 баллов`;

  const summary = document.createElement("p");
  summary.style.textAlign = "center";

  summary.textContent =
    `Штраф: ${penalties.penalty} баллов. ` +
    `Неверные предметы: ${penalties.wrongItemCount}; ` +
    `неверные количества: ${penalties.quantityErrors}; ` +
    `время: ${penalties.timePenalty}; ` +
    `задание не выполнялось: ${penalties.nonAttemptPenalty}.`;

  const table = document.createElement("table");
  table.className = "result-table";

  const thead = document.createElement("thead");

  thead.innerHTML =
    "<tr><th>Предмет</th><th>Нужно</th><th>Положено</th><th>Результат</th></tr>";

  table.append(thead);

  const tbody = document.createElement("tbody");

  for (const [name, required] of Object.entries(REQUIRED)) {
    const actual = current.get(name) || 0;
    const correct = actual === required;

    const tr = document.createElement("tr");
    tr.className = correct ? "good-row" : "bad-row";

    let status = "ПРАВИЛЬНО";

    if (actual < required) {
      status = `НЕ ХВАТАЕТ ${required - actual}`;
    }

    if (actual > required) {
      status = `ЛИШНИХ ${actual - required}`;
    }

    [name, required, actual, status].forEach(value => {
      const td = document.createElement("td");
      td.textContent = value;
      tr.append(td);
    });

    tbody.append(tr);
  }

  for (const [name, amount] of wrongCounts) {
    const tr = document.createElement("tr");
    tr.className = "bad-row";

    [name, "—", amount, reason(name)].forEach(value => {
      const td = document.createElement("td");
      td.textContent = value;
      tr.append(td);
    });

    tbody.append(tr);
  }

  table.append(tbody);

  const details = document.createElement("p");
  details.style.fontSize = "12px";

  details.textContent = quantityDetails.length
    ? "Каждое неверное количество даёт 1 штрафной балл независимо от величины недостачи или избытка."
    : "Все количества соответствуют таблице.";

  el.resultBody.replaceChildren(
    scoreLine,
    summary,
    table,
    details
  );

  el.resultsDialog.showModal();
}

// Полный сброс
function reset() {
  state.placed = [];
  state.review = false;

  resetTimer();
  generateItems();

  el.search.value = "";

  renderItems();
  renderBag();

  setStatus(
    "Аптечка очищена. Список предметов перемешан. Таймер начнётся при добавлении первого предмета."
  );
}

// События интерфейса
el.search.addEventListener("input", renderItems);

el.modeButton.addEventListener("click", toggleMode);

el.checkButton.addEventListener("click", () => {
  check(false);
});

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

el.closeResults.addEventListener("click", () => {
  el.resultsDialog.close();
});

el.closeResultsBottom.addEventListener("click", () => {
  el.resultsDialog.close();
});

// Перетаскивание в аптечку
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

  const name =
    event.dataTransfer.getData("text/plain") ||
    state.dragName;

  if (name) {
    addItem(name);
  }

  state.dragName = null;
});

// Инициализация
generateItems();
renderItems();
renderBag();
renderTimer();
