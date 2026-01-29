// Initialize all carousels on the page. Each carousel gets its own state and autoplay timer.
(function () {
  const CAROUSEL_SELECTOR = '.carousel';
  const DEFAULT_INTERVAL = 4000; // ms

  function initCarousel(carousel) {
    const track = carousel.querySelector('.carousel__track');
    if (!track) return;
    const slides = Array.from(track.children);
    if (!slides.length) return;
    const nextButton = carousel.querySelector('.carousel__button--next');
    const prevButton = carousel.querySelector('.carousel__button--prev');
    let nav = carousel.querySelector('.carousel__nav');
    let currentIndex = 0;
    let slideWidth = 0;
    let autoplayId = null;

    // ensure nav exists
    if (!nav) {
      nav = document.createElement('div');
      nav.className = 'carousel__nav';
      carousel.appendChild(nav);
    }

    function setSlidePositions() {
      // compute width from first slide
      slideWidth = slides[0].getBoundingClientRect().width || slides[0].offsetWidth;
      slides.forEach((slide, index) => {
        slide.style.left = (slideWidth * index) + 'px';
      });
      moveToSlide(currentIndex);
    }

    function moveToSlide(index) {
      track.style.transform = 'translateX(-' + (slideWidth * index) + 'px)';
      updateIndicators(index);
    }

    function updateIndicators(index) {
      const indicators = Array.from(nav.children);
      indicators.forEach((dot, i) => dot.classList.toggle('is-selected', i === index));
    }

    function createIndicators() {
      nav.innerHTML = '';
      slides.forEach((_, index) => {
        const button = document.createElement('button');
        button.className = 'carousel__indicator';
        button.setAttribute('aria-label', 'Go to slide ' + (index + 1));
        button.addEventListener('click', () => {
          currentIndex = index;
          moveToSlide(currentIndex);
          restartAutoplay();
        });
        nav.appendChild(button);
      });
      if (nav.children[0]) nav.children[0].classList.add('is-selected');
    }

    if (nextButton) nextButton.addEventListener('click', () => { currentIndex = (currentIndex + 1) % slides.length; moveToSlide(currentIndex); restartAutoplay(); });
    if (prevButton) prevButton.addEventListener('click', () => { currentIndex = (currentIndex - 1 + slides.length) % slides.length; moveToSlide(currentIndex); restartAutoplay(); });

    // Autoplay controls
    function startAutoplay() {
      if (autoplayId) return;
      autoplayId = setInterval(() => {
        currentIndex = (currentIndex + 1) % slides.length;
        moveToSlide(currentIndex);
      }, DEFAULT_INTERVAL);
    }
    function stopAutoplay() { if (!autoplayId) return; clearInterval(autoplayId); autoplayId = null; }
    function restartAutoplay() { stopAutoplay(); startAutoplay(); }

    // Pause on hover/focus
    carousel.addEventListener('mouseenter', stopAutoplay);
    carousel.addEventListener('mouseleave', startAutoplay);
    carousel.addEventListener('focusin', stopAutoplay);
    carousel.addEventListener('focusout', startAutoplay);

    // keyboard support when carousel is focused
    carousel.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') { e.preventDefault(); if (prevButton) prevButton.click(); }
      if (e.key === 'ArrowRight') { e.preventDefault(); if (nextButton) nextButton.click(); }
    });

    // Resize handling
    window.addEventListener('resize', setSlidePositions);

    // wait for images to load to get correct widths
    const images = carousel.querySelectorAll('img');
    const imagePromises = Array.from(images).map(img => new Promise(res => {
      if (img.complete) return res();
      img.addEventListener('load', res);
      img.addEventListener('error', res);
    }));
    Promise.all(imagePromises).then(() => {
      setSlidePositions();
      createIndicators();
      startAutoplay();
    }).catch(() => {
      setSlidePositions(); createIndicators(); startAutoplay();
    });
  }

  // Initialize every carousel on the page
  document.querySelectorAll(CAROUSEL_SELECTOR).forEach(initCarousel);
})();