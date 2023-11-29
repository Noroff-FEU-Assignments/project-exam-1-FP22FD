export function displayElement(visible, id, displayStyle) {
  const element = document.querySelector(id);
  if (visible === true) {
    element.style.display = displayStyle;
  } else {
    element.style.display = "none";
  }
}
