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

function indexOf(name, skip) {
  let headers = document.querySelectorAll(".collapse_module_link");

  for (let i = skip; i < headers.length; i++) {
    if (headers[i].title === name) {
      return i;
    }
  }

  return -1;
}

function isEmpty(index) {
  let headers = document.querySelectorAll(".collapse_module_link");
  let mod = headers[index].parentElement.parentElement;
  return mod.children[2].children[0].children.length === 0;
}

// Click on the three vertical dots

function openMenu(name, skip) {
  let headers = document.querySelectorAll(".collapse_module_link");
  let idx = indexOf(name, skip);
  let hpe = headers[idx].parentElement;

  if (
    hpe.children.length > 5 &&
    hpe.children[5].children.length > 0 &&
    hpe.children[5].children[0].children.length > 3
  ) {
    let btn = headers[idx].parentElement.children[5].children[0].children[3];

    if (btn.getAttribute("aria-label").startsWith("Manage")) {
      btn.click();
    }
  }
}

// Click on the "Delete" option

function clickDelete() {
  let menus = document.querySelectorAll(".ui-kyle-menu");

  for (let i = 0; i < menus.length; i++) {
    if (
      menus[i].getAttribute("aria-hidden") === "false" &&
      menus[i].children.length > 2 &&
      menus[i].children[4].children.length > 0
    ) {
      menus[i].children[4].children[0].click();
    }
  }
}

// We must do this to automate the confirmation alert

function overrideConfirm() {
  let orig = window.confirm;

  window.confirm = function () {
    return true;
  };

  return orig;
}

// ...but we don't want it to *always* return true
// TODO: Potential data race?

function restoreConfirm(orig) {
  window.confirm = orig;
}

function removeAll() {
  let orig = overrideConfirm();
  let skip = indexOf("START HERE", 1);
  let headers = document.querySelectorAll(".collapse_module_link");

  for (let i = skip; i < headers.length; i++) {
    let name = headers[i].title;

    if (!isEmpty(i)) {
      continue;
    }

    openMenu(name, skip);
    clickDelete();
  }

  restoreConfirm(orig);
}

function addButton() {
  let headerBar = document.querySelector(".header-bar-right__buttons");
  let newHTML = '<a class="btn" tabindex="0" id="cidt-delete">Remove Empty</a>';

  headerBar.insertAdjacentHTML("afterbegin", newHTML);
  headerBar.insertAdjacentHTML("afterbegin", "&nbsp;");

  let cidtBtn = document.querySelector("#cidt-delete");
  cidtBtn.addEventListener("click", removeAll, false);
}

addButton();
