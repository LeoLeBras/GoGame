/**
  * DOM
  *
  * Inspired by the code of bloodyowl (https://gist.github.com/bloodyowl/144804438bf5bce8120a#file-core-js)
  */   

function $(selector) {
    if(selector == null) {
        return []
     }
     if(typeof selector === "string") {
         return [...document.querySelectorAll(selector)]
      }
      if(typeof selector.nodeType === "number") {
         return Array.of(selector)
       }
       if(typeof selector.length === "number") {
        return [...selector]
      }
}
 
function on(type, listener, capture) {
    this.forEach((element) => {
      element.addEventListener(type, listener, capture)
    })
    return this
}
 
function addClass(...classNames) {
    this.forEach((element) => {
      element.classList.add(...classNames)
    })
}
 
function removeClass(...classNames) {
    this.forEach((element) => {
        element.classList.remove(...classNames)
    })
    return this
}
 
function toggleClass(...classNames) {
    this.forEach((element) => {
        element.classList.toggle(...classNames)
    })
    return this
}
 
function hasClass(...classNames) {
    for(const element of this) {
        return element.classList.contains(...classNames)
    }
}
 
function css(object){
    this.forEach((element) => {
        for(let key in object) {
            element.style[key] = object[key];
        }
    })
    return this;
}

function width(value){
    this.forEach((element) => {
        element.width = value;
    })
    return this;
}

function height(value){
    this.forEach((element) => {
        element.height = value;
    })
    return this;
}

function trigger(value){
    this.forEach((element) => {
        simulate(element, value);
    });
    return this;
}