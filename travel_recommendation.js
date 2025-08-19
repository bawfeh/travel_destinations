const btnSearch = document.getElementById('btnSearch');
const btnClear = document.getElementById('btnClear');
const resultDiv = document.getElementById('result');

function clearContent() {
    document.getElementById('destinationInput').value = "";
    document.getElementById('result').innerHTML = "";
}

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
    var keyword = document.getElementById('destinationInput').value.toLowerCase();
    if (/countr(?:y|i)/.test(keyword)) {
            keyword = "countries"; 
    } else if (/templ/.test(keyword)) {            
        keyword = "temples"; 
    } else if (/beach/.test(keyword)) {            
        keyword = "beaches"; 
    }
    const keywordFound = ["countries", "temples", "beaches"].find(item => item === keyword);
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
            infos.push({name: key.name, image: key.imageUrl, description: key.description})
            scores.push(random_score);
        } else {
            imin = argMin(scores);
            if (random_score > scores[imin]) {
                infos[imin] =  {name: key.name, image: key.imageUrl, description: key.description};
                scores[imin] = random_score;
            }
        }
        i++;
    }
    function addContent () {
        for (const info of infos) {
            resultDiv.innerHTML += `<img src="${info.image}" alt="hjh">`;
            resultDiv.innerHTML += `<h3>${info.name}</h3>`;
            resultDiv.innerHTML += `<p>${info.description}</p>`;
        }
    }

    fetch('travel_recommendation_api.json')
    .then(response => response.json())
    .then(data => {
        if (keywordFound) {
            const dataObject = data[keyword];
            console.log(dataObject.cities)
            if (keyword === "countries") {
                total = 0;
                for (const country of dataObject) {
                    total += country.cities.length;
                }
                for (const country of dataObject) {
                    for (const city of country.cities) {
                        addInfo(city);
                    }
                }
            } else {
                total = dataObject.length;
                for (const obj of dataObject) {
                    addInfo(obj);
                }
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
btnClear.addEventListener('click', clearContent);
btnSearch.addEventListener('click', performSearch);