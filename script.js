"use strict";

const STORAGE_KEY = "haohao-che-cui-v3";
const PAGE_SIZE = 5;

const sentences = [
  ["Ho un'amica che vive a Firenze.", "che vive a Firenze.", "CHE", "Soggetto"],
  ["Il libro che sto leggendo è molto interessante.", "che sto leggendo", "CHE", "Complemento oggetto"],
  ["Conosco un ragazzo che parla quattro lingue.", "che parla quattro lingue.", "CHE", "Soggetto"],
  ["La torta che hai preparato è buonissima.", "che hai preparato", "CHE", "Complemento oggetto"],
  ["Il professore che insegna italiano è molto simpatico.", "che insegna italiano", "CHE", "Soggetto"],
  ["Il film che abbiamo visto ieri mi è piaciuto molto.", "che abbiamo visto ieri", "CHE", "Complemento oggetto"],
  ["Ho una vicina che lavora in ospedale.", "che lavora in ospedale.", "CHE", "Soggetto"],
  ["La borsa che ho comprato la settimana scorsa era in saldo.", "che ho comprato la settimana scorsa", "CHE", "Complemento oggetto"],
  ["La persona che mi ha chiamato stamattina era molto gentile.", "che mi ha chiamato stamattina", "CHE", "Soggetto"],
  ["Il ristorante che mi hai consigliato è davvero buono.", "che mi hai consigliato", "CHE", "Complemento oggetto"],
  ["La persona a cui ho scritto ieri non mi ha ancora risposto.", "a cui ho scritto ieri", "A CUI", "Complemento indiretto con A"],
  ["Il problema di cui stiamo discutendo non è facile.", "di cui stiamo discutendo", "DI CUI", "Complemento indiretto con DI"],
  ["L'amica con cui sono andata al cinema vive vicino a casa mia.", "con cui sono andata al cinema", "CON CUI", "Complemento indiretto con CON"],
  ["La città in cui vivo è molto tranquilla.", "in cui vivo", "IN CUI", "Complemento indiretto con IN"],
  ["La ragazza di cui ti ho parlato ieri è una mia collega.", "di cui ti ho parlato ieri", "DI CUI", "Complemento indiretto con DI"],
  ["Questo è l'argomento su cui dobbiamo riflettere.", "su cui dobbiamo riflettere.", "SU CUI", "Complemento indiretto con SU"],
  ["Il corso a cui mi sono iscritta inizia lunedì.", "a cui mi sono iscritta", "A CUI", "Complemento indiretto con A"],
  ["Il progetto di cui si occupa Marco è molto interessante.", "di cui si occupa Marco", "DI CUI", "Complemento indiretto con DI"],
  ["Il collega con cui lavoro è molto disponibile.", "con cui lavoro", "CON CUI", "Complemento indiretto con CON"],
  ["Questo è il motivo per cui sono arrivata in ritardo.", "per cui sono arrivata in ritardo.", "PER CUI", "Complemento indiretto con PER"],
  ["È un argomento di cui so molto poco.", "di cui so molto poco.", "DI CUI", "Complemento indiretto con DI"],
  ["La sedia su cui ho lasciato la borsa è vicino alla finestra.", "su cui ho lasciato la borsa", "SU CUI", "Complemento indiretto con SU"],
  ["Questa è la scuola in cui ho studiato da bambina.", "in cui ho studiato da bambina.", "IN CUI", "Complemento indiretto con IN"],
  ["La persona di cui mi fido di più è mia sorella.", "di cui mi fido di più", "DI CUI", "Complemento indiretto con DI"],
  ["Non capisco il motivo per cui lui è così arrabbiato.", "per cui lui è così arrabbiato.", "PER CUI", "Complemento indiretto con PER"],
  ["Questo è il libro di cui abbiamo parlato durante la lezione.", "di cui abbiamo parlato durante la lezione.", "DI CUI", "Complemento indiretto con DI"],
  ["La città di cui ti parlavo ieri si trova nel sud Italia.", "di cui ti parlavo ieri", "DI CUI", "Complemento indiretto con DI"],
  ["Ho visto un documentario di cui non ricordo il titolo.", "di cui non ricordo il titolo.", "DI CUI", "Complemento indiretto con DI"],
  ["Questa è la situazione di cui avevo paura.", "di cui avevo paura.", "DI CUI", "Complemento indiretto con DI"],
  ["Questo è uno dei problemi di cui dobbiamo parlare.", "di cui dobbiamo parlare.", "DI CUI", "Complemento indiretto con DI"]
].map(([sentence, relative, pronoun, role], index) => {
  const words = sentence.split(" ");
  const relativeWords = relative.split(" ");
  const start = words.findIndex((_, i) => words.slice(i, i + relativeWords.length).join(" ") === relative);
  const correctWordIndexes = Array.from({ length: relativeWords.length }, (_, wordIndex) => start + wordIndex);
  return { id: index + 1, sentence, relative, pronoun, role, words, correctWordIndexes };
});

