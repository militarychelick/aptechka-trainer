from pathlib import Path

js = r'''// Тренажёр сборки автомобильной аптечки — ОБЗР, 9 класс, 2026–2027.
// Слева — всё оборудование этапа с исходным количеством.
// При переносе одной единицы остаток слева уменьшается на 1.
// Кнопка «−» справа возвращает одну единицу в список слева.

const REQUIRED = {
  "Маска медицинская нестерильная одноразовая": 2,
  "Перчатки медицинские": 2,
  "Устройство для искусственного дыхания «Рот-Устройство-Рот»": 2,
  "Жгут кровоостанавливающий": 1,
  "Бинт марлевый 5 м × 10 см": 3,
  "Бинт марлевый 7 м × 14 см": 3,
  "Салфетки медицинские стерильные 16 × 13 см №10": 2,
  "Лейкопластырь фиксирующий рулонный 2 × 500 см": 1,
  "Покрывало спасательное изотермическое 160 × 210 см": 1,
  "Ножницы для разрезания перевязочного материала и ткани": 1,
  "Блокнот формата не менее А7": 1
};

// Маркер чёрный, синий или карандаш — альтернативы одного пункта норматива.
const MARKER_ALTERNATIVES = [
  "Маркер чёрный",
  "Маркер синий",
  "Карандаш"
];

const EQUIPMENT = [
  { name: "Жгут кровоостанавливающий", qty: 3, icon: "🩸" },
  { name: "Маска медицинская нестерильная одноразовая", qty: 4, icon: "😷" },
  { name: "Перчатки медицинские", qty: 4, icon: "🧤" },
  { name: "Бинт марлевый 5 м × 10 см", qty: 5, icon: "🩹" },
  { name: "Устройство для искусственного дыхания «Рот-Устройство-Рот»", qty: 2, icon: "🫁" },
  { name: "Бинт марлевый 7 м × 14 см", qty: 5, icon: "🩹" },
  { name: "Салфетки спиртовые 135 × 185 мм", qty: 4, icon: "🧻" },
  { name: "Раствор бриллиантовой зелени 25 мл", qty: 1, icon: "🧴" },
  { name: "Раствор йода 25 мл", qty: 1, icon: "🧴" },
  { name: "Салфетки медицинские стерильные 16 × 13 см №10", qty: 3, icon: "🧻" },
  { name: "Лейкопластырь фиксирующий рулонный 2 × 500 см", qty: 2, icon: "🩹" },
  { name: "Пластырь бактерицидный 6 × 10 см", qty: 2, icon: "🩹" },
  { name: "Покрывало спасательное изотермическое 160 × 210 см", qty: 2, icon: "🌡️" },
  { name: "Ножницы для разрезания перевязочного материала и ткани", qty: 1, icon: "✂️" },
  { name: "Блокнот формата не менее А7", qty: 1, icon: "📓" },
  { name: "Маркер чёрный", qty: 1, icon: "🖊️" },
  { name: "Маркер синий", qty: 1, icon: "🖊️" },
  { name: "Маркер красный", qty: 1, icon: "🖊️" },
  { name: "Маркер жёлтый", qty: 1, icon: "🖊️" },
  { name: "Карандаш", qty: 1, icon: "✏️" },
  { name: "Ручка", qty: 1, icon: "🖊️" },
  { name: "Пластиковый кейс или сумка", qty: 1, icon: "🧰", container: true }
];

// Посторонние предметы для тренировочного выбора. Они не входят в перечень оборудования этапа.
const DISTRACTORS = [
  ["Медицинская маска многоразовая", "😷"],
  ["Тканевая маска", "😷"],
  ["Респиратор", "😷"],
  ["Повреждённые медицинские перчатки", "🧤"],
  ["Эластичный бинт 2 м × 10 см", "🩹"],
  ["Бинт 5 м × 5 см", "🩹"],
  ["Бинт 7 м × 10 см", "🩹"],
  ["Нестерильная марля", "🧻"],
  ["Вата медицинская", "🧻"],
  ["Бактерицидный пластырь другого размера", "🩹"],
  ["Лейкопластырь 2 × 100 см", "🩹"],
  ["Канцелярские ножницы", "✂️"],
  ["Маникюрные ножницы", "✂️"],
  ["Блокнот А8", "📓"],
  ["Маркер красный", "🖊️"],
  ["Маркер жёлтый", "🖊️"],
  ["Ручка", "🖊️"],
  ["Обычное одеяло", "🌡️"],
  ["Покрывало 100 × 150 см", "🌡️"],
  ["Перекись водорода", "🧴"],
  ["Обезболивающие таблетки", "💊"],
  ["Термометр", "🌡️"],
  ["Пинцет", "🧷"],
  ["Медицинский шприц", "💉"]
];

const TIME_LIMIT_SECONDS = 150;
const MAX_SCORE = 20;

const state = {
  stock: new Map(),
  selected: [],
  hints: true,
  timerId: null,
  startedAt: null,
  secondsLeft: TIME_LIMIT_SECONDS,
  finished: false,
  containerSelected: false,
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

const timerDisplay = document.createElement("div");
timerDisplay.id = "timer";
timerDisplay.textContent = "Время: 02:30";
Object.assign(timerDisplay.style, {
  textAlign: "center",
  fontSize: "18px",
  fontWeight: "700",
  padding: "4px 0 10px",
  fontVariantNumeric: "tabular-nums"
});
el.status.insertAdjacentElement("afterend", timerDisplay);

function setStatus(message) {
  el.status.textContent = message;
}

function initStock() {
  state.stock.clear();
  state.selected = [];
  state.containerSelected = false;
  for (const item of EQUIPMENT) state.stock.set(item.name, item.qty);
}

function findEquipment(name) {
  return EQUIPMENT.find(item => item.name === name);
}

function startTimer() {
  if (state.timerId !== null || state.startedAt !== null || state.finished) return;
  state.startedAt = Date.now();
  state.timerId = setInterval(() => {
    state.secondsLeft = Math.max(
      0,
      TIME_LIMIT_SECONDS - Math.floor((Date.now() - state.startedAt) / 1000)
    );
    renderTimer();
    if (state.secondsLeft === 0) {
      stopTimer();
      state.finished = true;
      setStatus("Время вышло. Выполняется проверка.");
      check(true);
    }
  }, 250);
}

function stopTimer() {
  if (state.timerId !== null) clearInterval(state.timerId);
  state.timerId = null;
}

function renderTimer() {
  const m = Math.floor(state.secondsLeft / 60);
  const s = state.secondsLeft % 60;
  timerDisplay.textContent = `Время: ${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  timerDisplay.style.color = state.secondsLeft <= 20 ? "#d93025" : "";
}

function resetTimer() {
  stopTimer();
  state.startedAt = null;
  state.secondsLeft = TIME_LIMIT_SECONDS;
  state.finished = false;
  renderTimer();
}

function addToBag(name) {
  if (state.finished) return;
  const item = findEquipment(name);

  // Кейс/сумка — тара, а не изделие из таблицы минимальной комплектации.
  if (item?.container) {
    if ((state.stock.get(name) || 0) < 1 || state.containerSelected) return;
    startTimer();
    state.stock.set(name, state.stock.get(name) - 1);
    state.containerSelected = true;
    renderAll();
    return;
  }

  const available = state.stock.get(name) || 0;
  if (available > 0) {
    startTimer();
    state.stock.set(name, available - 1);
  } else if (!item && !DISTRACTORS.some(entry => entry[0] === name)) {
    return;
  }

  state.selected.push(name);
  renderAll();
}

function returnFromBag(name) {
  const index = state.selected.lastIndexOf(name);
  if (index !== -1) {
    state.selected.splice(index, 1);
    if (findEquipment(name)) {
      state.stock.set(name, (state.stock.get(name) || 0) + 1);
    }
  } else if (name === "Пластиковый кейс или сумка" && state.containerSelected) {
    state.containerSelected = false;
    state.stock.set(name, (state.stock.get(name) || 0) + 1);
  }
  renderAll();
}

function renderInventory() {
  const query = (el.search?.value || "").trim().toLocaleLowerCase("ru");
  el.inventory.replaceChildren();

  for (const item of EQUIPMENT) {
    if (query && !item.name.toLocaleLowerCase("ru").includes(query)) continue;
    const remaining = state.stock.get(item.name) || 0;
    if (remaining <= 0) continue;

    const card = document.createElement("div");
    card.className = "item-card";
    card.draggable = true;
    card.dataset.name = item.name;
    card.innerHTML = '<span class="emoji"></span><span class="item-name"></span><span class="quantity"></span>';
    card.querySelector(".emoji").textContent = item.icon;
    card.querySelector(".item-name").textContent = item.name;
    card.querySelector(".quantity").textContent = `×${remaining}`;
    card.addEventListener("click", () => addToBag(item.name));
    card.addEventListener("dragstart", event => {
      state.dragName = item.name;
      event.dataTransfer.setData("text/plain", item.name);
      event.dataTransfer.effectAllowed = "move";
    });
    el.inventory.append(card);
  }

  // Дополнительные неверные варианты для тренировочного задания.
  for (const [name, icon] of DISTRACTORS) {
    if (query && !name.toLocaleLowerCase("ru").includes(query)) continue;
    const card = document.createElement("div");
    card.className = "item-card";
    card.draggable = true;
    card.dataset.name = name;
    card.innerHTML = '<span class="emoji"></span><span class="item-name"></span>';
    card.querySelector(".emoji").textContent = icon;
    card.querySelector(".item-name").textContent = name;
    card.addEventListener("click", () => addToBag(name));
    card.addEventListener("dragstart", event => {
      state.dragName = name;
      event.dataTransfer.setData("text/plain", name);
      event.dataTransfer.effectAllowed = "copy";
    });
    el.inventory.append(card);
  }
}

function renderBag() {
  el.placed.replaceChildren();

  if (state.containerSelected) {
    const caseRow = document.createElement("div");
    caseRow.className = "placed-row good";
    const label = document.createElement("div");
    label.className = "placed-name";
    label.textContent = "🧰 Пластиковый кейс или сумка (тара)";
    const remove = document.createElement("button");
    remove.type = "button";
    remove.className = "quantity-button minus";
    remove.textContent = "−";
    remove.title = "Вернуть кейс в список";
    remove.addEventListener("click", () => returnFromBag("Пластиковый кейс или сумка"));
    caseRow.append(label, remove);
    el.placed.append(caseRow);
  }

  const grouped = new Map();
  for (const name of state.selected) {
    grouped.set(name, (grouped.get(name) || 0) + 1);
  }

  for (const [name, count] of grouped) {
    const row = document.createElement("div");
    row.className = "placed-row neutral";

    const info = document.createElement("div");
    info.className = "placed-info";
    const title = document.createElement("div");
    title.className = "placed-name";
    title.textContent = name;
    info.append(title);

    const quantity = document.createElement("span");
    quantity.className = "quantity";
    quantity.textContent = `×${count}`;

    const minus = document.createElement("button");
    minus.type = "button";
    minus.className = "quantity-button minus";
    minus.textContent = "−";
    minus.title = "Вернуть одну единицу в список";
    minus.addEventListener("click", () => returnFromBag(name));

    row.append(info, quantity, minus);
    el.placed.append(row);
  }

  const total = state.selected.length + (state.containerSelected ? 1 : 0);
  el.counter.textContent = `В кейсе: ${total}`;
  el.dropHint.classList.toggle("hidden", total > 0);
}

function renderAll() {
  renderInventory();
  renderBag();
}

function toggleMode() {
  state.hints = !state.hints;
  state.selected = [];
  initStock();
  resetTimer();

  if (state.hints) {
    el.modeButton.textContent = "РЕЖИМ ПОДСКАЗОК";
    el.modeButton.classList.remove("exam");
    setStatus("Режим подсказок включён. Содержимое кейса очищено.");
  } else {
    el.modeButton.textContent = "РЕЖИМ ЭКЗАМЕНА";
    el.modeButton.classList.add("exam");
    setStatus("Режим экзамена. На выполнение даётся 2 минуты 30 секунд.");
  }
  renderAll();
}

function getActualCounts() {
  const counts = new Map();
  for (const name of state.selected) counts.set(name, (counts.get(name) || 0) + 1);
  return counts;
}

function check(timeExpired = false) {
  stopTimer();
  const actual = getActualCounts();
  const wrong = [];
  let quantityErrors = 0;
  const rows = [];

  for (const [name, required] of Object.entries(REQUIRED)) {
    const count = actual.get(name) || 0;
    const ok = count === required;
    if (!ok) quantityErrors++;
    rows.push({ name, required, count, ok });
  }

  // Проверка альтернативного предмета для пункта 12.
  const markerCount = MARKER_ALTERNATIVES.reduce(
    (sum, name) => sum + (actual.get(name) || 0), 0
  );
  const markerOk = markerCount === 1;
  if (!markerOk) quantityErrors++;
  rows.push({
    name: "Маркер чёрный (синий) или карандаш",
    required: 1,
    count: markerCount,
    ok: markerOk
  });

  for (const [name, count] of actual) {
    const valid = Object.hasOwn(REQUIRED, name) || MARKER_ALTERNATIVES.includes(name);
    if (!valid) wrong.push({ name, count });
  }

  // Кейс/сумка необходимы как тара по описанию оборудования, но не входят в 12 строк таблицы оценки.
  const wrongItemCount = wrong.reduce((sum, item) => sum + item.count, 0);
  const timePenalty = timeExpired ? 20 : 0;
  const noAttemptPenalty = state.selected.length === 0 ? 20 : 0;
  const penalty = Math.min(
    MAX_SCORE,
    wrongItemCount + quantityErrors + timePenalty + noAttemptPenalty
  );
  const score = Math.max(0, MAX_SCORE - penalty);

  showResults(score, rows, wrong, {
    wrongItemCount, quantityErrors, timePenalty, noAttemptPenalty, penalty
  });

  state.selected = [];
  initStock();
  resetTimer();
  renderAll();
  setStatus("Проверка завершена. Можно начать новую попытку.");
}

function showResults(score, rows, wrong, penalties) {
  el.resultTitle.textContent = `РЕЗУЛЬТАТ: ${score} ИЗ 20 БАЛЛОВ`;

  const summary = document.createElement("p");
  summary.textContent =
    `Штраф: ${penalties.penalty}. Неверные предметы: ${penalties.wrongItemCount}; ` +
    `неверные количества: ${penalties.quantityErrors}; превышение времени: ${penalties.timePenalty}; ` +
    `задание не выполнялось: ${penalties.noAttemptPenalty}.`;

  const table = document.createElement("table");
  table.className = "result-table";
  const thead = document.createElement("thead");
  thead.innerHTML = "<tr><th>Предмет</th><th>Нужно</th><th>Положено</th><th>Результат</th></tr>";
  const tbody = document.createElement("tbody");

  for (const item of rows) {
    const tr = document.createElement("tr");
    tr.className = item.ok ? "good-row" : "bad-row";
    const status = item.ok
      ? "ПРАВИЛЬНО"
      : item.count < item.required
        ? `НЕ ХВАТАЕТ ${item.required - item.count}`
        : `ЛИШНИХ ${item.count - item.required}`;
    for (const value of [item.name, item.required, item.count, status]) {
      const td = document.createElement("td");
      td.textContent = value;
      tr.append(td);
    }
    tbody.append(tr);
  }

  for (const item of wrong) {
    const tr = document.createElement("tr");
    tr.className = "bad-row";
    for (const value of [item.name, "—", item.count, "Неверный предмет"]) {
      const td = document.createElement("td");
      td.textContent = value;
      tr.append(td);
    }
    tbody.append(tr);
  }

  table.append(thead, tbody);
  el.resultBody.replaceChildren(summary, table);
  el.resultsDialog.showModal();
}

function reset() {
  initStock();
  resetTimer();
  if (el.search) el.search.value = "";
  renderAll();
  setStatus("Список оборудования восстановлен. Таймер начнётся после первого переноса.");
}

el.search?.addEventListener("input", renderInventory);
el.modeButton.addEventListener("click", toggleMode);
el.checkButton.addEventListener("click", () => check(false));

el.resetButton.addEventListener("click", () => el.confirmDialog.showModal());
el.cancelReset.addEventListener("click", () => el.confirmDialog.close());
el.confirmReset.addEventListener("click", () => {
  el.confirmDialog.close();
  reset();
});

el.closeResults.addEventListener("click", () => el.resultsDialog.close());
el.closeResultsBottom.addEventListener("click", () => el.resultsDialog.close());

el.bag.addEventListener("dragover", event => {
  event.preventDefault();
  el.bag.classList.add("drag-over");
});
el.bag.addEventListener("dragleave", event => {
  if (!el.bag.contains(event.relatedTarget)) el.bag.classList.remove("drag-over");
});
el.bag.addEventListener("drop", event => {
  event.preventDefault();
  el.bag.classList.remove("drag-over");
  const name = event.dataTransfer.getData("text/plain") || state.dragName;
  if (name) addToBag(name);
  state.dragName = null;
});

initStock();
renderAll();
renderTimer();