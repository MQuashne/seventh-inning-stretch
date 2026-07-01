export const $n = (type, classes = null, parent = null) => {
  const el = document.createElement(type);
  if (classes) {
    if (Array.isArray(classes)) {
      classes.forEach((cl) => el.classList.add(cl))
    } else {
      el.classList.add(classes)
    }
  }
  parent && parent.appendChild(el);
  return el
}

export const $t = (id) => document.getElementById(id);

export const $c = (id) => document.querySelector(`.${id}`);

export const $a = id => document.querySelectorAll(`.${id}`);

export const on = (el, event, cb) => el.addEventListener(event, cb);

/*
import {$n, $t, $c, $a, on} from '../util.js'
*/