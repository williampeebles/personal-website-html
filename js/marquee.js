// Ensure marquee track is wide enough by duplicating its inner content until it exceeds twice the container width.
window.addEventListener('load', () => {
  const marquees = document.querySelectorAll('.site-banner__marquee .marquee__track');
  marquees.forEach(track => {
    const container = track.parentElement;
    if (!container) return;
    // measure and duplicate until the track width >= 2 * container width
    const ensureWide = () => {
      const containerWidth = container.getBoundingClientRect().width;
      let trackWidth = track.getBoundingClientRect().width;
      // limit duplicates to avoid infinite loops
      let attempts = 0;
      while (trackWidth < containerWidth * 2 && attempts < 6) {
        // clone all children and append
        const children = Array.from(track.children).map(n => n.cloneNode(true));
        children.forEach(c => track.appendChild(c));
        trackWidth = track.getBoundingClientRect().width;
        attempts++;
      }
    };
    ensureWide();
    // on resize, re-check once
    let resizeTimeout = null;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(ensureWide, 250);
    });
  });
});