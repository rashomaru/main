/*
 * JavaScriptの理解を深めるため、あえてjQuery等のライブラリは使用しない。
 * デザイン自体はjQueryの参考書のを参考にし作成。
 */

/*
 * Slide Show
 */
function slideShow() {
  let $container = document.getElementById('slideshow');
  let $slideGroup = $container.getElementsByClassName('slideshow-wrapper').item(0);
  let $slides = $slideGroup.getElementsByClassName('slide');
  let $nav = $container.getElementsByClassName('slideshow-nav').item(0);
  let $indicator = $container.getElementsByClassName('slideshow-indicator').item(0);
  let $navPrev = $nav.getElementsByClassName('prev').item(0);
  let $navNext = $nav.getElementsByClassName('next').item(0);

  let totalSlide = $slides.length;
  let indicatorHTML = '';
  let currentIndex = 0;
  let duration = 500;
  let interval = 7500;
  let timer;
  let slideControl = true;  // 連打対応："goToSlide"関数が使用可能か判断するフラグ true：使用可 false：使用不可

  // 各slideを横一面に並べる
  for(let i = 0; i < totalSlide; i++) {
    $slides[i].style.left = (100 * i) + '%';
    indicatorHTML += '<a href="./">' + (i + 1) + '</a>';
  }

  // インジケーターにコンテンツを挿入
  $indicator.insertAdjacentHTML('beforeend', indicatorHTML);

  // コンテンツを表示する関数
  function goToSlide(index) {
    if (slideControl === true) {
      let accumlatedValueOfLeft = 0;  // leftに設定する値。easing処理により蓄積させていく。
      let startTime = Date.now();
      let startPoint = Math.abs(Number($slideGroup.style.left.replace('%', '')));  // スライドラッパーの|スタート地点|を入れる
      let targetPoint = 100 * index;
      let distance = targetPoint - startPoint;

      // スライドのアニメーション実行関数
      function slideAnimation() {
        // この関数の処理が完了するまでgoToSlide禁止
        slideControl = false;

        let currentTime = Date.now() - startTime;
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
        let slideGroupLeftValue = Math.abs(Number($slideGroup.style.left.replace('%', '')));

        if (slideGroupLeftValue === 0 || slideGroupLeftValue % 100 === 0) {
          slideControl = true;
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
    if (currentIndex === 0) {
      $navPrev.classList.add('hidden');
    } else {
      $navPrev.classList.remove('hidden');
    }

    if (currentIndex === totalSlide - 1) {
      $navNext.classList.add('hidden');
    } else {
      $navNext.classList.remove('hidden');
    }

    let $indicatorAnchors = $indicator.getElementsByTagName('a');
    for (let i = 0; i < $indicatorAnchors.length; i ++) {
      $indicatorAnchors[i].classList.remove('active');
    }
    $indicatorAnchors[currentIndex].classList.add('active');
  }

  // 自動でページ送りする関数
  function startTimer() {
    timer = setInterval(function() {
      // 現在のスライドのインデックスに応じて次に表示するスライドの決定
      // もし最後のスライドなら最初のスライドへ
      let nextIndex = (currentIndex + 1) % totalSlide;
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
    let $indicatorParent = event.target.parentNode;
    let $indicatorChildren = $indicatorParent.getElementsByTagName('a');
    let targetIndex = Array.prototype.indexOf.call($indicatorChildren, event.target);
    if ($indicatorChildren[targetIndex].className !== 'active') {
      goToSlide(targetIndex);
    }
  });

  // スライドイメージのクリック制御
  $slideGroup.addEventListener('click', function(event) {
    event.preventDefault();
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
  if (currentTime === 0) {
    return startPoint;
  }
  if (currentTime === duration) {
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
  let $window = window;
  let $header = document.getElementById('page-header');
  let $primaryNav = $header.getElementsByClassName('primary-nav').item(0);
  let $headerClone = $header.cloneNode(true);
  let $headerCloneContainer = document.createElement('div');
  $headerCloneContainer.classList.add('page-header-clone');  // <div class="page-header-clone"></div>
  $headerCloneContainer.setAttribute('id', 'page-header-clone');

  // HTMLの上辺からヘッダーの底辺までの距離
  // = ヘッダーのトップ位置 + ヘッダーの高さ
  let $headerCssStyleDeclaration = getComputedStyle($header, null);
  let $headerClientRect = $header.getBoundingClientRect();
  let headerTop = $headerClientRect.top + $window.pageYOffset;  // ウィンドウのスクロール量を考慮
  let strHeaderHeight = $headerCssStyleDeclaration.getPropertyValue('height');  // ○○px という文字列が入る
  let headerHeight = Number(strHeaderHeight.replace('px', ''));
  let threshold = headerTop + headerHeight;

  // コンテナーにヘッダークローンを挿入
  $headerCloneContainer.insertAdjacentHTML('beforeend', $headerClone.innerHTML);

  // コンテナーをbodyの最後に挿入
  document.querySelector('body').insertAdjacentHTML('beforeend', $headerCloneContainer.outerHTML);

  // イベントの設定
  $window.addEventListener('scroll', function() {
    let $pageHeaderClone = document.getElementsByClassName('page-header-clone').item(0);
    if ($window.pageYOffset > threshold) {
      $pageHeaderClone.classList.add('visible');
    } else {
      $pageHeaderClone.classList.remove('visible');
    }
  });

  // primaryNavのクリック時の制御
  $primaryNav.addEventListener('click', function(event) {
    event.preventDefault();
  })

  // スクロールイベントを発生させる
  $window.scroll();
}
/*
 * Hot Topics
 */
function hotTopics() {
  let $container = document.getElementById('topics');
  let $topics = $container.getElementsByClassName('topic-wrapper').item(0);

  // 画像を押した時に何もしない
  $topics.addEventListener('click', function(event) {
    event.preventDefault();
  })
}
/*
 * tabs panel
 */
function tabPanel() {
  // DOM化
  let $container = document.getElementById('work');
  let $tabList = $container.getElementsByClassName('tabs-nav').item(0);
  let $tabListAnchors = $tabList.getElementsByTagName('a');
  let $tabPanels = $container.getElementsByClassName('tabs-panel');

  // タブがクリックされたときの処理
  $tabList.addEventListener('click', function(event) {
    event.preventDefault();
    let $targetTabHTML = event.target;                      // <a href="">○○</a>が入る
    let targetTabId = $targetTabHTML.getAttribute('href');  // ↑のhrefを格納

    // もし既に選択されたタブなら何もせずに処理を終了
    if ($targetTabHTML.className === 'active') {
      return;
    }

    // 全てのタブの選択状態を解除
    for (let i = 0; i < $tabListAnchors.length; i++) {
      $tabListAnchors[i].classList.remove('active');
    }

    // クリックされたタブを選択状態にする
    $targetTabHTML.classList.add('active');

    // 全てのパネルを非表示
    for (let i = 0; i < $tabPanels.length; i++) {
      $tabPanels[i].classList.add('hidden');
    }

    // 選択されたパネルを表示
    $container.querySelector(targetTabId).classList.remove('hidden');
  });

  // 最初のパネルを表示
  $tabListAnchors[0].click();
}

/*
 * smooth scroll
 */
function smoothSchroll() {
  $back = document.getElementsByClassName('back-to-top').item(0);

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
  hotTopics();
  tabPanel();
  smoothSchroll();
});
