(function(){
  // import git from './git.js';
  // localstorage - fs - git
  // update(pull), read, write, save(commit/push)

  var update = (cb) => {
    // git.cloneOrPullRepo(cb);
    cloneOrPullRepo(()=>{
      loadStorage(cb);
    });
  };
    
  const loadStorage = async (cb) => {
    // load database
    console.log(await window.pfs.readdir(window.dir));
    let json = await window.pfs.readFile(`${window.dir}/storage.json`, 'utf8');
    localStorage.setItem('json', json);
    cb();
  };

  // TODO move commit and push from script.js to here

  window.update = update;
}());
