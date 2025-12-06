// ===== Fixed carousel script =====
var slides = document.getElementsByClassName("slide");
var videos = document.getElementsByClassName("video");
var buttons = document.getElementsByTagName("button");

var is_active = true;
var focal = 0;
var left = (slides.length > 0) ? slides.length - 1 : 0;
var right = (slides.length > 1) ? 1 : 0;
var xtime = 0;

var x, orig_left, orig_right;

// Auto timers
setInterval(function () { xtime++; auto_slide(0); }, 1000);
setInterval(video_check, 1000);

// Touch swipe
var startingX, startingY, endingX, endingY;
var moving = false;

function touchstart(evt) {
  if (!evt.targetTouches || !evt.targetTouches[0]) return;
  startingX = evt.targetTouches[0].clientX;
  startingY = evt.targetTouches[0].clientY;
  moving = false;
}
function touchmove(evt) {
  if (!evt.targetTouches || !evt.targetTouches[0]) return;
  moving = true;
  endingX = evt.targetTouches[0].clientX;
  endingY = evt.targetTouches[0].clientY;
}
function touchend() {
  if (!moving) return;
  var touchDirection;
  if (Math.abs(endingX - startingX) > Math.abs(endingY - startingY)) {
    touchDirection = (endingX > startingX) ? "Right" : "Left";
  }
  if (touchDirection === "Right") trans_left();
  else if (touchDirection === "Left") trans_right();
  moving = false;
}

// Initialization
window.onload = function () {
  // re-query in case DOM changed
  slides = document.getElementsByClassName("slide");

  for (var i = 0; i < slides.length; i++) {
    var s = slides.item(i);

    // set non-visible slides to tiny/hidden state
    if (s === slides.item(focal) || s === slides.item(left) || s === slides.item(right)) {
      // leave visible ones alone
    } else {
      s.style.zIndex = "0";
      s.style.height = "15vw";
      s.style.width = "20vw";
      s.style.left = "50%";
      s.style.transform = "translate(-50%)";
      s.style.opacity = "0";
      if (s.children && s.children.item(3) != null) {
        s.children.item(3).style.opacity = "0";
      }
    }

    // mousewheel/wheel handlers
    if (s.addEventListener) {
      s.addEventListener("wheel", MouseWheelHandler, { passive: false });
      s.addEventListener("mousewheel", MouseWheelHandler, { passive: false });
      s.addEventListener("DOMMouseScroll", MouseWheelHandler, { passive: false });
    } else {
      s.attachEvent("onmousewheel", MouseWheelHandler);
    }

    // safe hover handlers (idempotent client-side)
    s.addEventListener("mouseenter", function () { disableScroll(); }, false);
    s.addEventListener("mouseleave", function () { enableScroll(); }, false);
  }

  // position focal/left/right slides
  if (slides.item(focal)) {
    slides.item(focal).style.left = "50%";
    slides.item(focal).style.transform = "translate(-50%)";
    slides.item(focal).style.zIndex = "3";
    slides.item(focal).style.height = "40vw";
    slides.item(focal).style.width = "60vw";
  }
  if (slides.item(left)) {
    slides.item(left).style.left = "5%";
    slides.item(left).style.transform = "translate(-80%)";
    slides.item(left).style.opacity = "0.5";
    slides.item(left).style.height = "33vw";
    slides.item(left).style.width = "50vw";
    if (slides.item(left).children.item(3) != null) slides.item(left).children.item(3).style.opacity = "0";
  }
  if (slides.item(right)) {
    slides.item(right).style.left = "95%";
    slides.item(right).style.transform = "translate(-20%)";
    slides.item(right).style.opacity = "0.5";
    slides.item(right).style.height = "33vw";
    slides.item(right).style.width = "50vw";
    if (slides.item(right).children.item(3) != null) slides.item(right).children.item(3).style.opacity = "0";
  }

  video_check();
};

// Wheel handler (works for modern 'wheel', legacy 'mousewheel', and 'DOMMouseScroll')
function MouseWheelHandler(e) {
  e = e || window.event;
  // Prevent page scroll bounce while inside carousel
  if (e.preventDefault) e.preventDefault();

  var delta;
  if (typeof e.wheelDelta !== 'undefined') {
    delta = e.wheelDelta;
  } else if (typeof e.deltaY !== 'undefined') {
    delta = -e.deltaY;
  } else if (typeof e.detail !== 'undefined') {
    delta = -e.detail;
  } else {
    delta = 0;
  }

  // normalize direction
  delta = Math.max(-1, Math.min(1, delta));
  if (delta > 0) trans_right();
  else trans_left();

  anti_scroll_spam();
  return false;
}

