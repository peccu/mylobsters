# My Lobste.rs

## WIP

- use case
  - setup git repos
  - add feed source
  - gather feed / CLI
    - update date avz.
  - filter article / single window
    - quickly pick up articles
  - read article /multi windows
    - consume picked articles
  - evaluate article / multi windows
    - good/bad
  - categorize article / CLI
    - with tags
  - timer for defined consuming time
- data
  - feed sources (`feeds.json`)
    - rss
    - article for rss
    - url
    - title
    - last updated
    - average update duration
  - gathered articles (`articles.json`)
    - url
    - title
    - source
    - author
    - fetched date
    - cashed url
    - domain
    - favicon
  - picked articles (`picked.json`)
    - url
    - good/bad by meta
    - good/bad by contents
    - evaluated datetime 2 date times
- ui
  - main
  - setup github
  - add feeds/page
  - picking articles
  - reading w/ evaluation

## memo
- text classification https://cloud.google.com/natural-language/automl/docs/quickstart
- url tagging https://www.tefter.io/
- article parser https://mercury.postlight.com/web-parser/
