import create from './utils/create.js';
import * as session from './utils/session.js';
import language from './keys.js';
import Key from './Key.js';

const content = create('main', '', 
[create('h1', 'title', 'Virtual keyboard'),
create('p', 'hint', 'Keyboard for OS Windows. Use [Ctrl] + [Alt] to switch language.')]);

export default class Keyboard {
  constructor(rowsOrder, lang) {
    this.rowsOrder = rowsOrder;
    this.pressed = {};
    this.capsLockOn = false;
    this.baseLang = language[lang];
    this.langCode = lang;
  }

  init() {
    this.textInput = create('textarea', 'output', null, content, ['placeholder', 'Text area for keyboard. Please, type any text.']);
    this.container = create('div', 'keyboard', null, content, ['language', this.langCode]);
    document.body.prepend(content);
    return this;
  }

  generateLayuot() {
    this.Buttons = [];
    this.rowsOrder.forEach((row, index) => {
      const rowElement = create('div', 'keyboard-row', null, this.container, ['row', index + 1]);
      rowElement.style.gridTemplateColumns = `repeat(${row.length}, 1fr)`;
      row.forEach((code) => {
        const keyValue = this.baseLang.find((key) => key.code === code);

        if (keyValue) {
          const button = new Key(keyValue);
          this.Buttons.push(button);
          rowElement.appendChild(button.div);
        }
      });
    });

    document.addEventListener('keydown', this.handleButton);
    document.addEventListener('keyup', this.handleButton);
    this.container.onmousedown = this.mouseClick;
    this.container.onmouseup = this.mouseClick;
  }

  mouseClick = (e) => {
    e.stopPropagation();
    const keyDiv = e.target.closest('.board-key');

    if (!keyDiv) {
      return;
    }

    const code = keyDiv.dataset.code;
    keyDiv.addEventListener('mouseleave', this.resetButtonState);
    this.handleButton({ code, type: e.type });
  };

  //#region Обработка нажатий кнопок
  handleButton = (e) => {
    if (e.stopPropagation) e.stopPropagation();
    const code = e.code;
    const type = e.type;
    const keyObj = this.Buttons.find((key) => key.code === code);

    if (!keyObj) {
      return;
    }

    this.textInput.focus();

    if (type.match(/keydown|mousedown/)) {
      if (!type.match(/mouse/)) {
        e.preventDefault();
      }

      if (code.match(/Shift/)) {
        this.shiftKey = true;
      }

      if (this.shiftKey) {
        this.switchUpperCase(true);
      }

      if (code.match(/Control|Alt|Caps/) && e.repeat) {
        return;
      }

      if (code.match(/Control/)) {
        this.ctrKey = true;
      }

      if (code.match(/Alt/)) {
        this.altKey = true;
      }

      if (code.match(/Control/) && this.altKey) {
        this.switchLanguage();
      }

      if (code.match(/Alt/) && this.ctrKey) {
        this.switchLanguage();
      }

      keyObj.div.classList.add('active');

      if (code.match(/Caps/) && !this.capsLockOn) {
        this.capsLockOn = true;
        this.switchUpperCase(true);
      } else if (code.match(/Caps/) && this.capsLockOn) {
        this.capsLockOn = false;
        this.switchUpperCase(false);
        keyObj.div.classList.remove('active');
      }

      if (!this.capsLockOn) {
        this.printToOutput(keyObj, this.shiftKey ? keyObj.shift : keyObj.lowerCase);
      } else if (this.capsLockOn) {
        if (this.shiftKey) {
          this.printToOutput(keyObj, keyObj.afterShift.innerHTML ? keyObj.shift : keyObj.lowerCase);
        } else {
          this.printToOutput(keyObj, !keyObj.afterShift.innerHTML ? keyObj.shift : keyObj.lowerCase);
        }
      }

      this.pressed[keyObj.code] = keyObj;
    } else if (e.type.match(/keyup|mouseup/)) {
      this.resetPressedButtons(code);

      if (code.match(/Shift/)) {
        this.shiftKey = false;
        this.switchUpperCase(false);
      }

      if (code.match(/Control/)) {
        this.ctrKey = false;
      }

      if (code.match(/Alt/)) {
        this.altKey = false;
      }

      if (!code.match(/Caps/)) {
        keyObj.div.classList.remove('active');
      }
    }
  }

  resetButtonState = ({ target: { dataset: { code } } }) => {
    if (code.match('Shift')) {
      this.shiftKey = false;
      this.switchUpperCase(false);
      this.pressed[code].div.classList.remove('active');
    }

    if (code.match(/Control/)) {
      this.ctrKey = false;
    }

    if (code.match(/Alt/)) {
      this.altKey = false;
    }

    this.resetPressedButtons(code);
    this.textInput.focus();
  }

