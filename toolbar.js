(function toolbar(){
  const toolbarhtml = `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, viewport-fit=cover, user-scalable=no, shrink-to-fit=no" />
    <meta name="HandheldFriendly" content="true" />
    <title>My Lobsters</title>
    <link rel="stylesheet" href="./style.css">
    <script src="https://unpkg.com/squirrelly@latest/dist/squirrelly.min.js"></script>
    <script src="https://momentjs.com/downloads/moment.min.js"></script>
    <script src="./api/articles.js"></script>
    <script src="./components/lob_item.js"></script>
  </head>
  <body>
    <form onsubmit="next(); return false;">
      <input type="text" id="title"/>
      <input type="text" id="url" value="https://google.com"/>
      <button onclick="add(); return false;">add</button>
    </form>
    <div id="wrapper">
      <div id="inside">
        <ol class="stories list">
          <mylob-items></mylob-items>
        </ol>
      </div>
    </div>
    <sc` + `ript>
      const add = () => {
        let title = document.querySelector('#title').value;
        let url = document.querySelector('#url').value;
        window.opener.addUrlOpen(url, title)
      }
      document.head.appendChild(window.opener.createParentStyle());
      const setupOpenLink = () => {
        const aTags = document.querySelectorAll('a.u-url');
        Array.prototype.slice.call(aTags).map(tag=>tag.addEventListener('click', (e) => {
          e.preventDefault();
          (window.opener || window).openUrl(tag.href);
        }));
      };
      setupOpenLink();
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

  const openUrl = url => {
    var readerOpt = [
      'height=' + screen.height,
      'width=' + (screen.width - toolbarWidth),
      'left=' + toolbarWidth,
      'top=0'
    ].join(',');
    var reader = window.open(url, 'reader', readerOpt);
    toolbar.focus();
  };

  const createParentStyle = () => {
    const style = document.createElement('style');
    style.innerHTML = document.querySelector('style').innerHTML;
    return style;
  };

  window.start = start;
  window.openUrl = openUrl;
  window.createParentStyle = createParentStyle;
}());
