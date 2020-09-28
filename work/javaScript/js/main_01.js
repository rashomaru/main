/*
 * JavaScriptの理解を深めるため、あえてjQuery等のライブラリは使用しない。
 * デザイン自体はjQueryの参考書のを参考にし作成。
 */

/*
 * Slide Show
 */
function slideShow() {
  var $container = document.querySelector('#slideshow');
  var $slideGroup = $container.querySelector('.slideshow-wrapper');
  var $slides = $slideGroup.querySelectorAll('.slide');
  var $nav = $container.querySelector('.slideshow-nav');
  var $indicator = $container.querySelector('.slideshow-indicator');
  var $navPrev = $nav.querySelector('.prev');
  var $navNext = $nav.querySelector('.next');

  var totalSlide = $slides.length;
  var indicatorHTML = '';
  var currentIndex = 0;
  var duration = 500;
  var interval = 7500;
  var timer;
  var slideControlFlg = true;  // 連打対応："goToSlide"関数が使用可能か判断するフラグ ture：使用可 false：使用不可

  // 各slideを横一面に並べる
  for(var i = 0; i < totalSlide; i++) {
    $slides[i].style.left = (100 * i) + '%';
    indicatorHTML += '<a href="./">' + (i + 1) + '</a>';
  }

  // インジケーターにコンテンツを挿入
  $indicator.insertAdjacentHTML('beforeend', indicatorHTML);

  // コンテンツを表示する関数
  function goToSlide(index) {
    if (slideControlFlg == true) {
      var accumlatedValueOfLeft = 0;  // leftに設定する値。easing処理により蓄積させていく。
      var startTime = Date.now();
      var startPoint = Math.abs(Number($slideGroup.style.left.replace('%', '')));  // スライドラッパーの|スタート地点|を入れる
      var targetPoint = 100 * index;
      var distance = targetPoint - startPoint;

      // スライドのアニメーション実行関数
      function slideAnimation() {
        // この関数の処理が完了するまでgoToSlide禁止
        slideControlFlg = false;

        var currentTime = Date.now() - startTime;
        // leftの数値を下記easing関数にて蓄積させていく
        accumlatedValueOfLeft = easingEaseInOutExpo(currentTime, startPoint, distance, duration);

        // スライドNext(小→大)の場合
        if (startPoint < targetPoint) {
          if (accumlatedValueOfLeft >= targetPoint) {
            accumlatedValueOfLeft = targetPoint;
          }
        // スライドPrev(大→小)の場合
        } else if (startPoint > targetPoint) {
          if (accumlatedValueOfLeft <= targetPoint) {
            accumlatedValueOfLeft = targetPoint;
          }
        }

        // スライドラッパーのleftを設定
        $slideGroup.style.left = (-accumlatedValueOfLeft) + '%';

        // スライドラッパーの移動が完了したらgoToSlideの実行を許可する
        var slideGroupLeftValue = Math.abs(Number($slideGroup.style.left.replace('%', '')));

        if (slideGroupLeftValue == 0 || slideGroupLeftValue % 100 == 0) {
          slideControlFlg = true;
        }

        // ループ処理設定
        if (startPoint < targetPoint) {
          if (accumlatedValueOfLeft < targetPoint) {
            setTimeout(slideAnimation, 1);
          }
        } else if (startPoint > targetPoint) {
          if (accumlatedValueOfLeft > targetPoint) {
            setTimeout(slideAnimation, 1);
          }
        }
      }

      // スライドラッパーのアニメーション処理の実行
      slideAnimation();
      // 現在のインデックス情報を更新
      currentIndex = index;
      // ナビゲーションとインジケーターの情報を更新
      updateNav();
    } else {
      return;
    }
  }

  // ナビゲーションとインジケーターの情報を更新する関数
  function updateNav() {
    if (currentIndex == 0) {
      $navPrev.classList.add('hidden');
    } else {
      $navPrev.classList.remove('hidden');
    }

    if (currentIndex == totalSlide - 1) {
      $navNext.classList.add('hidden');
    } else {
      $navNext.classList.remove('hidden');
    }

    var $indicatorAnchors = $indicator.querySelectorAll('a');
    for (var i = 0; i < $indicatorAnchors.length; i ++) {
      $indicatorAnchors[i].classList.remove('active');
    }
    $indicatorAnchors[currentIndex].classList.add('active');
  }

  // 自動でページ送りする関数
  function startTimer() {
    timer = setInterval(function() {
      // 現在のスライドのインデックスに応じて次に表示するスライドの決定
      // もし最後のスライドなら最初のスライドへ
      var nextIndex = (currentIndex + 1) % totalSlide;
      goToSlide(nextIndex);
    }, interval);
  }

  // 繰り返し処理を解除
  function stopTimer() {
    clearInterval(timer);
  }

  // ナビゲーションのリンクがクリックされたら該当するスライドを表示
  $navPrev.addEventListener('click', function(event) {
    event.preventDefault();
    goToSlide(currentIndex - 1);
  });
  $navNext.addEventListener('click', function(event) {
    event.preventDefault();
    goToSlide(currentIndex + 1);
  });

  // インジケーターがクリックされたら該当するスライドを表示
  $indicator.addEventListener('click', function(event) {
    event.preventDefault();
    var $indicatorParent = event.target.parentNode;
    var $indicatorChildren = $indicatorParent.querySelectorAll('a');
    var targetIndex = Array.prototype.indexOf.call($indicatorChildren, event.target);
    if ($indicatorChildren[targetIndex].className != 'active') {
      goToSlide(targetIndex);
    }
  });

  // マウスが乗ったらタイマーを停止、離れたら再開
  $container.addEventListener('mouseenter', stopTimer);
  $container.addEventListener('mouseleave', startTimer);

  // 最初のスライドを開始
  goToSlide(currentIndex);

  // タイマー開始
  startTimer();
}

