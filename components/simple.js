const tagName = 'super-span';
const template = document.createElement('template');
template.innerHTML = `
  <style>
    :host {
      color:green;
    }
    span ::slotted(*){
      color: yellow;
    }
  </style>
  <span>button<slot id="button"></slot></span>
`;

class MyCustomeElement extends HTMLElement {
  safeSetAttribute(name, value){
    if(this.getAttribute(name) === value){
      return;
    }
    this.setAttribute(name, value);
  }
  attributeChangedCallback(name, oldVal, newVal){
    this.safeSetAttribute(name, newVal);
  }

  static get observedAttributes(){
    return [];
  }

  constructor(){
    super();
  }
  connectedCallback(){
    if(this.shadowRoot){
      return;
    }
    this.attachShadow({mode: 'open'});
    this.shadowRoot.appendChild(template.content.cloneNode(true));
    this.attachEvents();
  }
  disconnectedCallback(){
  }

  attachEvents(){
    this.shadowRoot.querySelector('#button').addEventListener('click', this.inner_method);
    this.addEventListener('click', this.method);
  }

  method(e){
    console.log('outer', e);
  }

  inner_method(e){
    console.log('inner', e);
    e.preventDefault();
    e.stopPropagation();
  }
};
const register = () => customElements.define(tagName, MyCustomeElement);
window.WebComponents ? window.WebComponents.waitFor(register) : register();
