
const countryInput = document.getElementById('country-input');
const searchBtn = document.getElementById('search-btn');
const countryInfo = document.getElementById('country-info');
const borderingCountries = document.getElementById('bordering-countries');
const errorMessage = document.getElementById('error-message');
const loader = document.getElementById('loading-spinner');

loader.classList.add('hidden');

async function searchCountry(countryName) {
    if (!countryName) return;


    errorMessage.textContent = '';
    countryInfo.innerHTML = '';
    borderingCountries.innerHTML = '';
    loader.classList.remove('hidden');

    try {
    const response = await fetch(`https://restcountries.com/v3.1/name/${countryName}?fullText=true`);
        
    if (!response.ok) {
            throw new Error('Country not found. Try another name!');
    }

    const data = await response.json();
    const country = data[0];

      
    countryInfo.innerHTML = `
        <h2>${country.name.common}</h2>
        <p><strong>Capital:</strong> ${country.capital ? country.capital[0] : 'N/A'}</p>
        <p><strong>Population:</strong> ${country.population.toLocaleString()}</p>
        <p><strong>Region:</strong> ${country.region}</p>
        <img src="${country.flags.svg}" alt="${country.name.common} flag" width="250">
        `;
        if (country.borders && country.borders.length > 0) {
            fetchBorderingCountries(country.borders);
        } else {
            borderingCountries.innerHTML = '<p>No bordering countries.</p>';
        }

    } catch (error) {
        errorMessage.textContent = error.message;
    } finally {
        loader.classList.add('hidden');
    }
}

async function fetchBorderingCountries(borderCodes) {
    borderingCountries.innerHTML = '<h3>Bordering Countries:</h3>';
    try {
        const promises = borderCodes.map(code => 
            fetch(`https://restcountries.com/v3.1/alpha/${code}`).then(res => res.json())
        );

        const results = await Promise.all(promises);

        results.forEach(result => {
            const neighbor = result[0];
            const neighborDiv = document.createElement('div');
            neighborDiv.className = 'neighbor-item';
            neighborDiv.innerHTML = `
                <p>${neighbor.name.common}</p>
                <img src="${neighbor.flags.svg}" alt="${neighbor.name.common}" width="80">
            `;
            borderingCountries.appendChild(neighborDiv);
        });
    } catch (err) {
        borderingCountries.innerHTML += '<p>Error loading neighbors.</p>';
    }
}
searchBtn.addEventListener('click', () => {
    searchCountry(countryInput.value.trim());
});
countryInput.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        searchCountry(countryInput.value.trim());
    }
});