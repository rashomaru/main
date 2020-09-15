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

  // 各slideを横一面に並べる
  for(var i = 0; i < totalSlide; i++) {
    $slides[i].style.left = (100 * i) + '%';
    indicatorHTML += '<a href="./">' + (i + 1) + '</a>';
  }

  // インジケーターにコンテンツを挿入
  $indicator.insertAdjacentHTML('beforeend', indicatorHTML);

  // コンテンツを表示する関数
  function goToSlide(index) {
    $slideGroup.style.left = (- 100 * index) + '%';

    // 現在のインデックス情報を更新
    currentIndex = index;
    // ナビゲーションとインジケーターの情報を更新
    updateNav();
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

window.addEventListener('load', function() {
  slideShow();
});
