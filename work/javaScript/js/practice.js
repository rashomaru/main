window.addEventListener('load', function() {
  let $contents = document.querySelector('.contents');
  jsBasic($contents);
});

function jsBasic($object) {
  /*
   * Mapオブジェクト及びfor~ofの学習
   */
  let m = new Map();
  m.set('dog', 'わんわん');
  m.set('cat', 'にゃー');
  m.set('mouse', 'ちゅー');

  let strHTML = '';
  strHTML = m.size + '<br>'
          + m.get('dog') + '<br>'
          + m.has('cat') + '<br>';

  // キーを順に取得
  for (let key of m.keys()) {
    strHTML += key + '<br>';
  }

  // 値を順に取得
  for (let value of m.values()) {
    strHTML += value + '<br>';
  }

  // キー / 値を取得
  for (let [key, value] of m.entries()) {
    strHTML += 'キー：' + key + ' 値：' + value + '<br>';
  }

  $object.innerHTML = strHTML;
}
