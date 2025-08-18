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
    const resultDiv = document.getElementById('result');
    resultDiv.innerHTML = '';
    let probs = [];
    let infos = [];
    let total = 0; // number of info items available
    let maxInfo = 2; // maximum number of info to display
    let rand_prob = 0;
    let i = 0;
    let imin = 0;

    function addInfo(key) {
        if (i < maxInfo) {
            infos.push({city: key.name, image: key.imageUrl, description: key.description})
            probs.push(rand_prob);
        } else {
            imin = argMin(probs);
            if (rand_prob > probs[imin]) {
                infos[imin] =  {city: key.name, image: key.imageUrl, description: key.description};
                probs[imin] = rand_prob;
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
                    rand_prob = Math.random() / total;
                    addInfo(city);
                }
            }
            addContent();
        } else if (temples) {
            total = temples.length;
            for (const temple of temples) {
                    rand_prob = Math.random() / total;
                    addInfo(temple);
                }
            addContent();
        } else if (beaches) {
            total = beaches.length;
            for (const beach of beaches) {
                    rand_prob = Math.random() / total;
                    addInfo(beach);
                }
            addContent();
        } else {
            resultDiv.innerHTML = `Condition ${keyword} not found! Acceptable keywords: countries, temples, beaches`;
        }
        })
    .catch(error => {
        console.error('Error:', error);
        resultDiv.innerHTML = 'An error occurred while fetching data.';
    });
}
btnSearch.addEventListener('click', performSearch);