  // localstorage - fs - git
  // clone, pull, add, commit, push

  const initGit = () => {
    // window.fs = new LightningFS('fs', { wipe: true });
    window.fs = new LightningFS('fs');
    window.git.plugins.set('fs', window.fs);
    window.pfs = window.fs.promises;
    window.dir = '/storage';
  };

  const gitOption = () => {
    let option = {
      dir: window.dir,
      corsProxy: 'https://cors.isomorphic-git.org'
    };
    let repo = localStorage.getItem('repo');
    if (repo != '') {
      option.url = repo;
    }
    let token = localStorage.getItem('token');
    if (token != '') {
      option.token = token;
    }
    return option;
  };

  const clone = async () => {
    let option = gitOption();
    option.ref = 'master';
    option.singleBranch = true;
    option.depth = 1;
    await window.git.clone(option);
  };

  export const cloneOrPullRepo = async (cb) => {
    if(!window.dir){
      initGit();
    }
    try {
      await window.pfs.lstat(`${window.dir}/.git`);
      console.log('now pull');
      let option = gitOption();
      await window.git.pull(option);
    }catch(err){
      // console.log(err);
      try {
        await window.pfs.lstat(window.dir);
      } catch (err2) {
        await window.pfs.mkdir(window.dir);
        console.log('made dir');
      }
      console.log('clone');
      try {
        await clone();
      }catch(err){
        console.log('cant clone', err);
        repoConf();
      }
    }
    cb();
  };

  export const repoConf = () => {
    const script = document.createElement('script');
    script.type = 'module';
    script.src = './components/git_conf.js';
    script.onload= () => {
      const custom = document.createElement('git-config');
      document.body.appendChild(custom);
    };
    document.body.appendChild(script);
  };

  // window.repoConf = repoConf;
  // window.cloneOrPullRepo = cloneOrPullRepo;
