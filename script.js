const loadConf = attr => {
  return key => {
    const val = localStorage.getItem(key);
    if (!val) {
      return;
    }
    document.querySelector('#' + key)[attr] = val;
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

const init = () => {
  initEruda();
  initFromLocalStorage();
  initGit();
  initRepo();
};
init();

Sqrl.defineFilter('encodeURIComponent', encodeURIComponent);
Sqrl.defineFilter('fromNow', (ts) => moment(ts).fromNow());

const userTemplate = `
        <a href="/u/{{@this.author}}"><img srcset="/avatars/{{@this.author}}-16.png 1x, /avatars/{{@this.author}}-32.png 2x" class="avatar" alt="{{@this.author}} avatar" src="/avatars/{{@this.author}}-16.png" width="16" height="16"></a>
        authored by
        <a href="/u/{{@this.author}}" class="u-author h-card user_is_author">{{@this.author}}</a>`;
Sqrl.definePartial('user', userTemplate);

const template = `
<div id="inside">
  <ol class="stories list">
{{each(options.json.items)}}
    <li id="story_{{@this.id}}" data-shortid="{{@this.id}}" class="story">
      <div class="story_liner h-entry">
        <div class="voters">
          <a class="upvoter" href="/login"></a>
          <div class="score">{{@this.score}}</div>
        </div>
        <div class="details">
          <span class="link h-cite u-repost-of">
            <a class="u-url" href="{{@this.url}}">{{@this.title}}</a>
          </span>
          <span class="tags">
{{each(@this.tags)}}
            <a class="tag tag_programming" title="Use when every tag or no specific tag applies" href="/t/{{@this}}">{{@this}}</a>
{{/each}}
            <a class="tag tag_pdf tag_is_media" title="Link to a PDF document" href="/t/pdf">pdf</a>
            <a class="tag tag_ask tag_is_media" title="Ask Lobsters" href="/t/ask">ask</a>
          </span>
          <a class="domain" href="/search?order=newest&amp;q=domain:{{@this.domain}}">{{@this.domain}}</a>
          <div class="byline">
            {{include(user)/}}
            <span title="{{@this.ts}}" class="">{{@this.ts | fromNow }}</span>
            |
            <a href="https://archive.is/{{@this.url | encodeURIComponent}}" rel="nofollow" target="_blank">cached</a>
            <span class="comments_label">
              |
              <a href="/s/{{@this.id}}/{{@this.slug}}">{{@this.comment_count}} comments</a>
            </span>
          </div>
        </div>
      </div>
      <a href="/s/{{@this.id}}/{{@this.slug}}" class="mobile_comments " style="display: none;">
        <span>{{@this.comment_count}}</span>
      </a>
    </li>
{{/each}}
  </ol>
</div>
`;

const toolbarhtml = `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, viewport-fit=cover, user-scalable=no, shrink-to-fit=no" />
    <meta name="HandheldFriendly" content="true" />
    <title>My Lobsters</title>
    <link rel="stylesheet" href="./style.css">
  </head>
  <body>
    <form onsubmit="next(); return false;">
      <input type="text" id="title"/>
      <input type="text" id="url" value="https://google.com"/>
      <button onclick="add(); return false;">add</button>
    </form>
    <div id="wrapper"></div>
    <element-details>
      <span slot="element-name">template</span>
      <span slot="description">A mechanism for holding client-
        side content that is not to be rendered when a page is
        loaded but may subsequently be instantiated during
        runtime using JavaScript.</span>
    </element-details>
    <sc` + `ript>
      const add = () => {
        let title = document.querySelector('#title').value;
        let url = document.querySelector('#url').value;
        window.opener.addUrlOpen(url, title)
      }
      document.getElementById('wrapper').innerHTML = window.opener.render();
      document.head.appendChild(window.opener.createParentStyle());
      const setupOpenLink = () => {
        const aTags = document.querySelectorAll('a.u-url');
        Array.prototype.slice.call(aTags).map(tag=>tag.addEventListener('click', (e) => {
          e.preventDefault();
          (window.opener || window).openUrl(tag.href);
        }));
      };
      setupOpenLink();
      var ElementDetails = class extends HTMLElement {
        constructor() {
          super();
          const template = window.opener.document
            .getElementById('element-details-template')
            .content;
          const shadowRoot = this.attachShadow({mode: 'open'})
            .appendChild(template.cloneNode(true));
        }
      };
      customElements.define('element-details', ElementDetails);
    </sc` + `ript>
  </body>
</html>
`;

const toolbarWidth = 300;
const toolbarOpt = [
  'height=' + screen.height,
  'width=' + toolbarWidth,
  'left=0',
  'top=0'
].join(',');

let toolbar;
const start = () => {
  console.log('pushed');
  toolbar = window.open('', 'toolbar', toolbarOpt);
  toolbar.document.write(toolbarhtml);
};

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

var openUrl = url => {
  var readerOpt = [
    'height=' + screen.height,
    'width=' + (screen.width - toolbarWidth),
    'left=' + toolbarWidth,
    'top=0'
  ].join(',');
  var reader = window.open(url, 'reader', readerOpt);
  toolbar.focus();
};

const defaultItem = {
  id: 'abbdz',
  slug: 'compensation_2019_new_grad_tech_offers',
  score: 7,
  title: 'Compensation in 2019 – new grad tech offers',
  url: 'https://blog.jonlu.ca/posts/tech-offers',
  domain: 'blog.jonlu.ca',
  tags: ['programming', 'rust'],
  comment_count: 4,
  author: 'JonLuca',
  ts: '2019-09-11T13:28:55-0500'
};

var createParentStyle = () => {
  const style = document.createElement('style');
  style.innerHTML = document.querySelector('style').innerHTML;
  return style;
};

const setDefault = (items) => items.map(e => Object.assign({}, defaultItem, e));

var render = () => {
  let json = JSON.parse(localStorage.getItem('json'));
  const items = setDefault(json.items);
  json.items = items;
  //console.log('called', json);

  return Sqrl.Render(template, {json});
};
