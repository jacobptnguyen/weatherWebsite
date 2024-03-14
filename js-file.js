// Made by: Jacob Nguyen
// Email: jacobptnguyen@gmail.com
// api used: https://www.weather.gov/documentation/services-web-api

function main(){

    inputBox = document.querySelector("#inputBox");
    submit = document.querySelector("#submit")
    currentCoords = "";
    currentIndex = 0;

    submit.addEventListener('click', function submitFunc(e){
        data = inputBox.value;
        currentCoords = fixInput(data); // store for later
        inputBox.value = "";
        currentIndex = 0;
        console.log(currentCoords);
        getData(currentCoords, currentIndex);
    }); 
}

// currentCoords.replaceAll(" ", "").replaceAll("(", "").replaceAll(")", "").replaceAll("°","").replaceAll("N","").replaceAll("W","")
function fixInput(data){
    // 36.60869° N, 121.85634° W
    coords = data.split(",");
    if(coords[0][coords.len-1] == "S"){
        
    }
    return data.replaceAll(" ", "").replaceAll("(", "").replaceAll(")", "").replaceAll("°","");
}

function clear(){
    mainBody = document.querySelector(".mainBody");
    mainBody.innerHTML = "";
    mainBody.style.backgroundColor = "transparent";
    buttons = document.querySelector(".buttons");
    buttons.innerHTML = "";
}

function addLoadingScreen(){
    mainBody = document.querySelector('.mainBody');
    mainBody.style.backgroundColor = "white";
    mainBody.textContent = "Loading...";
}

function clearLoadingScreen(){
    mainBody = document.querySelector(".mainBody");
    mainBody.innerHTML = "";
    mainBody.style.backgroundColor = "transparent";
}

function addErrorMessage(){
    mainBody = document.querySelector('.mainBody');
    mainBody.style.backgroundColor = "white";
    mainBody.textContent = "Something Went Wrong! Please Try Again!";
}

function getData(coordinates, index){
    clear();
    addLoadingScreen();
    fetch('https://api.weather.gov/points/'+coordinates, {mode: 'cors'})
        .then(function(response){
            return response.json();
        })
        .then(function(data){
            fetch(data.properties.forecast) // forecast is another link
                .then(function(response){
                    return response.json();
                })
                .then(function(data){ // data.properties.periods has all weather for next week, day and night so size = 14
                    clearLoadingScreen(); // at this point I got the data
                    displayData(data.properties.periods[index], index)
                });
        })
        .catch(function(error){
            clearLoadingScreen();
            addErrorMessage();
            console.log("invalid coordinates"); // make sure user sees error and tell them format
        });
}

function displayData(currentPeriod, index){

    mainBody = document.querySelector('.mainBody');
    mainBody.style.backgroundColor = "white";

    title = document.createElement('div');
    title.className = 'title';
    if(index + 1> 13){
        title.textContent = "Next" + currentPeriod.name;
    }else{
        title.textContent = currentPeriod.name;
    }
    mainBody.append(title);

    temp = document.createElement('div');
    temp.className = 'temp';
    temp.textContent = "\u{1F321}" + " " + currentPeriod.temperature + " " + currentPeriod.temperatureUnit + "°";
    mainBody.append(temp);

    rain = document.createElement('div');
    rain.className = 'rain';
    if(currentPeriod.probabilityOfPrecipitation.value == null){
        rain.textContent = "\u{1F327}" + " Chance of Rain: insufficient data";
    }else{
        rain.textContent = "\u{1F327}" + " Chance of Rain: "+ currentPeriod.probabilityOfPrecipitation.value + "%";
    }
    mainBody.append(rain);

    wind = document.createElement('div');
    wind.className = 'wind';
    wind.textContent = "\u{1F4A8}" + " " + currentPeriod.windSpeed + " " + currentPeriod.windDirection;
    mainBody.append(wind);

    forecast = document.createElement('div');
    forecast.className = 'forecast';
    forecast.textContent = currentPeriod.shortForecast;
    mainBody.append(forecast);

    buttons = document.querySelector(".buttons");
    makeArrowButtons(index, buttons);
}

function makeArrowButtons(index, buttons){
    leftOfCurIndex = index - 1;
    rightOfCurIndex = index + 1;
    if(leftOfCurIndex < 0){
        makeDummyButton("left", buttons);
    }else{
        makeButton("left", buttons);
    }
    if(rightOfCurIndex > 13){
        makeDummyButton("right", buttons);
    }else{
        makeButton("right", buttons);
    }
}

function makeDummyButton(direction, buttons){
    if(direction == "left"){
        leftDummyButton = document.createElement('button');
        leftDummyButton.className = "leftDummyButton";
        leftDummyButton.textContent = "<";
        leftDummyButton.style.backgroundColor = "transparent";
        buttons.append(leftDummyButton);
    }else if(direction == "right"){
        rightDummyButton = document.createElement('button');
        rightDummyButton.className = "rightDummyButton";
        rightDummyButton.textContent = ">";
        rightDummyButton.style.backgroundColor = "transparent";
        buttons.append(rightDummyButton);
    }
}

function makeButton(direction, buttons){
    if(direction == "left"){
        leftButton = document.createElement('button');
        leftButton.className = "leftButton";
        leftButton.addEventListener('click', function leftButtonFunc(e){
            currentIndex -= 1;
            getData(currentCoords.replaceAll(" ", "").replaceAll("(", "").replaceAll(")", "").replaceAll("°","").replaceAll("N","").replaceAll("W",""), currentIndex);
        });
        leftButton.textContent = "<";
        buttons.append(leftButton);   
    }else if(direction == "right"){
        rightButton = document.createElement('button');
        rightButton.className = "rightButton";
        rightButton.addEventListener('click', function rightButtonFunc(e){
            currentIndex += 1;
            getData(currentCoords.replaceAll(" ", "").replaceAll("(", "").replaceAll(")", "").replaceAll("°","").replaceAll("N","").replaceAll("W",""), currentIndex);
        }); 
        rightButton.textContent = ">";
        buttons.append(rightButton);
    }
}

main();
