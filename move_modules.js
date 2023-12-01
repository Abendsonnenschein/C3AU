"use strict";

// ==UserScript==
// @name         Auto-Move Content
// @namespace    https://se.edu/cidt
// @version      0.1.0
// @description  Adds a button to automatically move copied content into the template modules in Canvas
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

// Click on the three vertical dots

function openMenu(name, skip) {
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

// Click on the "Move Contents" option

function openMove() {
  let menus = document.querySelectorAll(".ui-kyle-menu");

  for (let i = 0; i < menus.length; i++) {
    if (
      menus[i].getAttribute("aria-hidden") === "false" &&
      menus[i].children.length > 2 &&
      menus[i].children[2].children.length > 0
    ) {
      menus[i].children[2].children[0].click();
    }
  }
}

// React handler changes its name per reload, so we need to get this dynamically

function getReactHandler(obj) {
  let keys = Object.keys(obj);
  let rctKey = keys.find((key) => key.startsWith("__reactEventHandlers"));

  return rctKey;
}

function selectDestination(name) {
  let form = document.querySelector(".move-select-form");
  let options = form.options;

  for (let i = 0; i < options.length; i++) {
    if (options[i].text === name) {
      form.selectedIndex = i;
      form.value = options[i].value;

      let handlerName = getReactHandler(form);
      let fakeObj = { target: { value: form.value } };

      form[handlerName].onChange(fakeObj);

      return true;
    }
  }

  return false;
}

function moveAll() {
  let startIndex = indexOf("START HERE", 1);

  if (startIndex === -1) {
    return;
  }

  for (let i = startIndex; i < headers.length; i++) {
    let name = headers[i].title;

    openMenu(name, startIndex);
    openMove();

    if (selectDestination(name)) {
      document.querySelector("#move-item-tray-submit-button").click();
    }
  }
}

function addButton() {
  let headerBar = document.querySelector(".header-bar-right__buttons");
  let newHTML = '<a class="btn" tabindex="0" id="cidt-move">Auto-Move</a>';

  headerBar.insertAdjacentHTML("afterbegin", newHTML);
  headerBar.insertAdjacentHTML("afterbegin", "&nbsp;");

  let cidtBtn = document.querySelector("#cidt-move");
  cidtBtn.addEventListener("click", moveAll, false);
}

addButton();

// To check if module is empty: headers[index].parentElement.parentElement.children.length <= 2
// TODO: If a module is empty, we will get stuck on it! Need to check for this edge case first
