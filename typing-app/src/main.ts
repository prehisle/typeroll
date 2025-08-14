import './style.css'

const WORDS = [
  'the', 'be', 'of', 'and', 'a', 'to', 'in', 'he', 'have', 'it',
  'that', 'for', 'they', 'I', 'with', 'as', 'not', 'on', 'she', 'at',
  'by', 'this', 'we', 'you', 'do', 'but', 'from', 'or', 'which', 'one',
  'would', 'all', 'will', 'there', 'say', 'who', 'make', 'when', 'can',
  'more', 'if', 'no', 'man', 'out', 'other', 'so', 'what', 'time', 'up',
  'go', 'about', 'than', 'into', 'could', 'state', 'only', 'new', 'year',
  'some', 'take', 'come', 'these', 'know', 'see', 'use', 'get', 'like',
  'then', 'first', 'any', 'work', 'now', 'may', 'such', 'give', 'over',
  'think', 'most', 'even', 'find', 'day', 'also', 'after', 'way', 'many',
  'must', 'look', 'before', 'great', 'back', 'through', 'long', 'where',
  'much', 'should', 'well', 'people', 'down', 'own', 'just', 'because',
  'good', 'each', 'those', 'feel', 'seem', 'how', 'high', 'too', 'place',
  'little', 'world', 'very', 'still', 'nation', 'hand', 'old', 'life',
  'tell', 'write', 'become', 'here', 'show', 'house', 'both', 'between',
  'need', 'mean', 'call', 'develop', 'under', 'last', 'right', 'move',
  'thing', 'general', 'school', 'never', 'same', 'another', 'begin',
  'while', 'number', 'part', 'turn', 'real', 'leave', 'might', 'want',
  'point', 'form', 'off', 'child', 'few', 'small', 'since', 'against',
  'ask', 'late', 'home', 'interest', 'large', 'person', 'end', 'open',
  'public', 'follow', 'during', 'present', 'without', 'again', 'hold',
  'govern', 'around', 'possible', 'head', 'consider', 'word', 'program',
  'problem', 'however', 'lead', 'system', 'set', 'order', 'eye', 'plan',
  'run', 'keep', 'face', 'fact', 'group', 'play', 'stand', 'increase',
  'early', 'course', 'change', 'help', 'line'
];

const wordsContainer = document.getElementById('words')!;
const caret = document.getElementById('caret')!;
const resetButton = document.getElementById('reset-button')!;
const wpmElement = document.getElementById('wpm')!;
const accuracyElement = document.getElementById('accuracy')!;

let currentLetterIndex = 0;
let testActive = false;
let startTime = 0;

function setupTest() {
  wordsContainer.innerHTML = '';
  currentLetterIndex = 0;
  testActive = false;

  wpmElement.innerText = 'WPM: 0';
  accuracyElement.innerText = 'Accuracy: 0%';

  const wordsToDisplay = Array.from({ length: 40 }, () => WORDS[Math.floor(Math.random() * WORDS.length)]);

  wordsToDisplay.join(' ').split('').forEach(char => {
    const charSpan = document.createElement('span');
    charSpan.innerText = char;
    wordsContainer.appendChild(charSpan);
  });

  const firstSpan = wordsContainer.querySelector('span');
  if (firstSpan) {
    moveCaret(firstSpan as HTMLElement);
  }
}

function calculateAndDisplayMetrics() {
    if (!startTime) return; // Don't calculate if the test hasn't started

    const endTime = Date.now();
    const durationInMinutes = (endTime - startTime) / 1000 / 60;

    const allCharSpans = wordsContainer.querySelectorAll('span');
    const typedChars = currentLetterIndex;
    if (typedChars === 0) return; // Avoid division by zero

    const correctChars = Array.from(allCharSpans).slice(0, typedChars).filter(span => span.classList.contains('correct')).length;

    const wpm = durationInMinutes > 0 ? Math.round((typedChars / 5) / durationInMinutes) : 0;
    const accuracy = Math.round((correctChars / typedChars) * 100);

    wpmElement.innerText = `WPM: ${wpm}`;
    accuracyElement.innerText = `Accuracy: ${accuracy}%`;
}


function moveCaret(targetSpan: HTMLElement) {
    const rect = targetSpan.getBoundingClientRect();
    const containerRect = wordsContainer.getBoundingClientRect();
    caret.style.left = `${rect.left - containerRect.left}px`;
    caret.style.top = `${rect.top - containerRect.top}px`;
}

document.addEventListener('keydown', (e) => {
  const allCharSpans = wordsContainer.querySelectorAll('span');
  if (currentLetterIndex >= allCharSpans.length || testActive === false && e.key !== 'Backspace' && e.key.length === 1) {
    // Test is over or has ended, only allow reset
    if (e.key !== 'Tab' && e.key !== 'Enter') e.preventDefault();
  }

  if (currentLetterIndex >= allCharSpans.length) {
      return;
  }

  if (!testActive && e.key.length === 1 && e.key !== ' ') {
    testActive = true;
    startTime = Date.now();
  }

  const currentSpan = allCharSpans[currentLetterIndex];

  if (e.key === 'Backspace') {
    if (currentLetterIndex > 0) {
      currentLetterIndex--;
      const newCurrentSpan = allCharSpans[currentLetterIndex];
      newCurrentSpan.classList.remove('correct', 'incorrect');
      moveCaret(newCurrentSpan as HTMLElement);
    }
    return;
  }

  if (e.key.length > 1) {
    return;
  };

  if (e.key === currentSpan.innerText) {
    currentSpan.classList.add('correct');
  } else {
    currentSpan.classList.add('incorrect');
  }

  currentLetterIndex++;

  if (currentLetterIndex < allCharSpans.length) {
    const nextSpan = allCharSpans[currentLetterIndex];
    moveCaret(nextSpan as HTMLElement);
  } else {
    testActive = false;
    calculateAndDisplayMetrics();
  }
});

resetButton.addEventListener('click', setupTest);

setupTest();
