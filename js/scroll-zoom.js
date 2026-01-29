// Observe elements with class 'zoomable' and add 'in-viewport' when they enter view
(function(){
  if (typeof window === 'undefined') return;
  const observer = new IntersectionObserver((entries)=>{
    entries.forEach(entry => {
      if (entry.isIntersecting){
        entry.target.classList.add('in-viewport');
      } else {
        entry.target.classList.remove('in-viewport');
      }
    });
  },{ threshold: 0.45 });

  document.addEventListener('DOMContentLoaded', ()=>{
    const els = document.querySelectorAll('.zoomable');
    els.forEach(el => observer.observe(el));
  });
})();
