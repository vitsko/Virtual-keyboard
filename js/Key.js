import create from './utils/create.js';

export default class Key {

  specialKey = 
  ['Backspace',
   'Tab',
   'Delete',
   'CapsLock',
   'Enter',
   'ShiftLeft',
   'ShiftRight',
   'ControlLeft',
   'MetaLeft',
   'AltLeft',
   'Space',
   'AltRight',
   'ControlRight'];

  constructor({ lowerCase, shift, code }) {    
    this.lowerCase = lowerCase;
    this.shift = shift;
    this.code = code;
    this.isFuncKey = this.specialKey.includes(code);

    if (shift && shift.match(/[^a-z-A-Zа-яА-ЯёЁ0-9]/)) {
      this.afterShift = create('div', 'after-shift', shift);
    } else {
      this.afterShift = create('div', 'after-shift', '');
    }

    this.noShift = create('div', 'no-shift', lowerCase);
    this.div = create('div', 'board-key', [this.afterShift, this.noShift], null, ['code', code], 
      this.isFuncKey ? ['funcKey', 'true'] : ['funcKey', 'false']);
  }
}