const reconstructions = [
  { source: "La persona a cui ho scritto ieri...", answers: ["Ho scritto alla persona ieri", "Ieri ho scritto alla persona", "Ho scritto ieri alla persona"], display: "Ho scritto alla persona ieri.", note: "scrivere a qualcuno → alla persona" },
  { source: "Il problema di cui stiamo discutendo...", answers: ["Stiamo discutendo del problema", "Del problema stiamo discutendo"], display: "Stiamo discutendo del problema.", note: "discutere di qualcosa → del problema" },
  { source: "L'amica con cui sono andata al cinema...", answers: ["Sono andata al cinema con l'amica", "Con l'amica sono andata al cinema", "Sono andata con l'amica al cinema"], display: "Sono andata al cinema con l'amica.", note: "andare con qualcuno → con l'amica" },
  { source: "La città in cui vivo...", answers: ["Vivo nella città", "Nella città vivo"], display: "Vivo nella città.", note: "vivere in un luogo → nella città" },
  { source: "La ragazza di cui ti ho parlato ieri...", answers: ["Ti ho parlato della ragazza ieri", "Ieri ti ho parlato della ragazza", "Ti ho parlato ieri della ragazza"], display: "Ti ho parlato della ragazza ieri.", note: "parlare di qualcuno → della ragazza" },
  { source: "L'argomento su cui dobbiamo riflettere...", answers: ["Dobbiamo riflettere sull'argomento", "Sull'argomento dobbiamo riflettere"], display: "Dobbiamo riflettere sull'argomento.", note: "riflettere su qualcosa → sull'argomento" },
  { source: "Il corso a cui mi sono iscritta...", answers: ["Mi sono iscritta al corso", "Al corso mi sono iscritta"], display: "Mi sono iscritta al corso.", note: "iscriversi a qualcosa → al corso" },
  { source: "Il progetto di cui si occupa Marco...", answers: ["Marco si occupa del progetto", "Del progetto si occupa Marco"], display: "Marco si occupa del progetto.", note: "occuparsi di qualcosa → del progetto" },
  { source: "La sedia su cui ho lasciato la borsa...", answers: ["Ho lasciato la borsa sulla sedia", "Sulla sedia ho lasciato la borsa"], display: "Ho lasciato la borsa sulla sedia.", note: "lasciare qualcosa su un posto → sulla sedia" },
  { source: "Il motivo per cui sono arrivata in ritardo...", answers: ["Sono arrivata in ritardo per questo motivo", "Per questo motivo sono arrivata in ritardo", "Sono arrivata in ritardo per il motivo", "Per il motivo sono arrivata in ritardo", "Sono arrivata in ritardo per un motivo", "Per un motivo sono arrivata in ritardo"], display: "Sono arrivata in ritardo per questo motivo / per il motivo / per un motivo.", note: "per indica la causa → per questo motivo / per il motivo / per un motivo" }
];

