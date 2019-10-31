import acronyms from "./acronyms.json";
let findAndReplaceDOMText = require("findAndReplaceDOMText");

// REGEX To find acronyms
let wordChars = "[\\wæøåÆØÅü<>\\*]";
let partialRegex = // A simple \b regex but with æøå chars as valid characters as well
  "((?:(?<!" +
  wordChars +
  ")(?=" +
  wordChars +
  ")|(?<=" +
  wordChars +
  ")(?!" +
  wordChars +
  ")))";
const replaceRegex = new RegExp(
  partialRegex + "(" + Object.keys(acronyms).join("|") + ")" + partialRegex,
  "g"
);
console.log(replaceRegex);
let messageList = document.getElementById("messageList");
let messages = messageList ? messageList.getElementsByClassName("message") : [];

for (var i = 0; i < messages.length; i++) {
  let message = messages[i];
  let messageWrapper = message.querySelector(".messageContent");
  messageWrapper.style.overflow = "visible";

  let messageTextElement = messageWrapper.querySelector(".messageText");

  makeQuoteBlockVisible(messageTextElement);

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

function makeQuoteBlockVisible(element) {
  var quoteBlock = element.querySelector(".bbCodeBlock");
  if (!quoteBlock) return;
  quoteBlock.style.overflow = "visible";
  var allChildren = quoteBlock.querySelectorAll("*");
  allChildren.forEach(el => {
    el.style.overflow = "visible";
  });
}
