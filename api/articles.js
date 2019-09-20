(function api(){
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

  const setDefault = (items) => items.map(e => Object.assign({}, defaultItem, e));

  const getArticles = () => {
    let json = JSON.parse(localStorage.getItem('json'));
    const items = setDefault(json.items);
    json.items = items;
    return json;
  };

  window.getArticles = getArticles;
}());
