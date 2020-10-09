'use strict';

window.addEventListener('load', function() {
  let $contents = document.querySelector('.contents');
  jsBasic($contents);
});

function jsBasic($object) {
  /*
   * Objectオブジェクト
   */
  let data = {
    red: '赤色',
    yellow: '黄色'
  };
  let proxy = new Proxy(data, {
    get(target, prop) {
      return prop in target ? target[prop] : '?';
    }
  });
  proxy.red = 'レッド';
  console.log(data.red);
  console.log(proxy.red);
}
