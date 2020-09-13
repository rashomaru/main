function slideShow() {
  var $container = document.querySelector('#slideshow');
  var $slideGroup = document.querySelector('.slideshow-wrapper');
  var $slide = document.querySelectorAll('.slide');
  var $nav = document.querySelector('.slideshow-nav');
  var $indicator = document.querySelector('.slideshow-indicator');

  var totalSlide = $slide.length;
  var indicatorHTML = '';
  var currentIndex = 0;
  var duration = 500;
  var interval = 7500;
  var timer;

  // 各slideを横一面に並べる
  for(var i = 0; i < totalSlide; i++) {
    $slide[i].style.left = (100 * i) + '%';
    indicatorHTML += '<a href="./">' + (i + 1) + '</a>';
  }

  // インジケーターにコンテンツを挿入
  $indicator.insertAdjacentHTML('afterbegin', indicatorHTML);

  // コンテンツを表示する関数
  function goToSlide(index) {
    $slideGroup.animate({
      left: (- 100 * index) + '%'
    }, duration);

    // 現在のインデックス情報を更新
    currentIndex = index;
    // ナビゲーションとインジケーターの情報を更新
    updateNav();
  }

  // ナビゲーションとインジケーターの情報を更新する関数
  function updateNav() {
    var $navPrev = document.querySelector('.prev');
    var $navNext = document.querySelector('.next');

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

    $indicator.querySelector('a').classList.remove('active');
    $indicator.querySelector('a' + ':nth-child(' + (currentIndex + 1) + ')').classList.add('active');
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
  $nav.querySelector('a').addEventListener('click', function(event) {
    event.stopPropagation();
    event.preventDefault();
    if (this.className == 'prev') {
      goToSlide(currentIndex - 1);
    } else {
      goToSlide(currentIndex + 1);
    }
  });

  // インジケーターがクリックされたら該当するスライドを表示
  $indicator.querySelector('a').addEventListener('click', function(event) {
    event.stopPropagation();
    event.preventDefault();
    if (this.className != 'active') {
      goToSlide(Number(this.innerHTML) - 1);
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

window.onload = slideShow;
