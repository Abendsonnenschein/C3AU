"use strict";

// ==UserScript==
// @name         Add Date Headers
// @namespace    https://se.edu/cidt
// @version      0.1.0
// @description  Adds a button to automatically add date headers in Canvas
// @author       CIDT
// @match        https://*.instructure.com/courses/*/modules
// @icon         https://www.google.com/s2/favicons?sz=64&domain=instructure.com
// @grant        none
// ==/UserScript==

const datesB = {
  "Week 1": "*March 4 - 10*",
  "Week 2": "*March 11 - 17*",
  "Week 3": "*March 25 - 31*",
  "Week 4": "*April 1 - 7*",
  "Week 5": "*April 8 - 14*",
  "Week 6": "*April 15 - 21*",
  "Week 7": "*April 22 - 28*",
  "Week 8": "*April 29 - May 5*",
};

const datesF = {
  "Week 1": "*January 8 - 14*",
  "Week 2": "*January 15 - 21*",
  "Week 3": "*January 22 - 28*",
  "Week 4": "*January 29 - February 4*",
  "Week 5": "*February 5 - 11*",
  "Week 6": "*February 12 - 18*",
  "Week 7": "*February 19 - 25*",
  "Week 8": "*February 26 - March 3*",
  "Week 9": "*March 4 - 10*",
  "Week 10": "*March 11 - 17*",
  "Week 11": "*March 25 - 31*",
  "Week 12": "*April 1 - 7*",
  "Week 13": "*April 8 - 14*",
  "Week 14": "*April 15 - 21*",
  "Week 15": "*April 22 - 28*",
  "Week 16": "*April 29 - May 5*",
};

const headers = document.querySelectorAll(".collapse_module_link");

function indexOf(name, skip) {
  for (let i = skip; i < headers.length; i++) {
    if (headers[i].title === name) {
      return i;
    }
  }

  return -1;
}

function useSubheader() {
  let gblSel = document.querySelector("#add_module_item_select");
  let options = gblSel.options;

  for (let i = 0; i < options.length; i++) {
    options[i].value = "context_module_sub_header";
  }
}

function setInputValue(val) {
  document.querySelector("#sub_header_title").value = val;
}

function submitAdd() {
  document.querySelector(".add_item_button").click();
}

// Click on the plus sign

function openMenu(name, skip) {
  let idx = indexOf(name, skip);
  let hpe = headers[idx].parentElement;

  if (
    hpe.children.length > 5 &&
    hpe.children[5].children.length > 0 &&
    hpe.children[5].children[0].children.length > 2
  ) {
    let btn = headers[idx].parentElement.children[5].children[0].children[2];

    if (btn.getAttribute("aria-label").startsWith("Add Content")) {
      btn.click();
    }
  }
}

function addDates(dateSet) {
  let endIndex = indexOf("START HERE", 1);

  if (endIndex === -1) {
    return;
  }

  useSubheader();

  for (let i = 0; i < endIndex; i++) {
    let name = headers[i].title;

    if (dateSet[name]) {
      openMenu(name, 0);
      setInputValue(dateSet[name]);
      submitAdd();
    }
  }
}

function addDatePrompt() {
  let isB = confirm("Is this course 7B/8B?\nCancel = No, OK = Yes");

  if (isB) {
    addDates(datesB);
  } else {
    addDates(datesF);
  }
}

function addButton() {
  let headerBar = document.querySelector(".header-bar-right__buttons");
  let newHTML = '<a class="btn" tabindex="0" id="cidt-dates">Add Dates</a>';

  headerBar.insertAdjacentHTML("afterbegin", newHTML);
  headerBar.insertAdjacentHTML("afterbegin", "&nbsp;");

  let cidtBtn = document.querySelector("#cidt-dates");
  cidtBtn.addEventListener("click", addDatePrompt, false);
}

addButton();
