let runningTotal = 0;
let buffer = "0";
let previousOperator;

const result_screen = document.querySelector('.result-screen');

function buttonClick(value) {
    if (isNaN(value)) {
        handleSymbol(value);
    } else {
        handleNumber(value);
    }

    if (isValidInput(value)) playClickSound();

    result_screen.innerText = buffer;
}

function handleSymbol(symbol) {
    switch (symbol) {
        case 'C':
            buffer = '0';
            runningTotal = 0;
            break;
        case '=':
            if (previousOperator === null) {
                return;
            }

            flushOperation(parseInt(buffer));
            previousOperator = null;
            buffer = runningTotal;
            runningTotal = 0;
            break;
        case '←':
            if (buffer.length === 1) {
                buffer = '0';
            } else {
                buffer = buffer.substring(0, buffer.length - 1);
            }
            break;
        case '+':
        case '−':
        case '×':
        case '÷':
            handleMath(symbol);
            break;
    }
}

function handleMath(symbol) {
    if (buffer === '0') {
        return;
    }

    const intBuffer = parseInt(buffer);

    if (runningTotal === 0) {
        runningTotal = intBuffer;
    } else {
        flushOperation(intBuffer);
    }
    previousOperator = symbol;
    buffer = '0';
}

function flushOperation(intBuffer) {
    if (previousOperator === '+') {
        runningTotal += intBuffer;
    } else if (previousOperator === '−') {
        runningTotal -= intBuffer;
    } else if (previousOperator === '×') {
        runningTotal *= intBuffer;
    } else if (previousOperator === '÷') {
        runningTotal /= intBuffer;
    }
}

function handleNumber(numberString) {
    if (buffer === "0") {
        buffer = numberString;
    } else {
        buffer += numberString;
    }
}

function init() {
    document.querySelectorAll('.calc-button').forEach(button => {
        const value = button.innerText;

        button.addEventListener("mousedown", () => holdStart(value));
        button.addEventListener("mouseup", holdStop);
        button.addEventListener("mouseleave", holdStop); // in case the mouse leaves the button
    });

}

init();

const pressedKeys = new Set;

document.addEventListener("keydown", function(event) {
    const active = document.activeElement;
    const isButton = active && active.classList.contains("calc-button");

    if (isButton) return;
    
    const key = normalizeKey(event.key);
    buttonClick(key);

    if (pressedKeys.has(key)) return;

    pressedKeys.add(key);
    highlightButton(key);
});

document.addEventListener("keyup", function(event) {
    const key = normalizeKey(event.key);
    pressedKeys.delete(key);
    unhighlightButton(key); // remove "pressed"
});

function normalizeKey (key) {
    if (key === "Enter" || key === "=") return "=";
    if (key === "Backspace") return "←";
    if (key === "Escape") return "C";
    if (key === "*") return "×";
    if (key === "/") return "÷";
    if (key === "-") return "−";
    return key; // "+" is still "+"
}

function highlightButton(keyText) {
    const buttons = document.querySelectorAll(".calc-button");
    buttons.forEach(button => {
        if (button.innerText === keyText) {
            button.classList.add("pressed");
        }
    });
}

function unhighlightButton(keyText) {
    const buttons = document.querySelectorAll(".calc-button");
    buttons.forEach(button => {
        if (button.innerText === keyText) {
            button.classList.remove("pressed");
        }
    });
}

let holdInterval = null;

function holdStart(value) {
    buttonClick(value);
    holdInterval = setInterval(() => {
        buttonClick(value);
    }, 150); // adjust this delay for spam speed
}

function holdStop() {
    clearInterval(holdInterval);
    holdInterval = null;
}

const clickSound = new Audio("sounds/classic-click.wav");
const hoverSound = new Audio("sounds/keyboard.mp3");

function playClickSound() {
    const click = clickSound.cloneNode();
    click.volume = 0.5;
    click.play();
}

document.querySelectorAll('.calc-button').forEach(button => {
    button.addEventListener('mouseenter', () => {
        const hover = hoverSound.cloneNode(); // allow overlap
        hover.volume = 0.5;
        hover.play();
    });
});

function isValidInput(value) {
    if (!isNaN(value)) return true;

    switch (value) {
        case 'C':
        case '=':
        case '←':
        case '+':
        case '−':
        case '×':
        case '÷':
            return true;
    }

    return false;
}

document.addEventListener("DOMContentLoaded", function () {
  const toggleBtn = document.getElementById('theme-toggle');
  if (!toggleBtn) return; // if the button isn't found, bail

  const icon = toggleBtn.querySelector('i');

  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "dark") {
    document.documentElement.classList.add("dark-mode");
    icon.classList.replace("fa-moon", "fa-sun");
  }

  toggleBtn.addEventListener("click", () => {
    const isDark = document.documentElement.classList.toggle("dark-mode");
    icon.classList.toggle("fa-sun");
    icon.classList.toggle("fa-moon");
    localStorage.setItem("theme", isDark ? "dark" : "light");
  });
});