  resetPressedButtons = (targetCode) => {
    if (!this.pressed[targetCode]) {
      return;
    }

    if (!this.capsLockOn) {
      this.pressed[targetCode].div.classList.remove('active');
    }

    this.pressed[targetCode].div.removeEventListener('mouseleave', this.resetButtonState);
    delete this.pressed[targetCode];
  }

  switchUpperCase(isNeedUpper) {
    if (isNeedUpper) {
      this.Buttons.forEach((button) => {
        if (button.afterShift) {
          if (this.shiftKey) {
            button.afterShift.classList.add('after-shift-active');
            button.noShift.classList.add('after-shift-inactive');
          }
        }

        if (!button.isFuncKey && this.capsLockOn && !this.shiftKey && !button.afterShift.innerHTML && button.shift) {
          button.noShift.innerHTML = button.shift;
        } else if (!button.isFuncKey && this.capsLockOn && this.shiftKey) {
          button.noShift.innerHTML = button.lowerCase;
        } else if (!button.isFuncKey && !button.afterShift.innerHTML && button.shift) {
          button.noShift.innerHTML = button.shift;
        }
      });
    } else {
      this.Buttons.forEach((button) => {
        if (button.afterShift.innerHTML && !button.isFuncKey) {
          button.afterShift.classList.remove('after-shift-active');
          button.noShift.classList.remove('after-shift-inactive');
          if (!this.capsLockOn) {
            button.noShift.innerHTML = button.lowerCase;
          } else if (!this.capsLockOn) {
            button.noShift.innerHTML = button.shift;
          }
        } else if (!button.isFuncKey) {
          if (this.capsLockOn) {
            button.noShift.innerHTML = button.shift;
          } else {
            button.noShift.innerHTML = button.lowerCase;
          }
        }
      });
    }
  }

  switchLanguage = () => {
    const lang = Object.keys(language);
    let index = lang.indexOf(this.container.dataset.language);
    this.baseLang = index + 1 < lang.length ? language[lang[index += 1]] : language[lang[index -= index]];
    this.container.dataset.language = lang[index];
    session.set('virtualKeyboardLang', lang[index]);

    this.Buttons.forEach((button) => {
      const keyObj = this.baseLang.find((key) => key.code === button.code);

      if (!keyObj) {
        return;
      }

      button.shift = keyObj.shift;
      button.lowerCase = keyObj.lowerCase;

      if (keyObj.shift && keyObj.shift.match(/[^a-zA-Zа-яА-ЯёЁ0-9]/g)) {
        button.afterShift.innerHTML = keyObj.shift;
      } else {
        button.afterShift.innerHTML = '';
      }

      button.noShift.innerHTML = keyObj.lowerCase;
    });

    if (this.capsLockOn) {
      this.switchUpperCase(true);
    }
  }

  printToOutput(keyObj, symbol) {
    let cursorPos = this.textInput.selectionStart;
    const left = this.textInput.value.slice(0, cursorPos);
    const right = this.textInput.value.slice(cursorPos);
    const textHandlers = {
      Tab: () => {
        this.textInput.value = `${left}\t${right}`;
        cursorPos += 1;
      },
      ArrowLeft: () => {
        this.textInput.value += String.fromCharCode(8656);
        cursorPos += 1;
      },
      ArrowRight: () => {
        this.textInput.value += String.fromCharCode(8658);
        cursorPos += 1;
      },
      ArrowUp: () => {
        this.textInput.value += String.fromCharCode(8657);
        cursorPos += 1;
      },
      ArrowDown: () => {
        this.textInput.value += String.fromCharCode(8659);
        cursorPos += 1;
      },
      Enter: () => {
        this.textInput.value = `${left}\n${right}`;
        cursorPos += 1;
      },
      Delete: () => {
        this.textInput.value = `${left}${right.slice(1)}`;
      },
      Backspace: () => {
        this.textInput.value = `${left.slice(0, -1)}${right}`;
        cursorPos -= 1;
      },
      Space: () => {
        this.textInput.value = `${left} ${right}`;
        cursorPos += 1;
      },
    };

    if (textHandlers[keyObj.code]) {
      textHandlers[keyObj.code]();
    } else if (!keyObj.isFuncKey) {
      cursorPos += 1;
      this.textInput.value = `${left}${symbol || ''}${right}`;
    }

    this.textInput.setSelectionRange(cursorPos, cursorPos);
  }

  //#endregion Обработка нажатий кнопок
}