type CustomElement<T> = Partial<T & React.DOMAttributes<T> & { children: any }>;

declare global {
  namespace JSX {
    interface IntrinsicElements {
      ["style-isolation"]: CustomElement<StyleIsolation>;
    }
  }
}

class StyleIsolation extends HTMLElement {
  constructor() {
    super();

    const shadowRoot = this.attachShadow({ mode: "open" });

    shadowRoot.innerHTML = `
      <style>
        :host {
          all: initial;
        }
      </style>

      <slot></slot>
    `;
  }
}

customElements.define("style-isolation", StyleIsolation);
