export const KEYS = {
  DOWN: 40,
  UP: 38,
  ENTER: 13,
  ESC: 27,
  TAB: 9,
};

export function isDownArrow(ev) {
  return ev.which === KEYS.DOWN;
}

export function isUpArrow(ev) {
  return ev.which === KEYS.UP;
}

export function handleArrowKey(ev, uiRefs, hoverIndex, setIndex) {
  const numberOfItems = uiRefs.menuItems.length;
  let newIndex = isDownArrow(ev) ? hoverIndex + 1 : hoverIndex - 1;
  if (newIndex === numberOfItems) {
    newIndex = 0;
  } else if (newIndex === -1) {
    newIndex = numberOfItems - 1;
  }

  const menuItemRef = uiRefs.menuItems[newIndex];
  if (!menuItemRef) {
    setIndex(-1);
    return;
  }
  setIndex(newIndex);
  const rect = menuItemRef.container.getBoundingClientRect();
  const menuRect = uiRefs.menu.getBoundingClientRect();

  let diff = rect.bottom - menuRect.bottom;
  if (diff > 0) {
    uiRefs.menu.scrollTop = uiRefs.menu.scrollTop + diff;
    return;
  }
  diff = rect.top - menuRect.top;
  if (diff < 0) {
    uiRefs.menu.scrollTop = uiRefs.menu.scrollTop + diff;
  }
}

export const generateId = prefix => `${prefix}-${Math.random() .toString(32).substr(2, 8)}`;