// easing "easeInOutExpo" jQuery公式を参考
function easingEaseInOutExpo (currentTime, startPoint, distance, duration) {
  if (currentTime == 0) {
    return startPoint;
  }
  if (currentTime == duration) {
    return startPoint + distance;
  }
  if ((currentTime /= duration / 2) < 1) {
    return distance / 2 * Math.pow(2, 10 * (currentTime - 1)) + startPoint;
  }
  return distance / 2 * (-Math.pow(2, -10 * --currentTime) + 2) + startPoint;
}

/*
 * Sticky Header
 */
function stickyHeader() {
  var $window = window;
  var $header = document.querySelector('#page-header');
  var $headerClone = $header.cloneNode(true);
  var $headerCloneContainer = document.createElement('div');
  $headerCloneContainer.classList.add('page-header-clone');  // <div class="page-header-clone"></div>
  $headerCloneContainer.setAttribute('id', 'page-header-clone');

  // HTMLの上辺からヘッダーの底辺までの距離
  // = ヘッダーのトップ位置 + ヘッダーの高さ
  var $headerCssStyleDeclaration = getComputedStyle($header, null);
  var $headerClientRect = $header.getBoundingClientRect();
  var headerTop = $headerClientRect.top;
  var strHeaderHeight = $headerCssStyleDeclaration.getPropertyValue('height');  // ○○px という文字列が入る
  var headerHeight = Number(strHeaderHeight.replace('px', ''));
  var threshold = headerTop + headerHeight;

  // コンテナーにヘッダークローンを挿入
  $headerCloneContainer.insertAdjacentHTML('beforeend', $headerClone.innerHTML);

  // コンテナーをbodyの最後に挿入
  document.querySelector('body').insertAdjacentHTML('beforeend', $headerCloneContainer.outerHTML);

  // イベントの設定
  $window.addEventListener('scroll', function() {
    var $pageHeaderClone = document.querySelector('.page-header-clone');
    if ($window.pageYOffset > threshold) {
      $pageHeaderClone.classList.add('visible');
    } else {
      $pageHeaderClone.classList.remove('visible');
    }
  });

  // スクロールイベントを発生させる
  $window.scroll();
}

/*
 * tabs panel
 */
function tabPanel() {
  // DOM化
  var $container = document.querySelector('#work');
  var $tabList = $container.querySelector('.tabs-nav');
  var $tabListAnchors = $tabList.querySelectorAll('a');
  var $tabPanels = $container.querySelectorAll('.tabs-panel');

  // タブがクリックされたときの処理
  $tabList.addEventListener('click', function(event) {
    event.preventDefault();
    var $targetTabHTML = event.target;                             // <a href="">○○</a>が入る
    var targetTabAttribute = $targetTabHTML.getAttribute('href');  // ↑のhrefの中身が入る

    // もし既に選択されたタブなら何もせずに処理を終了
    if ($targetTabHTML.className == 'active') {
      return;
    }

    // 全てのタブの選択状態を解除
    for (var i = 0; i < $tabListAnchors.length; i++) {
      $tabListAnchors[i].classList.remove('active');
    }

    // クリックされたタブを選択状態にする
    $targetTabHTML.classList.add('active');

    // 全てのパネルを非表示
    for (var i = 0; i < $tabPanels.length; i++) {
      $tabPanels[i].classList.add('hidden');
    }

    // 選択されたパネルを表示
    $container.querySelector(targetTabAttribute).classList.remove('hidden');
  });

  // read-more ボタンの制御


  // 最初のパネルを表示
  $tabListAnchors[0].click();
}

/*
 * smooth scroll
 */
function smoothSchroll() {
  $back = document.querySelector('.back-to-top');

  // ボタンにクリックイベントを設定
  $back.addEventListener('click', function(event) {
    event.preventDefault();
    scrollToTop();
  });
}

/* scroll用関数 */
function scrollToTop() {
  let x1 = x2 = x3 = 0;
  let y1 = y2 = y3 = 0;
  if (document.documentElement) {
    x1 = document.documentElement.scrollLeft || 0;
    y1 = document.documentElement.scrollTop || 0;
  }
  if (document.body) {
    x2 = document.body.scrollLeft || 0;
    y2 = document.body.scrollTop || 0;
  }
  x3 = window.scrollX || 0;
  y3 = window.scrollY || 0;

  let x = Math.max(x1, Math.max(x2, x3));
  let y = Math.max(y1, Math.max(y2, y3));

  window.scrollTo(Math.floor(x / 2), Math.floor(y / 2));

  if (x > 0 || y > 0) {
    window.setTimeout(scrollToTop, 30);
  }
}

window.addEventListener('load', function() {
  slideShow();
  stickyHeader();
  tabPanel();
  smoothSchroll();
});
