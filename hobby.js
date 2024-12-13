function sendNotification(text, duration_ms) {
    Toastify({
        text: text,
        duration: duration_ms,
        close: true,
        gravity: "top", // `top` or `bottom`
        position: "right", // `left`, `center` or `right`
        stopOnFocus: true, // Prevents dismissing of toast on hover
        style: {
            background: "#01823E",
        },
        onClick: function () { } // Callback after click
    }).showToast();
}

function copyTextToClipboard(text) {
    try {
        navigator.clipboard.writeText(text);
    }
    catch {
        console.error('Could not copy text: ', err);
    }
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

document.formSubmitHandler = function (event) {
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

    const xCoordName = selectedOptions[0];
    const yCoordName = selectedOptions[1];
    const zCoordName = selectedOptions[2];

    localStorage.setItem(spotifyTracksPlot, 'visible');
    checkScatterVisibility();

    draw3dScatter(xCoordName, yCoordName, zCoordName);
    saveSelectedOptions(xCoordName, yCoordName, zCoordName);

    sendNotification(`Form submitted with selected options: ${selectedOptions.join(', ')}`, 2000);
};

document.checkScatterVisibility = checkScatterVisibility;
document.saveSelectedOptions = saveSelectedOptions;

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
        span.style.whiteSpace = "nowrap";
        // span.innerHTML += '<br>';
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
    const coords = Array.from(spans).map(span => span.textContent.trim().slice(2));

    if (coords.length >= 3) {
        await draw3dScatter(coords[0], coords[1], coords[2]);
    } else {
        console.error("Not enough coordinates to draw scatter plot.");
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const commentButton = document.querySelector('.comment__button');
    if (commentButton) {
        commentButton.addEventListener('click', () => {
            const commentTextElement = document.getElementById("comment-text");
            if (!commentTextElement) {
                console.error("Comment text input not found");
                return;
            }

            const commentText = commentTextElement.value;

            if (commentText.trim() === "") {
                alert("Please write a comment before submitting.");
                commentTextElement.focus();
                return;
            }

            const commentSection = document.getElementById("comments-section");
            if (!commentSection) {
                console.error("Comments section not found");
                return;
            }

            const commentDiv = document.createElement("div");
            commentDiv.className = "comments__item";
            commentDiv.textContent = `${currentVisitor}: ${commentText}`;

            commentSection.appendChild(commentDiv);

            commentTextElement.value = "";
            commentTextElement.focus();

            visitors.push(currentVisitor);
            currentVisitor = `Numero ${toSpanishOrdinal(visitors.length + 1)}`;
            const welcomeMessage = document.getElementById("welcome-message");
            if (welcomeMessage) {
                welcomeMessage.textContent = `Welcome, ${currentVisitor}!`;
            }
        });
    }
});

const visitors = [];
let currentVisitor = `Numero ${toSpanishOrdinal(visitors.length + 1)}`;

function toSpanishOrdinal(number) {
    const ordinals = ["Uno", "Dos", "Tres", "Cuatro", "Cinco", "Seis", "Siete", "Ocho", "Nueve", "Diez"];
    return ordinals[number - 1] || number;
}

document.addEventListener("DOMContentLoaded", () => {
    const navLinks = document.querySelectorAll('.header__navigation_item');
    console.log('Navigation links found:', navLinks);

    const currentPath = document.location.pathname;
    console.log('Current Path:', currentPath);

    navLinks.forEach((link, index) => {
        const linkPath = link.getAttribute('href');

        if (!linkPath) {
            console.warn(`Link ${index + 1} does not have an href attribute. Skipping.`);
            return;
        }

        const normalizedLinkPath = new URL(linkPath, document.location.origin).pathname;
        console.log(`Link ${index + 1}: href = ${linkPath}, normalized path = ${normalizedLinkPath}`);

        if (currentPath === normalizedLinkPath) {
            console.log(`Match found! Adding 'active' class to link ${index + 1}`);
            link.classList.add('active');
        } else {
            console.log(`No match for link ${index + 1}. Removing 'active' class.`);
            link.classList.remove('active');
        }
    });

    console.log('Navigation highlighting complete.');
});

document.addEventListener("DOMContentLoaded", () => {
    const welcomeMessage = document.getElementById("welcome-message");
    if (welcomeMessage) {
        welcomeMessage.textContent = `Welcome, ${currentVisitor}!`;
    }
});