document.addEventListener('DOMContentLoaded', function () {
  var link = document.querySelector("link[rel='icon']");
  if (!link) return;
  var img = new Image();
  img.onload = function () {
    var canvas = document.createElement('canvas');
    canvas.width = canvas.height = 64;
    var ctx = canvas.getContext('2d');
    ctx.beginPath();
    ctx.arc(32, 32, 32, 0, Math.PI * 2);
    ctx.clip();
    ctx.drawImage(img, 0, 0, 64, 64);
    link.href = canvas.toDataURL('image/png');
  };
  img.src = '_images/favicon.png';
});
