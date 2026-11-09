// 주제별 한국어 명언 목록. 각 항목은 문장(text)과 저자(author)를 가진다.
const quotes = [
  { text: "인생에서 가장 큰 영광은 넘어지지 않는 데 있지 않다. 넘어질 때마다 다시 일어서는 데 있다.", author: "넬슨 만델라" },
  { text: "삶은 자전거를 타는 것과 같다. 균형을 잡으려면 계속 움직여야 한다.", author: "알베르트 아인슈타인" },
  { text: "꿈을 이룰 수 있다고 믿는다면, 이미 절반은 이룬 것이다.", author: "월트 디즈니" },
  { text: "당신의 시간은 한정되어 있다. 다른 사람의 삶을 사느라 그 시간을 낭비하지 마라.", author: "스티브 잡스" },
  { text: "삶은 대담한 모험이거나, 아무것도 아니다.", author: "헬렌 켈러" },
  { text: "천천히 가더라도 멈추지만 않는다면, 결국 도착한다.", author: "공자" },
  { text: "세상에서 보고 싶은 변화가 있다면, 당신이 그 변화가 되어라.", author: "마하트마 간디" },
  { text: "당신이 할 수 있는 가장 큰 모험은 꿈꾸던 삶을 직접 사는 것이다.", author: "오프라 윈프리" },
  { text: "나는 실패한 게 아니다. 작동하지 않는 방법을 만 가지 찾아냈을 뿐이다.", author: "토머스 에디슨" },
  { text: "성공이란 열정을 잃지 않고 실패에서 실패로 걸어가는 능력이다.", author: "윈스턴 처칠" },
  { text: "할 수 있다고 생각하든 할 수 없다고 생각하든, 당신의 생각이 맞다.", author: "헨리 포드" },
  { text: "탁월함은 한 번의 행동이 아니라 습관이다.", author: "아리스토텔레스" },
  { text: "오늘 할 수 있는 일을 내일로 미루지 마라.", author: "벤저민 프랭클린" },
  { text: "당신이 간절히 원할 때, 온 우주는 그 소망이 이루어지도록 협력한다.", author: "파울로 코엘료" },
  { text: "행복은 준비된 사람에게 찾아오는 우연이다.", author: "세네카" },
  { text: "한 번의 발차기를 만 번 연습한 사람을 두려워하라.", author: "브루스 리" },
  { text: "미래는 자신의 꿈을 아름답다고 믿는 사람의 것이다.", author: "엘리너 루즈벨트" },
  { text: "작은 일의 성취가 큰 자신감을 만든다.", author: "데일 카네기" },
  { text: "시작이 반이다. 나머지는 꾸준함이 채운다.", author: "플라톤" },
  { text: "지금 이 순간에 최선을 다하는 사람이 내일을 바꾼다.", author: "법정" },
  { text: "넘어짐은 끝이 아니다. 일어서지 않는 것이 끝이다.", author: "마이클 조던" },
  { text: "당신이 되는 가장 좋은 방법은 당신이 되고 싶은 사람처럼 행동하는 것이다.", author: "소크라테스" }
];

// 사용자가 직접 추가한 명언만 따로 모아 브라우저에 저장한다.
const STORAGE_KEY = "custom-quotes";
const THEME_KEY = "quote-theme";
const customQuotes = [];

// 직전에 보여 준 명언의 위치. 처음에는 아직 고르지 않았다는 뜻으로 -1을 둔다.
let currentIndex = -1;

const card = document.getElementById("quote-card");
const quoteText = document.getElementById("quote-text");
const quoteAuthor = document.getElementById("quote-author");
const generateButton = document.getElementById("generate-btn");
const shareButton = document.getElementById("share-btn");
const addForm = document.getElementById("add-form");
const newTextInput = document.getElementById("new-text");
const newAuthorInput = document.getElementById("new-author");
const statusText = document.getElementById("status");
const lightThemeButton = document.getElementById("theme-light-btn");
const darkThemeButton = document.getElementById("theme-dark-btn");

// 브라우저에 저장된 내 명언을 읽어 목록 뒤에 붙인다.
function loadCustomQuotes() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (!Array.isArray(saved)) {
      return;
    }

    saved.forEach(function (item) {
      if (!item || typeof item.text !== "string" || item.text.trim() === "") {
        return;
      }

      const quote = {
        text: item.text.trim(),
        author: item.author && item.author.trim() ? item.author.trim() : "익명"
      };
      customQuotes.push(quote);
      quotes.push(quote);
    });
  } catch (error) {
    // 저장된 값이 깨져 있으면 기본 명언만 사용한다.
  }
}

// 내 명언 목록 전체를 브라우저에 다시 기록한다.
function saveCustomQuotes() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(customQuotes));
}

