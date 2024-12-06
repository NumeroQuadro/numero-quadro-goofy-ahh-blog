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

async function loadCSV() {
  const response = await fetch('assets/dataset.csv');
  if (!response.ok) {
    throw new Error('Failed to fetch the CSV file');
  }
  return await response.text();
}

function parseCSV(csvText) {
  const rows = csvText.split('\n');
  return rows.map(row => row.split(','));
}

function getFeatureByColumnName(array, coordName) {
  return array.map((row) => row[coordName] * 100);
}

document.addEventListener('DOMContentLoaded', () => {
  if (!localStorage.getItem('spotifyTracksPlot')) {
    localStorage.setItem('spotifyTracksPlot', 'hidden');
  }

  checkScatterVisibility();
  loadLastScatter();

  const form = document.querySelector('.spotify_tracks_stat__form');
  form.addEventListener('submit', formSubmitHandler);
});

async function draw3dScatter(xCoordName, yCoordName, zCoordName) {
  try {
    const csvString = await loadCSV();
    const parseConfig = {
      header: true,
    };

    var data = Papa.parse(csvString, parseConfig);
    let numberRows = data.data.length;
    // console.log(numberRows);
    // console.log(data.data);

    const xCoords = getFeatureByColumnName(data.data, xCoordName);
    const yCoords = getFeatureByColumnName(data.data, yCoordName);
    const zCoords = getFeatureByColumnName(data.data, zCoordName);

    const colors = xCoords.map((_, index) => xCoords[index] ** 2 + yCoords[index] ** 2 + zCoords[index] ** 2)

    const config = {
      displayModeBar: false,
    };

    const trace = {
      x: xCoords,
      y: yCoords,
      z: zCoords,
      mode: 'markers',
      marker: {
        size: 5,
        color: colors,
        colorscale: 'Rainbow',
      },
      type: 'scatter3d',
    };

    const layout = {
      title: "Spotify Audio Analysis for 1632 tracks",
      scene: {
        xaxis: { title: xCoordName },
        yaxis: { title: yCoordName },
        zaxis: { title: zCoordName },
      },
    };
    Plotly.newPlot('spotify-tracks-plot', [trace], layout, config);

    const scatterState = {
      xCoordName,
      yCoordName,
      zCoordName,
    };
    localStorage.setItem('lastSpotifyScatter', JSON.stringify(scatterState));
  }
  catch (error) {
    console.error('Error while reading csv file:', error.message);
  }
}

async function loadLastScatter() {
  const lastScatter = JSON.parse(localStorage.getItem('lastSpotifyScatter'));

  if (lastScatter) {
    const { xCoordName, yCoordName, zCoordName } = lastScatter;
    await draw3dScatter(xCoordName, yCoordName, zCoordName);
  }
}


const options = [
  'Explicit_Content',
  'Number_Of_Artists',
  'Acousticness',
  'Danceability',
  'Duration (ms)',
  'Energy',
  'Instrumentalness',
  'Liveness',
  'Loudness',
  'Key',
  'Mode',
  'Speechiness',
  'Tempo',
  'Time Signature'
];

let selectedOptions = [];

const multiSelectInput = document.getElementById('multi-select-input');
const optionsList = document.getElementById('options-list');
const selectedOptionsContainer = document.getElementById('selected-options');
const form = document.querySelector('.spotify_tracks_stat__form');
const spotifyTracksPlot = document.getElementById('spotify-tracks-plot');

function displayOptions(filteredOptions) {
  optionsList.innerHTML = '';
  filteredOptions.forEach(option => {
    const optionDiv = document.createElement('div');
    optionDiv.classList.add('option');
    optionDiv.textContent = option;

    optionDiv.addEventListener('click', () => {
      if (!selectedOptions.includes(option) && selectedOptions.length < 3) {
        selectedOptions.push(option);
        updateSelectedOptions();
      } else if (selectedOptions.length > 3) {
      }
      optionsList.style.display = 'none';
      multiSelectInput.value = '';
    });

    optionsList.appendChild(optionDiv);
  });
}

function updateSelectedOptions() {
  selectedOptionsContainer.querySelectorAll('.tag').forEach(tag => tag.remove());
  selectedOptions.forEach(option => {
    const tagDiv = document.createElement('div');
    tagDiv.classList.add('tag');
    tagDiv.classList.add('tag--correct');
    tagDiv.textContent = option;

    const removeSpan = document.createElement('span');
    removeSpan.classList.add('remove-tag');
    removeSpan.textContent = '×';
    removeSpan.addEventListener('click', () => {
      selectedOptions = selectedOptions.filter(item => item !== option);
      updateSelectedOptions();
    });

    tagDiv.appendChild(removeSpan);
    selectedOptionsContainer.insertBefore(tagDiv, multiSelectInput);
  });
}

