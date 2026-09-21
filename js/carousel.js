(() => {
  const images = [
    "assets/flores/flor01.jpg",
    "assets/flores/flor02.jpg",
    "assets/flores/flor03.jpg",
    "assets/flores/flor04.jpg",
    "assets/flores/flor05.jpg",
    "assets/flores/flor06.jpg",
    "assets/flores/flor07.jpg",
    "assets/flores/flor08.jpg",
    "assets/flores/flor09.jpg",
    "assets/flores/flor10.jpg",
    "assets/flores/flor11.jpg",
    "assets/flores/flor12.jpg"
  ];

  const track = document.getElementById("carouselTrack");
  const dots = document.getElementById("carouselDots");
  const prev = document.getElementById("prevBtn");
  const next = document.getElementById("nextBtn");

  let index = 0;
  let timer;
  let startX = null;

  images.forEach((src, i) => {
    const slide = document.createElement("div");
    slide.className = "slide";
    slide.innerHTML = `<img src="${src}" alt="Recuerdo de flores ${i + 1}" loading="${i < 3 ? "eager" : "lazy"}">`;
    track.appendChild(slide);

    const dot = document.createElement("button");
    dot.className = "dot";
    dot.setAttribute("aria-label", `Mostrar foto ${i + 1}`);
    dot.addEventListener("click", () => go(i));
    dots.appendChild(dot);
  });

  function visibleSlides() {
    if (window.innerWidth >= 1050) return 3;
    if (window.innerWidth >= 700) return 2;
    return 1;
  }

  function maxIndex() {
    return Math.max(0, images.length - visibleSlides());
  }

  function go(nextIndex) {
    index = Math.max(0, Math.min(nextIndex, maxIndex()));
    const offset = (100 / visibleSlides()) * index;
    track.style.transform = `translateX(-${offset}%)`;

    [...dots.children].forEach((dot, i) => {
      dot.classList.toggle("active", i === index);
    });
  }

  function nextSlide() {
    go(index >= maxIndex() ? 0 : index + 1);
  }

  function prevSlide() {
    go(index <= 0 ? maxIndex() : index - 1);
  }

  function restart() {
    clearInterval(timer);
    timer = setInterval(nextSlide, 3800);
  }

  prev.addEventListener("click", () => { prevSlide(); restart(); });
  next.addEventListener("click", () => { nextSlide(); restart(); });

  track.addEventListener("pointerdown", e => {
    startX = e.clientX;
    track.setPointerCapture?.(e.pointerId);
  });

  track.addEventListener("pointerup", e => {
    if (startX === null) return;
    const diff = e.clientX - startX;
    if (Math.abs(diff) > 45) {
      diff < 0 ? nextSlide() : prevSlide();
      restart();
    }
    startX = null;
  });

  window.addEventListener("resize", () => go(Math.min(index, maxIndex())));

  go(0);
  restart();
})();