const partConfig = {
  1: { title: "Trova la frase relativa", it: "Leggi le frasi e individua la frase relativa. Tocca tutte le parole che fanno parte della frase relativa.", zh: "阅读句子，找出关系从句。点击所有组成关系从句的单词。" },
  2: { title: "Qual è il pronome relativo?", it: "Individua il pronome relativo usato nella frase.", zh: "找出句子中的关系代词。" },
  3: { title: "Qual è la funzione del pronome relativo?", it: "Indica la funzione del pronome relativo nella frase relativa.", zh: "判断关系代词在关系从句中的作用。" },
  4: { title: "Ricostruisci la frase", it: "Ricostruisci la frase semplice da cui deriva la frase relativa.", zh: "把关系从句还原成原来的简单句。", tip: "Scrivi una frase completa. Maiuscole e punteggiatura finale non cambiano il risultato." }
};

const defaultState = () => ({
  part: 1,
  page: 0,
  answers: { 1: {}, 2: {}, 3: {}, 4: {} },
  completed: { 1: false, 2: false, 3: false, 4: false },
  checked: { 1: false, 2: false, 3: false, 4: false },
  review: []
});

let state = loadState();
const elements = {
  exercise: document.querySelector("#exercise-screen"), result: document.querySelector("#result-screen"),
  kicker: document.querySelector("#part-kicker"), title: document.querySelector("#part-title"),
  instructionIt: document.querySelector("#instruction-it"), instructionZh: document.querySelector("#instruction-zh"),
  tip: document.querySelector("#part-tip"), status: document.querySelector("#page-status"), questions: document.querySelector("#questions"),
  feedback: document.querySelector("#part-feedback"), back: document.querySelector("#back-button"), pageNext: document.querySelector("#page-next-button"),
  check: document.querySelector("#check-button"), continue: document.querySelector("#continue-button"), restart: document.querySelector("#restart-button"),
  reviewSection: document.querySelector("#review-section"), reviewList: document.querySelector("#review-list")
};

function loadState() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    return saved && saved.answers ? { ...defaultState(), ...saved } : defaultState();
  } catch { return defaultState(); }
}

function saveState() { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); }

