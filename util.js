
/**
 * Create a new element with classes and a parent.
 * @param {string} type
 * @param {array} classes
 * @param {node} parent
 */
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

export const $cl = (id) => {
  const node = document.getElementById(id)?.content.cloneNode(true).firstElementChild;
  if (!node) throw new Error(`Template "${id}" missing or empty`);

  const parts = {};
  node.querySelectorAll('[data-part]').forEach(el => {
    parts[el.dataset.part] = el;
  });

  return { root: node, ...parts };
};


export const on = (el, event, cb) => el.addEventListener(event, cb);

export async function loadCard(file,container) {
  const response = await fetch(file);
  const svg = await response.text();
  container.innerHTML=svg;
}

export function randInt(min,max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Function to recursively search for the key
export function findKey(obj, keyToFind) {
  try {
    if (obj.hasOwnProperty(keyToFind)) {
      return obj[keyToFind];
    }
    
    for (let key in obj) {
      if (typeof obj[key] === "object" && obj[key] !== null) {
        let result = findKey(obj[key], keyToFind);
        if (result !== undefined) {
          return [key,result];
        }
      }
    }
    
    return undefined;
  } catch (error) {
    console.log("error at findKey", error.message);
    console.log("keyToFind", keyToFind);
    throw new Error(error.message);
  }
}

/*
import {$n, $t, $c, $a, $cl, on, randInt,findKey} from '../util.js'
*/