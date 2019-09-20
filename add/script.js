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
  // initRepo();
};
init();

// encodeURIComponent(location.origin + location.pathname) + '?' + encodeURIComponent(
//   JSON.stringify(
//     Array.prototype.slice.call(
//       document.querySelectorAll('link[rel="alternate"]')).map(e=> {
//         return {
//           type: e.type.split('/')[1],
//           title: e.title,
//           url: e.href
//         };
//       })));
const bookmarklet = `<a href="javascript:(function()%7Bwindow.open('${encodeURIComponent(location.origin + location.pathname)}%3F'%20%2B%20encodeURIComponent(%0A%20%20JSON.stringify(%0A%20%20%20%20Array.prototype.slice.call(%0A%20%20%20%20%20%20document.querySelectorAll('link%5Brel%3D%22alternate%22%5D')).map(e%3D%3E%20%7B%0A%20%20%20%20%20%20%20%20return%20%7B%0A%20%20%20%20%20%20%20%20%20%20type%3A%20e.type.split('%2F')%5B1%5D%2C%0A%20%20%20%20%20%20%20%20%20%20title%3A%20e.title%2C%0A%20%20%20%20%20%20%20%20%20%20url%3A%20e.href%0A%20%20%20%20%20%20%20%20%7D%7D))))%3B%7D)()%3B">bookmarklet</a>`;
const usage = `You don't specify title and url.<br/>
You can use this ${bookmarklet}.`;

const start = () => {
  let search = location.search;
  if(!search){
    document.write(usage);
    return;
  }
  let params = [];
  try{
    params = JSON.parse(decodeURIComponent(search.slice(1)));
  }catch(e){
    document.write(usage);
    document.write('<br/>' + e);
    return;
  }
  const defaultParam = {title: '', url: ''};
  params.map(e => {
    let param = Object.assign({}, defaultParam, e);
    document.write(`title = ${param['title']}<br/>url = ${param['url']}<br/>`);
  });
};
start();
