const btnExplore = document.getElementById('btnExplore');
const destinationList = document.getElementById('destinationList');
const exploreContainer = document.querySelector('.explore-container');
const filterCheckboxes = document.querySelectorAll('.filter');

let allDestinations = [];

// Fetch JSON data
async function fetchDestinations() {
    try {
        const response = await fetch('travel_recommendation_api.json');
        const data = await response.json();
        processDestinations(data);
    } catch (err) {
        console.error('Error loading destinations:', err);
    }
}

// Flatten JSON data into allDestinations array
function processDestinations(data) {
    allDestinations = [];

    // Countries/Cities
    data.countries.forEach(country => {
        country.cities.forEach(city => {
            allDestinations.push({
                name: city.name,
                imageUrl: city.imageUrl,
                description: city.description,
                tags: city.tags || ['city']
            });
        });
    });

    // Temples
    data.temples.forEach(t => {
        allDestinations.push({
            name: t.name,
            imageUrl: t.imageUrl,
            description: t.description,
            tags: t.tags || ['historic']
        });
    });

    // Beaches
    data.beaches.forEach(b => {
        allDestinations.push({
            name: b.name,
            imageUrl: b.imageUrl,
            description: b.description,
            tags: b.tags || ['beach']
        });
    });

    // Sort alphabetically by name
    allDestinations.sort((a, b) => a.name.localeCompare(b.name));
}

// Render tiles with optional filters
function renderDestinations() {
    const activeFilters = Array.from(filterCheckboxes)
        .filter(cb => cb.checked)
        .map(cb => cb.value);

    destinationList.innerHTML = '';

    let filtered = allDestinations;
    if (activeFilters.length > 0) {
        filtered = allDestinations.filter(dest =>
            dest.tags.some(tag => activeFilters.includes(tag))
        );
    }

    // Ensure exactly 12 tiles (4x3) by slicing or filling with empty placeholders
    const tilesToShow = filtered.slice(0, 12);

    tilesToShow.forEach(dest => {
        const tile = document.createElement('div');
        tile.classList.add('destination-tile');
        tile.innerHTML = `
            <img src="${dest.imageUrl}" alt="${dest.name}">
            <h4>${dest.name}</h4>
            <p>${dest.description}</p>
        `;
        destinationList.appendChild(tile);
    });

    // Fill remaining tiles with invisible placeholders if fewer than 12
    const remaining = 12 - tilesToShow.length;
    for (let i = 0; i < remaining; i++) {
        const placeholder = document.createElement('div');
        placeholder.classList.add('destination-tile');
        placeholder.style.visibility = 'hidden';
        destinationList.appendChild(placeholder);
    }
}

// Show explore container, render destinations, and scroll into view
btnExplore.addEventListener('click', () => {
    exploreContainer.style.display = 'flex'; // show container
    renderDestinations(); // render all destinations immediately
    
    // Scroll smoothly to the explore section
    exploreContainer.scrollIntoView({ behavior: 'smooth' });
});


// Add event listeners to checkboxes for real-time filtering
filterCheckboxes.forEach(cb => {
    cb.addEventListener('change', renderDestinations);
});

// Initialize
fetchDestinations();
