"use strict";

// ==UserScript==
// @name         Delete Empty Modules
// @namespace    https://se.edu/cidt
// @version      0.1.0
// @description  Adds a button to automatically delete empty modules
// @author       CIDT
// @match        https://*.instructure.com/courses/*/modules
// @icon         https://www.google.com/s2/favicons?sz=64&domain=instructure.com
// @grant        none
// ==/UserScript==

const headers = document.querySelectorAll(".collapse_module_link");

function indexOf(name, skip) {
  for (let i = skip; i < headers.length; i++) {
    if (headers[i].title === name) {
      return i;
    }
  }

  return -1;
}

function isEmpty(index) {
  let mod = headers[index].parentElement.parentElement;
  return mod.children[2].children[0].children.length === 0;
}
