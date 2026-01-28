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
 * Calculate panel position with smart placement (auto-detect best position)
 * Priority: below > above > right > left of icon
 */
export const calculatePanelPosition = (iconPosition: Position, panelWidth: number, panelHeight: number): Position => {
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;
  const scrollX = window.scrollX;
  const scrollY = window.scrollY;

  const padding = 10;
  const iconOffset = 45; // Distance from icon

  // Calculate icon position relative to viewport
  const iconViewportX = iconPosition.x - scrollX;
  const iconViewportY = iconPosition.y - scrollY;

  // Available space in each direction
  const spaceBelow = viewportHeight - iconViewportY - iconOffset;
  const spaceAbove = iconViewportY - iconOffset;
  const spaceRight = viewportWidth - iconViewportX;
  const spaceLeft = iconViewportX;

  let x: number;
  let y: number;

  // Try below first (preferred)
  if (spaceBelow >= panelHeight + padding) {
    y = iconPosition.y + iconOffset;
    x = iconPosition.x - panelWidth / 2;
  }
  // Try above
  else if (spaceAbove >= panelHeight + padding) {
    y = iconPosition.y - panelHeight - iconOffset;
    x = iconPosition.x - panelWidth / 2;
  }
  // Try right side
  else if (spaceRight >= panelWidth + padding) {
    x = iconPosition.x + 20;
    y = iconPosition.y - panelHeight / 2;
  }
  // Try left side
  else if (spaceLeft >= panelWidth + padding) {
    x = iconPosition.x - panelWidth - 20;
    y = iconPosition.y - panelHeight / 2;
  }
  // Fallback: center in viewport
  else {
    x = scrollX + (viewportWidth - panelWidth) / 2;
    y = scrollY + (viewportHeight - panelHeight) / 2;
  }

  // Final constraint to ensure panel stays within viewport
  const minX = scrollX + padding;
  const maxX = scrollX + viewportWidth - panelWidth - padding;
  const minY = scrollY + padding;
  const maxY = scrollY + viewportHeight - panelHeight - padding;

  x = Math.max(minX, Math.min(x, maxX));
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
