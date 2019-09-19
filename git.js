const initGit = () => {
  // window.fs = new LightningFS('fs', { wipe: true });
  window.fs = new LightningFS('fs');
  git.plugins.set('fs', window.fs);
  window.pfs = window.fs.promises;
  window.dir = '/storage';
};

const gitOption = () => {
  let option = {
    dir,
    corsProxy: 'https://cors.isomorphic-git.org'
  };
  let repo = document.querySelector('#repo').value;
  if (repo != '') {
    option.url = repo;
    localStorage.setItem('repo', repo);
  }

  let token = document.querySelector('#token').value;
  if (token != '') {
    option.token = token;
    localStorage.setItem('token', token);
  }
  return option;
};

const clone = async () => {
  let option = gitOption();
  option.ref = 'master';
  option.singleBranch = true;
  option.depth = 1;
  await git.clone(option);
};

const initRepo = async () => {
  try {
    await window.pfs.lstat(`${dir}/.git`);
    console.log('now pull');
    let option = gitOption();
    await git.pull(option);
  } catch (err) {
    // console.log(err);
    try {
      await window.pfs.lstat(dir);
    } catch (err2) {
      await window.pfs.mkdir(dir);
      console.log('made dir');
    }
    console.log('clone');
    await clone();
  }

  console.log(await pfs.readdir(dir));
  // await git.log({dir})
  let json = await pfs.readFile(`${dir}/storage.json`, 'utf8');
  localStorage.setItem('json', json);
  initFromLocalStorage();
};
