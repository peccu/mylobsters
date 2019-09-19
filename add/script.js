const initEruda = () => {
  eruda.init();
};
/*
get title and url from query parameter
if no info
show bookmarklet
if no conf
load github conf

clone or pull
add feed info

commit
push
close myself
*/



const loadConf = attr => {
  return key => {
    const val = localStorage.getItem(key);
    if (!val) {
      return;
    }
//    document.querySelector('#' + key)[attr] = val;
  };
};
const loadValue = loadConf('value');

const initFromLocalStorage = () => {
  ['repo', 'token', 'author', 'mail'].map(loadValue);
  loadConf('innerText')('json');
};

const resetfs = () => {
  window.fs = new LightningFS('fs', { wipe: true });
};

const initGit = () => {
  window.fs = new LightningFS('fs');
  git.plugins.set('fs', window.fs);
  window.pfs = window.fs.promises;
  window.dir = '/storage';
};

const gitOption = () => {
  let option = {
    dir,
      corsProxy: 'https://cors.isomorphic-git.org',
      repo: localStorage.getItem('repo'),
      token: localStorage.getItem('token'),
  };
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

const init = () => {
  initEruda();
  initFromLocalStorage();
  initGit();
  initRepo();
};
init();

const start = () => {
  let search = location.search;
  if(!search || !search.match(/^\?.*=.*/)){
    document.write(`You don't specify title and url.`);
    return;
  }
  const defaultParam = {title: '', url: ''};
  let param = Object.assign({}, defaultParam, search
    .slice(1)
    .split('&')
    .reduce((acc, pair) => {
      let both = pair.split('=');
      let key = both[0];
      let val = both[1];
      acc[key] = val;
      return acc;
    }, {}));;
  document.write(`title = #{param['title']}<br/>url = #{param['url']}`);
};
start();
