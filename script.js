(function(){
  const loadConf = attr => {
    return key => {
      const val = localStorage.getItem(key);
      if (!val) {
        return;
      }
      document.querySelector('#' + key + 'label')[attr] = val;
    };
  };

  const initFromLocalStorage = () => {
    loadConf('innerText')('json');
  };

  const init = () => {
    initEruda();
    update(initFromLocalStorage);
  };
  init();

  const commit = async jsonStr => {
    await pfs.writeFile(`${dir}/storage.json`, jsonStr, 'utf8');
    await git.add({ dir, filepath: 'storage.json' });
    let author = document.querySelector('#author').value;
    localStorage.setItem('author', author);
    let mail = document.querySelector('#mail').value;
    localStorage.setItem('mail', mail);

    let option = gitOption();
    option.message = 'update storage.json.';
    option.author = {
      name: author,
      email: mail
    };
    let sha = await git.commit(option);
    await git.push(gitOption());
    console.log('push finished');
  };

  var addUrlOpen = (url, title) => {
    console.log('url', url);
    let json = JSON.parse(localStorage.getItem('json'));
    json.items.push({ title, url });
    localStorage.setItem('json', JSON.stringify(json) + '\n');
    commit(JSON.stringify(json, null, '  '));

    initFromLocalStorage();
    openUrl(url);
  };
  window.addUrlOpen = addUrlOpen;
}());
