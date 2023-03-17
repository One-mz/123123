function lazyLoad(name) {
  return function(resolve) {
    require(['./' + name + '.vue'], resolve);
  }
}

export default lazyLoad;