// 같은 문장과 저자가 이미 있는지 확인한다.
function hasSameQuote(text, author) {
  return quotes.some(function (quote) {
    return quote.text === text && quote.author === author;
  });
}

// 화면 아래 안내 문구를 잠깐 보여 준다.
let statusTimer = null;

function setStatus(message) {
  statusText.textContent = message;
  window.clearTimeout(statusTimer);
  statusTimer = window.setTimeout(function () {
    statusText.textContent = "";
  }, 2500);
}

// 라이트/다크 버튼을 현재 테마에 맞게 표시하고 선택값을 저장한다.
function applyTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  lightThemeButton.classList.toggle("is-active", theme === "light");
  darkThemeButton.classList.toggle("is-active", theme === "dark");
  lightThemeButton.setAttribute("aria-pressed", String(theme === "light"));
  darkThemeButton.setAttribute("aria-pressed", String(theme === "dark"));
  localStorage.setItem(THEME_KEY, theme);
}

// 직전 명언과 겹치지 않는 번호를 무작위로 고른다.
function pickDifferentIndex() {
  let nextIndex = currentIndex;

  while (nextIndex === currentIndex) {
    nextIndex = Math.floor(Math.random() * quotes.length);
  }

  return nextIndex;
}

// 고른 명언을 화면에 넣고, 현재 번호를 기억한다.
function renderQuote(index) {
  quoteText.textContent = quotes[index].text;
  quoteAuthor.textContent = quotes[index].author;
  currentIndex = index;
}

// style.css의 transition 시간(0.35초)과 맞춘 값이다.
const FADE_MS = 350;

// 명언이 바뀌는 도중에는 다음 클릭을 잠시 기억만 해 둔다.
let isAnimating = false;
let hasQueuedClick = false;

// 카드가 사라진 뒤 문장을 바꾸고, 다시 나타나게 한다.
function showQuoteWithFade() {
  if (isAnimating) {
    hasQueuedClick = true;
    return;
  }

  isAnimating = true;
  const nextIndex = pickDifferentIndex();
  card.classList.add("is-fading");

  // 완전히 사라진 뒤에 글자를 갈아끼운다.
  window.setTimeout(function () {
    renderQuote(nextIndex);
    card.classList.remove("is-fading");

    // 다시 나타난 뒤에 다음 클릭을 처리한다.
    window.setTimeout(function () {
      isAnimating = false;

      if (hasQueuedClick) {
        hasQueuedClick = false;
        showQuoteWithFade();
      }
    }, FADE_MS);
  }, FADE_MS);
}

// 지금 화면에 있는 명언을 공유한다. 공유 창이 없으면 문장을 복사한다.
async function shareCurrentQuote() {
  const message = "“" + quoteText.textContent + "” — " + quoteAuthor.textContent;

  if (navigator.share) {
    try {
      await navigator.share({ title: "오늘의 명언", text: message });
      setStatus("명언을 공유했습니다.");
      return;
    } catch (error) {
      if (error && error.name === "AbortError") {
        return;
      }
    }
  }

  try {
    await navigator.clipboard.writeText(message);
    setStatus("명언을 복사했습니다. 원하는 곳에 붙여 넣으세요.");
  } catch (error) {
    setStatus("이 브라우저에서는 공유할 수 없습니다.");
  }
}

// 입력한 명언을 목록과 브라우저 저장소에 넣는다.
function addQuote(event) {
  event.preventDefault();

  const text = newTextInput.value.trim();
  const author = newAuthorInput.value.trim() || "익명";

  if (text === "") {
    setStatus("명언을 입력해 주세요.");
    return;
  }

  if (hasSameQuote(text, author)) {
    setStatus("이미 있는 명언입니다.");
    return;
  }

  const quote = { text: text, author: author };
  customQuotes.push(quote);
  quotes.push(quote);
  saveCustomQuotes();

  // 방금 저장한 명언을 바로 보여 준다.
  isAnimating = false;
  hasQueuedClick = false;
  card.classList.remove("is-fading");
  renderQuote(quotes.length - 1);

  addForm.reset();
  setStatus("명언을 저장했습니다.");
}

loadCustomQuotes();

const savedTheme = localStorage.getItem(THEME_KEY);
applyTheme(savedTheme === "dark" ? "dark" : "light");

// 페이지를 열면 명언 하나를 바로 보여 준다.
renderQuote(pickDifferentIndex());

generateButton.addEventListener("click", showQuoteWithFade);
shareButton.addEventListener("click", shareCurrentQuote);
addForm.addEventListener("submit", addQuote);
lightThemeButton.addEventListener("click", function () {
  applyTheme("light");
});
darkThemeButton.addEventListener("click", function () {
  applyTheme("dark");
});