function normalize(text) {
  return text.normalize("NFKC").toLocaleLowerCase("it-IT").replace(/[。．.!！?？,，;；:：]+/g, " ").replace(/[’‘`´]/g, "'").replace(/\s+/g, " ").trim();
}

function isTextCorrect(value, accepted) { const normalized = normalize(value); return accepted.some(answer => normalize(answer) === normalized); }

function totalPages() { return Math.ceil((state.part === 4 ? reconstructions.length : sentences.length) / PAGE_SIZE); }
function itemsForPage() { const source = state.part === 4 ? reconstructions : sentences; return source.slice(state.page * PAGE_SIZE, (state.page + 1) * PAGE_SIZE); }

function answerFor(part, id) { return state.answers[part][id]; }
function setAnswer(part, id, value) {
  state.answers[part][id] = value;
  state.checked[part] = false;
  state.completed[part] = false;
  saveState();
}

function isCorrect(part, item, answer) {
  if (part === 1) {
    return Array.isArray(answer)
      && answer.length === item.correctWordIndexes.length
      && item.correctWordIndexes.every(index => answer.includes(index));
  }
  if (part === 2) return answer === item.pronoun;
  if (part === 3) return answer === item.role;
  return typeof answer === "string" && isTextCorrect(answer, item.answers);
}

function render() {
  if (state.part === 5) return renderResult();
  const config = partConfig[state.part];
  elements.exercise.hidden = false;
  elements.result.hidden = true;
  elements.kicker.textContent = `Parte ${state.part} di 4`;
  elements.title.textContent = config.title;
  elements.instructionIt.textContent = config.it;
  elements.instructionZh.textContent = config.zh;
  elements.tip.hidden = !config.tip;
  elements.tip.textContent = config.tip || "";
  elements.status.textContent = `Gruppo ${state.page + 1} di ${totalPages()}`;
  elements.feedback.hidden = true;
  elements.questions.replaceChildren(...itemsForPage().map((item, offset) => renderQuestion(item, state.page * PAGE_SIZE + offset)));
  updateNavigation();
  updateProgress();
  window.scrollTo({ top: document.querySelector(".app-shell").offsetTop - 8, behavior: "smooth" });
}

function renderQuestion(item, index) {
  const id = state.part === 4 ? index + 1 : item.id;
  const answer = answerFor(state.part, id);
  const card = document.createElement("article");
  card.className = "question-card";
  card.dataset.id = id;
  if (state.checked[state.part]) card.classList.add(isCorrect(state.part, item, answer) ? "is-correct" : "is-error");
  const number = document.createElement("span");
  number.className = "question-number";
  number.textContent = id;
  card.append(number);

  if (state.part === 1) renderWordSelectionQuestion(card, item, answer);
  else if (state.part === 2) renderChoiceQuestion(card, item, answer, ["CHE", "DI CUI", "A CUI", "CON CUI", "SU CUI", "IN CUI", "PER CUI"]);
  else if (state.part === 3) {
    const choices = item.pronoun === "CHE"
      ? ["Soggetto", "Complemento oggetto"]
      : ["Complemento indiretto con DI", "Complemento indiretto con A", "Complemento indiretto con CON", "Complemento indiretto con SU", "Complemento indiretto con IN", "Complemento indiretto con PER"];
    renderChoiceQuestion(card, item, answer, choices);
  } else renderTextQuestion(card, item, answer, id);
  return card;
}

function renderWordSelectionQuestion(card, item, answer) {
  const row = document.createElement("div");
  row.className = "token-row";
  row.setAttribute("aria-label", item.sentence);
  item.words.forEach((word, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "word-token";
    button.textContent = word;
    const isSelected = Array.isArray(answer) && answer.includes(index);
    button.setAttribute("aria-pressed", isSelected ? "true" : "false");
    if (isSelected) button.classList.add("is-selected");
    button.addEventListener("click", () => toggleWord(item.id, index));
    row.append(button);
  });
  card.append(row);
}

function toggleWord(id, index) {
  const current = Array.isArray(answerFor(1, id)) ? answerFor(1, id) : [];
  const next = current.includes(index)
    ? current.filter(selectedIndex => selectedIndex !== index)
    : [...current, index].sort((a, b) => a - b);
  setAnswer(1, id, next);
  renderCurrentPageOnly();
}

function renderChoiceQuestion(card, item, answer, choices) {
  const sentence = document.createElement("p");
  sentence.className = "sentence";
  sentence.textContent = item.sentence;
  card.append(sentence);
  const grid = document.createElement("div");
  grid.className = "choice-grid";
  choices.forEach(choice => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "choice-button";
    button.textContent = choice;
    button.setAttribute("aria-pressed", answer === choice ? "true" : "false");
    if (answer === choice) button.classList.add("is-selected");
    button.addEventListener("click", () => { setAnswer(state.part, item.id, choice); renderCurrentPageOnly(); });
    grid.append(button);
  });
  card.append(grid);
}

function renderTextQuestion(card, item, answer, id) {
  const source = document.createElement("p");
  source.className = "sentence";
  source.textContent = item.source;
  const label = document.createElement("label");
  label.className = "field-label";
  label.htmlFor = `answer-${id}`;
  label.textContent = "Frase semplice:";
  const input = document.createElement("input");
  input.id = `answer-${id}`;
  input.className = "text-answer";
  input.type = "text";
  input.autocomplete = "off";
  input.spellcheck = false;
  input.value = answer || "";
  input.addEventListener("input", event => {
    setAnswer(4, id, event.target.value);
    card.classList.remove("is-error", "is-correct");
    updateNavigation();
  });
  input.addEventListener("keydown", event => { if (event.key === "Enter") event.preventDefault(); });
  card.append(source, label, input);
  if (state.checked[4] && isCorrect(4, item, answer)) {
    const note = document.createElement("p");
    note.className = "origin-note";
    note.textContent = item.note;
    card.append(note);
  }
}

function renderCurrentPageOnly() {
  elements.questions.replaceChildren(...itemsForPage().map((item, offset) => renderQuestion(item, state.page * PAGE_SIZE + offset)));
  elements.feedback.hidden = true;
  updateNavigation();
}

function allAnswered() {
  const source = state.part === 4 ? reconstructions : sentences;
  return source.every((item, index) => {
    const id = state.part === 4 ? index + 1 : item.id;
    const answer = answerFor(state.part, id);
    return state.part === 1 ? Array.isArray(answer) && answer.length > 0 : typeof answer === "string" && answer.trim();
  });
}

function updateNavigation() {
  const lastPage = state.page === totalPages() - 1;
  elements.back.disabled = state.part === 1 && state.page === 0;
  elements.back.textContent = state.page > 0 ? "Indietro" : state.part > 1 ? "Parte precedente" : "Indietro";
  elements.pageNext.hidden = lastPage;
  elements.check.hidden = !lastPage || state.completed[state.part];
  elements.check.disabled = !allAnswered();
  elements.continue.hidden = !state.completed[state.part] || !lastPage;
  if (lastPage && !allAnswered()) {
    elements.feedback.hidden = false;
    elements.feedback.className = "part-feedback";
    elements.feedback.textContent = "Completa tutti i gruppi prima di controllare.";
  }
}

function goBack() {
  if (state.page > 0) state.page -= 1;
  else if (state.part > 1) { state.part -= 1; state.page = totalPages() - 1; }
  saveState(); render();
}

function goPageNext() { state.page += 1; saveState(); render(); }

function checkPart() {
  if (!allAnswered()) return;
  const source = state.part === 4 ? reconstructions : sentences;
  const wrong = [];
  source.forEach((item, index) => {
    const id = state.part === 4 ? index + 1 : item.id;
    if (!isCorrect(state.part, item, answerFor(state.part, id))) wrong.push({ item, id });
  });
  state.checked[state.part] = true;
  if (wrong.length) {
    wrong.forEach(({ item, id }) => addReview(state.part, item, id));
    const firstWrongIndex = state.part === 4 ? wrong[0].id - 1 : wrong[0].item.id - 1;
    state.page = Math.floor(firstWrongIndex / PAGE_SIZE);
    saveState(); render();
    elements.feedback.hidden = false;
    elements.feedback.className = "part-feedback error";
    elements.feedback.textContent = "Controlla gli elementi evidenziati e prova ancora.";
  } else {
    state.completed[state.part] = true;
    saveState(); renderCurrentPageOnly();
    elements.feedback.hidden = false;
    elements.feedback.className = "part-feedback success";
    elements.feedback.textContent = "Bravissimo/a! Tutto corretto! 🎉";
  }
}

function addReview(part, item, id) {
  const key = `${part}-${id}`;
  if (state.review.some(entry => entry.key === key)) return;
  let prompt = part === 4 ? item.source : item.sentence;
  let correct = part === 1 ? item.relative : part === 2 ? item.pronoun : part === 3 ? item.role : item.display;
  state.review.push({ key, prompt, correct });
}

function continuePart() {
  if (!state.completed[state.part]) return;
  state.part += 1;
  state.page = 0;
  saveState(); render();
}

function updateProgress() {
  document.querySelectorAll("[data-progress]").forEach(step => {
    const number = Number(step.dataset.progress);
    step.classList.toggle("is-active", number === state.part);
    step.classList.toggle("is-complete", number < state.part);
  });
}

function renderResult() {
  elements.exercise.hidden = true;
  elements.result.hidden = false;
  updateProgress();
  elements.reviewSection.hidden = state.review.length === 0;
  elements.reviewList.replaceChildren(...state.review.map(entry => {
    const item = document.createElement("div");
    item.className = "review-item";
    const prompt = document.createElement("p");
    prompt.textContent = entry.prompt;
    const answer = document.createElement("p");
    answer.className = "review-answer";
    answer.textContent = `✓ ${entry.correct}`;
    item.append(prompt, answer);
    return item;
  }));
  window.scrollTo({ top: document.querySelector(".app-shell").offsetTop - 8, behavior: "smooth" });
}

function restart() {
  state = defaultState();
  localStorage.removeItem(STORAGE_KEY);
  render();
}

elements.back.addEventListener("click", goBack);
elements.pageNext.addEventListener("click", goPageNext);
elements.check.addEventListener("click", checkPart);
elements.continue.addEventListener("click", continuePart);
elements.restart.addEventListener("click", restart);
document.addEventListener("keydown", event => {
  if (event.key === "Enter" && event.target.matches("input")) event.preventDefault();
});

if (state.part < 1 || state.part > 5) state = defaultState();
render();
