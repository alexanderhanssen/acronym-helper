import acronyms from "./acronyms.json";
let findAndReplaceDOMText = require("findAndReplaceDOMText");

// REGEX To find acronyms
let æøå = "[\\wæøåÆØÅü<>\\*]";
let partialRegex = // A simple \b regex but with æøå chars as valid characters as well
  "((?:(?<!" + æøå + ")(?=" + æøå + ")|(?<=" + æøå + ")(?!" + æøå + ")))";

const replaceRegex = new RegExp(
  partialRegex + "(" + Object.keys(acronyms).join("|") + ")" + partialRegex,
  "g"
);

let messageList = document.getElementById("messageList");
let messages = messageList ? messageList.getElementsByClassName("message") : [];

for (var i = 0; i < messages.length; i++) {
  let message = messages[i];
  let messageWrapper = message.querySelector(".messageContent");
  messageWrapper.style.overflow = "visible";

  let messageTextElement = messageWrapper.querySelector(".messageText");

  makeQuoteBlockVisibleForTooltip(messageTextElement);

  findAndReplaceDOMText(messageTextElement, {
    find: replaceRegex,
    filterElements: function(el) {
      if (el.className && el.className == "attribution type") {
        return false;
      }
      return true;
    },
    replace: function(portion, match) {
      var acronym = portion.text;
      let foundAcronym =
        acronyms[acronym] ||
        acronyms["\\" + acronym] ||
        acronyms[acronym + "+"]; //Special characters...
      let wrappedAcronym =
        '<span class="acronym-tooltip tooltip-bottom-right" data-tooltip="' +
        foundAcronym +
        '">' +
        acronym +
        "</span>";
      var wrapper = document.createElement("span");
      wrapper.className = "acronym-helper-wrapper";
      wrapper.innerHTML = wrappedAcronym;
      return wrapper;
    }
  });
}

function makeQuoteBlockVisibleForTooltip(element) {
  var quoteBlock = element.querySelector(".bbCodeBlock");
  if (!quoteBlock) return;
  var allChildren = quoteBlock.querySelectorAll("*");

  var childrenList = Array.prototype.slice.call(allChildren);
  var isMinimized = childrenList.some(el => {
    return el.classList.contains("quoteCut");
  });

  var isExpanded = childrenList.some(el => {
    return el.classList.contains("expanded");
  });

  if (!isMinimized || isExpanded) {
    allChildren.forEach(el => {
      el.style.overflow = "visible";
    });
    quoteBlock.style.overflow = "visible";
  }
}

document
  .getElementsByClassName("quoteCut")[0]
  .addEventListener("click", function(event) {
    var quoteParent = event.target.closest(".messageText");
    console.log(quoteParent);
    setTimeout(function() {
      makeQuoteBlockVisibleForTooltip(quoteParent);
    }, 500);
  });
