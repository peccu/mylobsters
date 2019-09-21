(function fragments() {
  const template = `
    <p>Repo: <input type="text" id="repo" placeholder="Clone URL" value="{{options.repo}}"/></p>
    <p>Token: <input type="text" id="token" placeholder="token" value="{{options.token}}"/></p>
    <p>Author: <input type="text" id="author" placeholder="commit author" value="{{options.author}}"/></p>
    <p>Mail: <input type="text" id="mail" placeholder="commit mail" value="{{options.mail}}"/></p>
    <p><button onclick="saveConf(); return false;">SAVE CONFIG</button></p>
`;

  function render(json) {
    let content = Sqrl.Render(template, {json});
    console.log('rendered', content);
    return content;
  }

    const getItem = localStorage.getItem;
	
  const GitConfig = class extends HTMLElement {
    connectedCallback() {
	let json = {
	    repo: getItem('repo'),
	    token: getItem('token'),
	    author: getItem('author'),
	    mail: getItem('mail')
	};
      this.log('stored git config', json);
      this.innerHTML = render(json);
    }

      saveConf(){
	  ['repo', 'token', 'author', 'mail'].map(key = {
	      let val = document.getElementById(key);
	      if(!val){
		  return;
	      }
	      localStorage.setItem(key, val);
	  });
      }

    log(...args) {
      console.log('🖼️ mit-config',..args);
    }
  };

  window.customElements.define('git-config', GitConfig);

}());
