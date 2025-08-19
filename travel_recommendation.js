const searchInput = document.getElementById('searchInput');
const searchResults = document.getElementById('searchResults');
const btnSearch = document.getElementById('btnSearch');
const btnReset = document.getElementById('btnReset');

const keywordMap = {
    beach: 'beaches', beaches: 'beaches',
    temple: 'temples', temples: 'temples',
    country: 'countries', countries: 'countries', city:'countries', cities:'countries'
};

const countryTimeZones = {
    'Australia':'Australia/Sydney',
    'Japan':'Asia/Tokyo',
    'Brazil':'America/Sao_Paulo'
};

function getCountryTime(countryName){
    const timeZone = countryTimeZones[countryName];
    if(!timeZone) return '';
    const options = { timeZone, hour12:true, hour:'numeric', minute:'numeric', second:'numeric' };
    return new Date().toLocaleTimeString('en-US', options);
}

fetch('travel_recommendation_api.json')
.then(response=>response.json())
.then(data=>{
    console.log('Travel data loaded:', data);

    function displayResults(keyword){
        searchResults.innerHTML='';
        if(!keyword) return;

        const keywordLower = keyword.toLowerCase();
        const results = [];
        const category = keywordMap[keywordLower];

        if(category==='countries'){
            data.countries.forEach(country=>{
                country.cities.forEach(city=>{
                    results.push({...city, countryTime:getCountryTime(country.name)});
                });
            });
        } else if(category==='temples'){
            data.temples.forEach(temple=>results.push(temple));
        } else if(category==='beaches'){
            data.beaches.forEach(beach=>results.push(beach));
        } else {
            // partial matches for any keyword
            data.countries.forEach(country=>{
                country.cities.forEach(city=>{
                    if(city.name.toLowerCase().includes(keywordLower)) results.push({...city, countryTime:getCountryTime(country.name)});
                });
            });
            data.temples.forEach(temple=>{
                if(temple.name.toLowerCase().includes(keywordLower)) results.push(temple);
            });
            data.beaches.forEach(beach=>{
                if(beach.name.toLowerCase().includes(keywordLower)) results.push(beach);
            });
        }

        const limitedResults = results.slice(0,2); // show only 2 results per search
        if(limitedResults.length > 0){
            limitedResults.forEach(item=>{
                const div = document.createElement('div');
                div.className = 'result-item';
                div.innerHTML = `
                    <h3>${item.name}</h3>
                    <img src="${item.imageUrl}" alt="${item.name}">
                    <p>${item.description}</p>
                    ${item.countryTime ? `<p class="time">Current local time: ${item.countryTime}</p>` : ''}
                `;
                searchResults.appendChild(div);
            });
        } else {
            searchResults.innerHTML = `<p>No results found for "${keyword}".</p>`;
        }
    }  

    btnSearch.addEventListener('click', ()=>{ displayResults(searchInput.value.trim()); });
    btnReset.addEventListener('click', ()=>{ searchInput.value=''; searchResults.innerHTML=''; });

})
.catch(err=>console.error('Error loading data:',err));
