import { createRoot } from 'react-dom/client';
import type { ReactElement } from 'react';

export const initAppWithShadow = ({ id, app, inlineCss }: { id: string; inlineCss: string; app: ReactElement }) => {
  const root = document.createElement('div');
  root.id = id;
  // Ensure the container is on top but doesn't block interactions
  root.style.position = 'absolute';
  root.style.zIndex = '2147483647';
  root.style.top = '0';
  root.style.left = '0';
  root.style.width = '0';
  root.style.height = '0';
  root.style.pointerEvents = 'none';

  document.body.append(root);

  const rootIntoShadow = document.createElement('div');
  rootIntoShadow.id = `shadow-root-${id}`;

  const shadowRoot = root.attachShadow({ mode: 'open' });

  if (navigator.userAgent.includes('Firefox')) {
    /**
     * In the firefox environment, adoptedStyleSheets cannot be used due to the bug
     * @url https://bugzilla.mozilla.org/show_bug.cgi?id=1770592
     *
     * Injecting styles into the document, this may cause style conflicts with the host page
     */
    const styleElement = document.createElement('style');
    styleElement.innerHTML = inlineCss;
    shadowRoot.appendChild(styleElement);
  } else {
    /** Inject styles into shadow dom */
    const globalStyleSheet = new CSSStyleSheet();
    globalStyleSheet.replaceSync(inlineCss);
    shadowRoot.adoptedStyleSheets = [globalStyleSheet];
  }

  shadowRoot.appendChild(rootIntoShadow);
  createRoot(rootIntoShadow).render(app);
};
