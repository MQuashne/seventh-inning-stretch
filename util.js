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

export const $ac = (id,parent=document) => parent.querySelectorAll(`.${id}`);

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

export async function loadCard(file, container) {
  const response = await fetch(file);
  const svg = await response.text();
  container.innerHTML = svg;
}

export function randInt(min, max) {
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
          return [key, result];
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

export function darkenHex(hex, amount) {
  // Remove the # if present
  hex = hex.replace(/^#/, '');
  
  // Parse r, g, b components
  let r = parseInt(hex.substring(0, 2), 16);
  let g = parseInt(hex.substring(2, 4), 16);
  let b = parseInt(hex.substring(4, 6), 16);
  
  // Subtract amount and clamp to min 0
  r = Math.max(0, r - amount);
  g = Math.max(0, g - amount);
  b = Math.max(0, b - amount);
  
  // Convert back to hex format with padding
  const toHex = (val) => val.toString(16).padStart(2, '0');
  
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

export const hide = (el) => {
  if (Array.isArray(el)) {
    el.forEach((e) => { e.classList.add("hidden"); })
  } else {
    el.classList.add("hidden");
  }
}

export const show = (el) => {
  if (Array.isArray(el)) {
    el.forEach((e) => { e.classList.remove("hidden"); })
  } else {
    el.classList.remove("hidden");
  }
}

export const disable = (el) => {
  if (Array.isArray(el)) {
    el.forEach((e) => { e.disabled=true; })
  } else {
    el.disabled=true;
  }
}

export const enable = (el) => {
  if (Array.isArray(el)) {
    el.forEach((e) => { e.disabled = false; })
  } else {
    el.disabled = false;
  }
}



/*
import {$n, $t, $c, $a, $cl, on, randInt,findKey} from '../util.js'
*/