function anti_scroll_spam() {
  // temporarily detach wheel listeners to prevent spam
  for (var i = 0; i < slides.length; i++) {
    var s = slides.item(i);
    try {
      s.removeEventListener("wheel", MouseWheelHandler, { passive: false });
      s.removeEventListener("mousewheel", MouseWheelHandler, { passive: false });
      s.removeEventListener("DOMMouseScroll", MouseWheelHandler, { passive: false });
    } catch (err) {
      // older attachEvent cleanup
      try { s.removeEventListener("mousewheel", MouseWheelHandler, false); } catch (e) { }
    }
  }
  setTimeout(function () {
    for (var j = 0; j < slides.length; j++) {
      var s2 = slides.item(j);
      try {
        s2.addEventListener("wheel", MouseWheelHandler, { passive: false });
        s2.addEventListener("mousewheel", MouseWheelHandler, { passive: false });
        s2.addEventListener("DOMMouseScroll", MouseWheelHandler, { passive: false });
      } catch (err) {
        try { s2.addEventListener("mousewheel", MouseWheelHandler, false); } catch (e) { }
      }
    }
  }, 250);
}

// Safe disable/enable scroll (idempotent)
function disableScroll() {
  if (!document.documentElement.classList.contains('scroll-disabled')) {
    document.documentElement.classList.add('scroll-disabled');
  }
}
function enableScroll() {
  if (document.documentElement.classList.contains('scroll-disabled')) {
    document.documentElement.classList.remove('scroll-disabled');
  }
}

function video_check() {
  for (var i = 0; i < videos.length; i++) {
    if (videos.item(i) && videos.item(i).paused == false) {
      auto_slide(1);
      return;
    }
  }
}

function anti_spam() {
  if (is_active == true) {
    is_active = false;
    for (var i = 0; i < buttons.length; i++) {
      buttons.item(i).disabled = true;
    }
    setTimeout(anti_spam, 250);
  } else {
    is_active = true;
    for (var i = 0; i < buttons.length; i++) {
      buttons.item(i).disabled = false;
    }
  }
}

function auto_slide(was_clicked) {
  if (was_clicked == 1) xtime = 0;
  if (xtime > 10000) {
    trans_right();
    xtime = 0;
  }
}

// NOTE: trans_left and trans_right left unchanged - keep your existing implementations
// but ensure x, orig_left, orig_right are used as defined above.
// If you want, I can paste the full trans_left/trans_right here merged with the var declarations.



function trans_left() {
  x = left - 1;
  if (x == -1) {
    x = slides.length - 1;
  }

  slides.item(focal).style.animation = "F2R 0.25s ease-in-out 1";
  slides.item(focal).style.animationFillMode = "forwards";
  if (!(slides.item(focal).children.item(3) == null)) {
    slides.item(focal).children.item(3).style.animation = "FadeContents 0.25s ease-in-out 1";
    slides.item(focal).children.item(3).style.animationFillMode = "forwards";
  }
  slides.item(right).style.animation = "R2B 0.25s ease-in-out 1";
  slides.item(right).style.animationFillMode = "forwards";
  slides.item(x).style.animation = "B2L 0.25s ease-in-out 1";
  slides.item(x).style.animationFillMode = "forwards";
  slides.item(left).style.animation = "L2F 0.25s ease-in-out 1";
  slides.item(left).style.animationFillMode = "forwards";
  if (!(slides.item(left).children.item(3) == null)) {
    slides.item(left).children.item(3).style.animation = "ShowContents 0.25s ease-in-out 1";
    slides.item(left).children.item(3).style.animationFillMode = "forwards";
  }

  orig_left = left;
  orig_right = right;
  left = x;
  right = focal;
  focal = orig_left;

  for (let i = 0; i < videos.length; i++) {
    if (videos.item(i) == slides.item(focal).children.item(0)) {
      videos.item(i).play();
    }
    else {
      videos.item(i).pause();
    }
  }

  auto_slide(1);
}

function trans_right() {
  x = right + 1;
  if (x >= slides.length) {
    slides.item(0).style.zIndex = "1";
    x = 0;
  }

  slides.item(focal).style.animation = "F2L 0.25s ease-in-out 1";
  slides.item(focal).style.animationFillMode = "forwards";
  if (!(slides.item(focal).children.item(3) == null)) {
    slides.item(focal).children.item(3).style.animation = "FadeContents 0.25s ease-in-out 1";
    slides.item(focal).children.item(3).style.animationFillMode = "forwards";
  }
  slides.item(left).style.animation = "L2B 0.25s ease-in-out 1";
  slides.item(left).style.animationFillMode = "forwards";
  slides.item(x).style.animation = "B2R 0.25s ease-in-out 1";
  slides.item(x).style.animationFillMode = "forwards";
  slides.item(right).style.animation = "R2F 0.25s ease-in-out 1";
  slides.item(right).style.animationFillMode = "forwards";
  if (!(slides.item(right).children.item(3) == null)) {
    slides.item(right).children.item(3).style.animation = "ShowContents 0.25s ease-in-out 1";
    slides.item(right).children.item(3).style.animationFillMode = "forwards";
  }

  orig_left = left;
  orig_right = right;
  left = focal;
  focal = orig_right;
  right = x;

  for (let i = 0; i < videos.length; i++) {
    if (videos.item(i) == slides.item(focal).children.item(0)) {
      videos.item(i).play();
    }
    else {
      videos.item(i).pause();
    }
  }

  auto_slide(1);
}