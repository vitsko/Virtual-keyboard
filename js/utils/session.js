export function get(name, alternative = null) {
  return JSON.parse(window.sessionStorage.getItem(name) || alternative)
}

export function set(name, value) {
  window.sessionStorage.setItem(name, JSON.stringify(value));
}