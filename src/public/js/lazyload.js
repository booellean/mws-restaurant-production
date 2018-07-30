const options = {
  root: null,
  rootMargin: '0px',
  threshold: 0.1
};

const observer = new IntersectionObserver(lazyLoad, options);

function lazyLoad(elements){
  elements.forEach( el => {
    if(el.intersectionRatio > 0.1){
      loadItem(el.target);
      observer.unobserve(el.target);
    }
  });
}

function loadItem(el){
  let childs = el.children;
  let childrenEls = Array.from(childs);

  console.log(childrenEls);
  childrenEls.forEach( child => {
    child.style.display = 'block';
    console.log('the image was loaded');
  })
}

