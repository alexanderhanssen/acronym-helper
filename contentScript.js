import acronyms from "./acronyms.json";

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
  let currentMessage = messages[i];
  let messageContent = currentMessage.getElementsByClassName("messageText");
  let innerHTML = messageContent[0].innerHTML;
  currentMessage.getElementsByClassName("messageContent")[0].style.overflow =
    "visible";
  let scanned = scanAndReplace(innerHTML);
  messageContent[0].innerHTML = scanned;
}

function scanAndReplace(innerHtml) {
  innerHtml = innerHtml.replace(replaceRegex, function(match) {
    let foundAcronym =
      acronyms[match] || acronyms["\\" + match] || acronyms[match + "+"]; //Special characters...
    let newWord =
      '<span class="acronym-tooltip tooltip-bottom-right" data-tooltip="' +
      foundAcronym +
      '">' +
      match +
      "</span>";
    console.log("Replacing " + match + " with " + newWord);
    return newWord;
  });
  return innerHtml;
}
