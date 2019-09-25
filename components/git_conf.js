const tagName = 'git-config';
const template = document.createElement('template');
template.innerHTML = `
    <p>Repo: <input type="text" id="repo" placeholder="Clone URL"/></p>
    <p>Token: <input type="text" id="token" placeholder="token"/></p>
    <p>Author: <input type="text" id="author" placeholder="commit author"/></p>
    <p>Mail: <input type="text" id="mail" placeholder="commit mail"/></p>
    <p><button id="#saveConf">SAVE CONFIG</button></p>
    <p><button id="#resetfs">RESET FS</button></p>
`;

const storeKeys = ['repo', 'token', 'author', 'mail'];

class MyCustomeElement extends HTMLElement {
  connectedCallback(){
    if(this.shadowRoot){
      return;
    }
    this.attachShadow({mode: 'open'});
    let clone = template.content.cloneNode(true);
    const child = this.renderNode(clone);
    this.shadowRoot.appendChild(child);
    this.attachEvents();
  }

  renderNode(clone){
    storeKeys.map(key => {
      clone.querySelector('#' + key).value = localStorage.getItem(key) || '';
    });
    return clone;
  }

  attachEvents(){
    ['saveConf', 'resetfs'].map(id => {
      this.shadowRoot.querySelector('#' + id).addEventListener('click', this[id]);
    });
  }

  saveConf(e){
    e.preventDefault();
    e.stopPropagation();
    storeKeys.map(key => {
      let val = document.getElementById(key);
      if(!val){
        return;
      }
      localStorage.setItem(key, val);
    });
  }
  resetfs(){
    window.fs = new LightningFS('fs', { wipe: true });
  };

  log(...args) {
    console.log('🖼️ git-config',...args);
  }
};
const register = () => customElements.define(tagName, MyCustomeElement);
window.WebComponents ? window.WebComponents.waitFor(register) : register();
