import create from './utils/create.js';
import language from './keys.js';
import Key from './Key.js';

const content = create('main', '', [create('h1', 'title', 'Virtual keyboard')]);

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
  }
}