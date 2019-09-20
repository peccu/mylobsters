(function fragments() {

  Sqrl.defineFilter('encodeURIComponent', encodeURIComponent);
  Sqrl.defineFilter('fromNow', (ts) => moment(ts).fromNow());

  const userTemplate = `
        <a href="/u/{{@this.author}}"><img srcset="/avatars/{{@this.author}}-16.png 1x, /avatars/{{@this.author}}-32.png 2x" class="avatar" alt="{{@this.author}} avatar" src="/avatars/{{@this.author}}-16.png" width="16" height="16"></a>
        authored by
        <a href="/u/{{@this.author}}" class="u-author h-card user_is_author">{{@this.author}}</a>`;
  Sqrl.definePartial('user', userTemplate);

  const template = `
{{each(options.json.items)}}
    <li id="story_{{@this.id}}" data-shortid="{{@this.id}}" class="story">
      <div class="story_liner h-entry">
        <div class="voters">
          <a class="upvoter" href="/login"></a>
          <div class="score">{{@this.score}}</div>
        </div>
        <div class="details">
          <span class="link h-cite u-repost-of">
            <a class="u-url" href="{{@this.url}}">{{@this.title || "no title"}}</a>
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
`;

  function render(json) {
    let content = Sqrl.Render(template, {json});
    console.log('rendered', content);
    return content;
  }

  const MylobItems = class extends HTMLElement {
    connectedCallback() {
      let json = getArticles();
      this.log('articles', json);
      this.innerHTML = render(json);
    }

    log(...args) {
      console.log('🖼️ mylob-items', ...args);
    }
  };

  window.customElements.define('mylob-items', MylobItems);

}());
