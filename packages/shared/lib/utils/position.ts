/**
 * Position utility for calculating floating icon and panel positions
 */

export interface Position {
  x: number;
  y: number;
}

export interface SelectionRect {
  top: number;
  left: number;
  right: number;
  bottom: number;
  width: number;
  height: number;
}

/**
 * Get the bounding rectangle of the current text selection
 */
export const getSelectionRect = (): SelectionRect | null => {
  const selection = window.getSelection();
  if (!selection || selection.rangeCount === 0) {
    return null;
  }

  const range = selection.getRangeAt(0);
  const rect = range.getBoundingClientRect();

  return {
    top: rect.top,
    left: rect.left,
    right: rect.right,
    bottom: rect.bottom,
    width: rect.width,
    height: rect.height,
  };
};

/**
 * Calculate floating icon position (above selection, centered)
 */
export const calculateIconPosition = (selectionRect: SelectionRect, offset = 8): Position => {
  const x = selectionRect.left + selectionRect.width / 2 + window.scrollX;
  const y = selectionRect.top + window.scrollY - offset;

  return { x, y };
};

/**
 * Calculate panel position (below icon, centered, with viewport constraints)
 */
export const calculatePanelPosition = (iconPosition: Position, panelWidth: number, panelHeight: number): Position => {
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;
  const scrollX = window.scrollX;
  const scrollY = window.scrollY;

  let x = iconPosition.x - panelWidth / 2;
  let y = iconPosition.y + 40; // 40px below icon

  // Constrain to viewport horizontally
  const minX = scrollX + 10;
  const maxX = scrollX + viewportWidth - panelWidth - 10;
  x = Math.max(minX, Math.min(x, maxX));

  // Constrain to viewport vertically
  const minY = scrollY + 10;
  const maxY = scrollY + viewportHeight - panelHeight - 10;

  // If panel would go below viewport, show it above the icon instead
  if (y + panelHeight > maxY) {
    y = iconPosition.y - panelHeight - 40;
  }

  y = Math.max(minY, Math.min(y, maxY));

  return { x, y };
};

/**
 * Check if a position is within the viewport
 */
export const isInViewport = (position: Position, elementWidth = 0, elementHeight = 0): boolean => {
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;
  const scrollX = window.scrollX;
  const scrollY = window.scrollY;

  return (
    position.x >= scrollX &&
    position.x + elementWidth <= scrollX + viewportWidth &&
    position.y >= scrollY &&
    position.y + elementHeight <= scrollY + viewportHeight
  );
};
