const btnSearch = document.getElementById('btnSearch');
const btnClear = document.getElementById('btnClear');

function clearSearch() {
    document.getElementById('btnClear') = "";
}
btnClear.addEventListener("click", clearSearch);

function argMin (arr) {
    let minIndex = 0;
    let minValue = arr[0];
    for (let i = 1; i < arr.length; i++) {
      if (arr[i] < minValue) {
        minValue = arr[i];
        minIndex = i;
      }
    }
    return minIndex;
}

function performSearch() {
    const keyword = document.getElementById('destinationInput').value.toLowerCase();
    if (/countr(?:y|i)/.test(keyword)) {
            keyword = "countries"; 
    } else if (/templ/.test(keyword)) {            
        keyword = "temples"; 
    } else if (/beach/.test(keyword)) {            
        keyword = "beaches"; 
    }
    const resultDiv = document.getElementById('result');
    resultDiv.innerHTML = '';
    let scores = [];
    let infos = [];
    let total = 0; // number of info items available
    let maxInfo = 2; // maximum number of info to display
    let random_score = 0;
    let i = 0;
    let imin = 0;

    function addInfo(key) {
        random_score = Math.round(Math.random() * total); // score between 0 and total inclusive
        if (i < maxInfo) {
            infos.push({city: key.name, image: key.imageUrl, description: key.description})
            scores.push(random_score);
        } else {
            imin = argMin(scores);
            if (random_score > scores[imin]) {
                infos[imin] =  {city: key.name, image: key.imageUrl, description: key.description};
                scores[imin] = random_score;
            }
        }
        i++;
    }
    function addContent () {
        for (const info of infos) {
            resultDiv.innerHTML += `<h2>${info.city}</h2>`;
            resultDiv.innerHTML += `<img src="${info.image}" alt="hjh">`;
            resultDiv.innerHTML += `<p>${info.description}</p>`;
        }
    }

    fetch('travel_recommendation_api.json')
    .then(response => response.json())
    .then(data => {
        const countries = data.countries.find(item => item.name.toLowerCase() === keyword);
        const temples = data.temples.find(item => item.name.toLowerCase() === keyword);
        const beaches = data.beaches.find(item => item.name.toLowerCase() === keyword);

        if (countries) {
            total = 0;
            for (const country in countries) {
                total += country.cities.length;
            }
            for (const country in countries) {
                for (const city in country.cities) {
                    addInfo(city);
                }
            }
            addContent();

        } else if (temples) {
            total = temples.length;
            for (const temple of temples) {
                addInfo(temple);
            }
            addContent();

        } else if (beaches) {
            total = beaches.length;
            for (const beach of beaches) {
                addInfo(beach);
            }
            addContent();

        } else {
            resultDiv.innerHTML = `Condition ${keyword} not found! Acceptable keywords: beach, temple, country`;
        }
        })
    .catch(error => {
        console.error('Error:', error);
        resultDiv.innerHTML = 'An error occurred while fetching data.';
    });
}
btnSearch.addEventListener('click', performSearch);