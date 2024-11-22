var track_1 = document.getElementById("track_1");
var track_2 = document.getElementById("track_2");
var track_3 = document.getElementById("track_3");
var track_4 = document.getElementById("track_4");
var track_5 = document.getElementById("track_5");
let tracks = [track_1, track_2, track_3, track_4, track_5]

var description_1 = document.getElementById("description_1");
var description_2 = document.getElementById("description_2");
var description_3 = document.getElementById("description_3");
var description_4 = document.getElementById("description_4");
var description_5 = document.getElementById("description_5");
let descriptions = [description_1, description_2, description_3, description_4, description_5]

function revealDescription(descriptionId) {
  console.log('revealing', descriptionId);
  let description = document.getElementById(descriptionId);
  description.classList.add("visible");
}

function hideDescription(descriptionId) {
  console.log('hiding', descriptionId);
  let description = document.getElementById(descriptionId);
  description.classList.remove("visible");
}

function revealAuthor(quoteId) {
  console.log('revealing quote author');
  let quote = document.getElementById(quoteId);
  quote.classList.add("visible");
}

function hideAuthor(quoteId) {
  console.log('revealing quote author');
  let quote = document.getElementById(quoteId);
  quote.classList.remove("visible");
}

(function () {
  window.addEventListener('load', function () {
      const loadTime = (performance.now() / 1000).toFixed(3);

      const loadTimeText = document.getElementById('load-time-text');
      if (loadTimeText) {
          loadTimeText.textContent = `Page load time is ${loadTime} Seconds`;
      }
  });
})();