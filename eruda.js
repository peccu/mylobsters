export const initEruda = () => {
  var script = document.createElement('script');
  script.src = '//cdn.jsdelivr.net/npm/eruda';
  document.body.appendChild(script);
  script.onload = function(){
    eruda.init();
    console.log('eruda init called');
  }
};
