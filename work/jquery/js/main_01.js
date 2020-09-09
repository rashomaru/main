$(function() {
  var duration = 300;  // animation time

  changeButtonColor(duration);
  caption(duration);
});

/*
 * ボタンの効果表現方法
 */
function changeButtonColor(duration) {
  $('#buttons1').each(function() {
    var $buttons01 = $(this).find('.buttons01');  // buttons 1行目
    var $buttons02 = $(this).find('.buttons02');  // buttons 2行目
    var $buttons03 = $(this).find('.buttons03');  // buttons 3行目

    $buttons01
      .on('mouseover', function() {
        $(this).stop(true).animate({
          backgroundColor: '#ebc000',
          color: '#fff'
        }, duration);
      })
      .on('mouseout', function() {
        $(this).stop(true).animate({
          backgroundColor: '#fff',
          color: '#666'
        }, duration);
      });

    $buttons02
      .on('mouseover', function() {
        $(this).stop(true).animate({
          borderWidth: '2rem',
          color: '#ebc000'
        }, duration, 'easeOutSine');
      })
      .on('mouseout', function() {
        $(this).stop(true).animate({
          borderWidth: '0px',
          color: '#666'
        }, duration, 'easeOutSine');
      });

    $buttons03
      .on('mouseenter', function() {
        $(this).find('.bg').stop(true).animate({
          height: '100%'
        }, duration, 'easeOutQuad');
      })
      .on('mouseleave', function() {
        $(this).find('.bg').stop(true).animate({
          height: 0
        }, duration, 'easeOutQuad');
      });
  });
}

/*
 * キャプション表現
 */

function caption(duration) {
  $('#images').each(function() {
    var $images = $('.image-child');

    // 1つ目の画像
    $images.filter(':nth-child(1)')
      .on('mouseover', function() {
        $(this).find('strong, span').stop(true).animate({
          opacity: 1
        }, duration);
      })
      .on('mouseout', function() {
        $(this).find('strong, span').stop(true).animate({
          opacity: 0
        }, duration)
      });

    // 2つ目の画像
    $images.filter(':nth-child(2)')
      .on('mouseover', function() {
        $(this).find('strong').stop(true).animate({
          opacity: 1,
          left: 0
        }, duration);
        $(this).find('span').stop(true).animate({
          opacity: 1
        }, duration);
      })
      .on('mouseout', function() {
        $(this).find('strong').stop(true).animate({
          opacity: 0,
          left: '-200%'
        }, duration);
        $(this).find('span').stop(true).animate({
          opacity: 0
        }, duration);
      });

    // 3つ目の画像
    $images.filter(':nth-child(3)')
      .on('mouseover', function() {
        $(this).find('strong').stop(true).animate({
          bottom: 0
        }, duration);
        $(this).find('span').stop(true).animate({
          opacity: 1
        }, duration);
        $(this).find('img').stop(true).animate({
          top: '-20px'
        }, duration);
      })
      .on('mouseout', function() {
        $(this).find('strong').stop(true).animate({
          bottom: '-80px'
        }, duration);
        $(this).find('span').stop(true).animate({
          opacity: 0
        }, duration);
        $(this).find('img').stop(true).animate({
          top: 0
        }, duration);
      });
  });
}
