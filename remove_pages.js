"use strict";

// ==UserScript==
// @name         Delete Template Pages
// @namespace    https://se.edu/cidt
// @version      0.1.0
// @description  Adds a button to automatically delete all the template pages in Canvas
// @author       CIDT
// @match        https://*.instructure.com/courses/*/pages
// @icon         https://www.google.com/s2/favicons?sz=64&domain=instructure.com
// @grant        none
// @run-at       document-idle
// ==/UserScript==

function shouldKeepPage(e) {
  let label = e.getAttribute("aria-label");
  let isUniInfo = label.includes("University Information");

  return isUniInfo;
}

function selectPages() {
  let elements = document.querySelectorAll(".select-page-checkbox");
  let didFindInfo = false;

  for (let i = 0; i < elements.length; i++) {
    if (shouldKeepPage(elements[i]) && !didFindInfo) {
      didFindInfo = true;
      continue;
    }

    elements[i].click();
  }
}

function clickDelete() {
  let deleteButton = document.querySelector(".delete_pages");

  if (deleteButton) {
    deleteButton.click();
  }
}

function removePages() {
  selectPages();
  clickDelete();
}

function addButton() {
  let headerBar = document.querySelector(".header-bar-right");
  let newHTML = '<a class="btn" tabindex="0" id="cidt-delete">Remove All</a>';

  headerBar.insertAdjacentHTML("afterbegin", newHTML);
  headerBar.insertAdjacentHTML("afterbegin", "&nbsp;");

  let cidtBtn = document.querySelector("#cidt-delete");

  if (cidtBtn) {
    cidtBtn.addEventListener("click", removePages, false);
  }
}

// TODO: This isn't safe/consistent. Find a better way to do it.

setTimeout(addButton, 2500);