multiSelectInput.addEventListener('click', () => {
  const filteredOptions = options.filter(option => !selectedOptions.includes(option));
  displayOptions(filteredOptions);
  optionsList.style.display = 'block';
});

multiSelectInput.addEventListener('input', () => {
  const searchValue = multiSelectInput.value.toLowerCase();
  const filteredOptions = options.filter(option =>
    option.toLowerCase().includes(searchValue) && !selectedOptions.includes(option)
  );
  displayOptions(filteredOptions);
  optionsList.style.display = 'block';
});

document.addEventListener('click', (e) => {
  if (!e.target.closest('.multi-select')) {
    optionsList.style.display = 'none';
  }
});

selectedOptionsContainer.addEventListener('click', () => {
  multiSelectInput.focus();
});


multiSelectInput.addEventListener('keydown', (e) => {
  if (e.key === 'Backspace' && multiSelectInput.value === '' && selectedOptions.length > 0) {
    selectedOptions.pop();
    updateSelectedOptions();
  }
});

updateSelectedOptions();

const resetBtn = document.getElementById('reset-btn');
resetBtn.addEventListener('click', () => {
  selectedOptions = [];
  const form = document.querySelector('.spotify_tracks_stat__form');
  form.reset();
  selectedOptionsContainer.querySelectorAll('.tag').forEach(tag => tag.remove());
})

function checkScatterVisibility() {
  let scatterVisibility = localStorage.getItem(spotifyTracksPlot);
  if (scatterVisibility === "visible") {
    spotifyTracksPlot.classList.remove("hidden");
    spotifyTracksPlot.classList.add("visible");
  } else {
    spotifyTracksPlot.classList.remove("visible");
    spotifyTracksPlot.classList.add("hidden");
  }
}

function formSubmitHandler(event) {
  event.preventDefault();

  if (selectedOptions.length === 0) {
    alert('Please select at least one option!');
    return;
  }

  if (selectedOptions.length !== 3) {
    alert('Please select exactly 3 options!');
    return;
  }

  console.log('Selected options:', selectedOptions);
  xCoordName = selectedOptions[0];
  yCoordName = selectedOptions[1];
  zCoordName = selectedOptions[2];

  const spotifyTracksPlot = document.getElementById('spotify-tracks-plot');
  localStorage.setItem(spotifyTracksPlot, 'visible');
  checkScatterVisibility();

  draw3dScatter(xCoordName, yCoordName, zCoordName);
  saveSelectedOptions(xCoordName, yCoordName, zCoordName);

  alert(`Form submitted with selected options: ${selectedOptions.join(', ')}`);
}

function saveSelectedOptions(xCoordName, yCoordName, zCoordName) {
  const previousOptionsContainer = document.getElementById('previous_results');

  const resultDiv = document.createElement('div');
  const uniqueId = crypto.randomUUID();
  resultDiv.classList.add('spotify_tracks_stat_result', 'spotify_tracks_stat_result__rectangle', 'spotify_tracks_stat_result__rectangle--text-adjusted');
  resultDiv.setAttribute('role', 'button');
  resultDiv.setAttribute('id', uniqueId);
  resultDiv.onclick = function () {
    loadPreviousOptions(uniqueId);
  };

  const coordinates = [xCoordName, yCoordName, zCoordName];

  coordinates.forEach(coord => {
    const span = document.createElement('span');
    span.textContent = `- ${coord}`;
    span.innerHTML += '<br>';
    resultDiv.appendChild(span);
  });

  previousOptionsContainer.appendChild(resultDiv);
}

async function loadPreviousOptions(uniqueId) {
  const trackResultDiv = document.getElementById(uniqueId);
  if (!trackResultDiv) {
    console.error(`No element found with ID: ${uniqueId}`);
    return;
  }

  const spans = trackResultDiv.getElementsByTagName("span");
  const coords = Array.from(spans).map(span => span.textContent.trim().slice(2)); // Remove the '- ' prefix

  if (coords.length >= 3) {
    await draw3dScatter(coords[0], coords[1], coords[2]);
  } else {
    console.error("Not enough coordinates to draw scatter plot.");
  }
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