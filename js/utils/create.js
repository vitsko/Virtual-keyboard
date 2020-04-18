/**
@param {String} elementName
@param {String} classNames
@param {HTMLElement} child
@param {HTMLElement} parent
@param {Array} dataAttributes
*/


export default function create(elementName, classNames, child, parent, ...dataAttributes) {
  let el = null;

  try {
    el = document.createElement(elementName);
  } catch {
    console.log(`Current incorrect tag name is ${elementName}`);
    throw new Error(`Current incorrect tag name is ${elementName}. Unable to create HTMLElement. Use a proper tag name`);
  }

  if (classNames) {
    el.classList.add(...classNames.split(' '));
  }

  if (child && Array.isArray(child)) {
    child.forEach((childElement) => {
      childElement && el.appendChild(childElement);
    });
  } else if (child && typeof child === 'object') {
    el.appendChild(child);
  } else if (child && typeof child === 'string') {
    el.innerHTML = child;
  }

  if (parent) {
    parent.appendChild(el);
  }

  if (dataAttributes.length) {
    dataAttributes.forEach(([attributeName, attributeValue]) => {
      if (attributeValue === '') {
        el.setAttribute(attributeName, '');
      }

      if (attributeName.match(/value|id|placeholder|cols|rows|autocorrect|spellcheck/)) {
        el.setAttribute(attributeName, attributeValue);
      } else {
        el.dataset[attributeName] = attributeValue;
      }
    });
  }

  return el;
}