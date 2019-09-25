/*
    <script type="module" src="./intersect_observer.js"></script>
    <super-span>star<span>green</span></super-span>
*/
// https://dev.to/bennypowers/lets-build-web-components-part-1-the-standards-3e85
// https://dev.to/bennypowers/lets-build-web-components-part-3-vanilla-components-4on3
// isIntersecting :: IntersectionObserverEntry -> Boolean
const isIntersecting = ({isIntersecting}) => isIntersecting;

const tagName = 'super-span';
const template = document.createElement('template');
template.innerHTML = `
  <style>
    :host {
      color: yellow;
    }
    span ::slotted(*){
      color: green;
    }
  </style>
  <span><slot></slot></span>
`;

class SuperSpan extends HTMLElement {
  /**
   * Guards against loops when reflecting observed attributes.
   * @param  {String} name Attribute name
   * @param  {any} value
   * @protected
   */
  safeSetAttribute(name, value){
    if(this.getAttribute(name) === value){
      return;
    }
    this.setAttribute(name, value);
  }

  static get observedAttributes(){
    return [];
  }

  constructor(){
    super();
    this.observerCallback = this.observerCallback.bind(this);
    this.setIntersecting = this.setIntersecting.bind(this);
  }

  connectedCallback(){
    if(!this.shadowRoot){
      this.attachShadow({mode: 'open'});
      this.shadowRoot.appendChild(template.content.cloneNode(true));
      // this.shine = this.shine.bind(this);
      // this.addEventListener('click', this.shine);
      // this.addEventListener('mouseover', this.shine);

    }
    // https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API
    if('IntersectionObserver' in window){
      this.initIntersectionObserver();
    }else{
      this.intersecting = true;
    }
  }

  attributeChangedCallback(name, oldVal, newVal){
    this.safeSetAttribute(name, newVal);
  }

  disconnectedCallback(){
    this.disconnectObserver();
  }

  // observer
  /**
   * Sets the `intersecting` property when the element is on screen.
   * @param  {[IntersectionObserverEntry]} entries
   * @protected
   */
  observerCallback(entries){
    if(entries.some(isIntersecting)){
      this.intersecting = true;
    }
  }
  /**
   * Disconnects and unloads the IntersectionObserver.
   * @protected
   */
  disconnectObserver(){
    this.observer.disconnect();
    this.observer = null;
    delete this.observer;
  }

  // intersecting
  set intersecting(value){
    if(value){
      this.disconnectObserver();
    }else{
      this.removeAttribute('intersecting');
    }
  }
  /**
   * Whether the element is on screen.
   * @type {Boolean}
   */
  get intersecting(){
    return this.hasAttribute('intersecting');
  }

  /**
   * Sets the intersecting attribute and reload styles if the polyfill is at play.
   * @protected
   */
  setIntersecting(event){
    this.setAttribute('intersecting', '');
  }

  // intersection ovserver
  /**
   * Initializes the IntersectionObserver when the element instantiates.
   * @protected
   */
  initIntersectionObserver(){
    if(this.observer) return;
    // Start loading the image 10px before it appears on screen
    const rootMargin = '10px';
    const option = {
      rootMargin
    };
    this.observer = new IntersectionObserver(this.observerCallback, option);
    this.observer.observe(this);
  }
};
const register = () => customElements.define(tagName, SuperSpan);
window.WebComponents ? window.WebComponents.waitFor(register) : register();
