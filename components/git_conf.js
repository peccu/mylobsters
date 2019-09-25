(function fragments() {
  const template = `
    <p>Repo: <input type="text" id="repo" placeholder="Clone URL" value="{{options.repo}}"/></p>
    <p>Token: <input type="text" id="token" placeholder="token" value="{{options.token}}"/></p>
    <p>Author: <input type="text" id="author" placeholder="commit author" value="{{options.author}}"/></p>
    <p>Mail: <input type="text" id="mail" placeholder="commit mail" value="{{options.mail}}"/></p>
    <p><button onclick="saveConf(); return false;">SAVE CONFIG</button></p>
    <p><button onclick="resetfs(); return false;">RESET FS</button></p>
`;

  function render(json) {
    let content = Sqrl.Render(template, {json});
    console.log('rendered', content);
    return content;
  }

  const GitConfig = class extends HTMLElement {
    connectedCallback() {
	let json = {
	    repo: localStorage.getItem('repo'),
	    token: localStorage.getItem('token'),
	    author: localStorage.getItem('author'),
	    mail: localStorage.getItem('mail')
	};
      this.log('stored git config', json);
      this.innerHTML = render(json);
    }

      saveConf(){
	  ['repo', 'token', 'author', 'mail'].map(key => {
	      let val = document.getElementById(key);
	      if(!val){
		  return;
	      }
	      localStorage.setItem(key, val);
	  });
      }

    log(...args) {
      console.log('🖼️ mit-config',...args);
    }
  };

  window.customElements.define('git-config', GitConfig);

}());
