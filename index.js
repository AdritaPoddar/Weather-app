const userTab=document.querySelector("[data-userWeather]");
const searchTab=document.querySelector("[data-searchWeather]");
const userContainer=document.querySelector(".weather-container");

const grantAccessContainer=document.querySelector(".grant-location-container");
const searchForm=document.querySelector(".form-container");
const loadingScreen=document.querySelector(".loading-container");
const userInfoContainer=document.querySelector(".user-info-container");
const themeToggle = document.getElementById("themeToggle");

// intially varaibles needed
let oldTab=userTab;
const API_KEY="d1845658f92b31c64bd94f06f7188c9c";
oldTab.classList.add("current-tab");
getfromSessionStorage();

function switchTab(newTab){
    if(newTab!=oldTab){
        oldTab.classList.remove("current-tab");
        oldTab= newTab;
        oldTab.classList.add("current-tab");

        if(!searchForm.classList.contains("active")){
            userInfoContainer.classList.remove("active");
            grantAccessContainer.classList.remove("active");
            searchForm.classList.add("active");
        }
        else{
            // at searchwale tab so now the your weather wale tab ko visible karna hai 
            searchForm.classList.remove("active");
            userInfoContainer.classList.remove("active");
            // now weather tab main agaya hu ab weather bhi display karna padega, so lets check local storage first 
            // for coordinated if we have saved them Here 
            getfromSessionStorage();
        }

    }
}
themeToggle.addEventListener("change", () => {
    document.body.classList.toggle("dark", themeToggle.checked);
});
userTab.addEventListener('click', () => {
    // pass clicked tab as input parameter
    switchTab(userTab);
})
searchTab.addEventListener('click', () => {
    // pass clicked tab as input parameter
    switchTab(searchTab);
})

function getfromSessionStorage(){
    const localcordinates=sessionStorage.getItem("user-coordinates");
    if(!localcordinates){
        // agar local coordinates nahi mile 
        grantAccessContainer.classList.add("active");
    }
    else{
        const coordinates = JSON.parse(localcordinates);
        fetchUserWeatherInfo(coordinates);
    }
}

async function fetchUserWeatherInfo(coordinates) {
     const {lat, lon}= coordinates;
    grantAccessContainer.classList.remove("active");
    loadingScreen.classList.add("active");

    // API_CALL 
    try{
    const response= await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`);
    const data=await response.json();
    loadingScreen.classList.remove("active");
    userInfoContainer.classList.add("active");
    // to show the data to ui
    renderWeatherInfo(data);
    }
    catch(err){
       loadingScreen.classList.remove("active");
      
    }
}

function renderWeatherInfo(weatherInfo){
//   firstly we have to fetch the items 
  const cityName=document.querySelector("[data-cityName]");
  const countryIcon=document.querySelector("[data-countryIcon]");
  const desc=document.querySelector("[data-weatherDesc]");
  const weatherIcon=document.querySelector("[data-weatherIcon]");
  const temp=document.querySelector("[data-weatherTemp]");
  const windspeed=document.querySelector("[data-windspeed]");
  const humidity=document.querySelector("[data-humidity]");
  const cloudiness=document.querySelector("[data-cloudiness]");


//   fetch values from weatherInfo objects and put it into Ui 
   cityName.innerText=weatherInfo?.name;
   countryIcon.src= `https://flagcdn.com/w320/${weatherInfo?.sys?.country.toLowerCase()}.png`;
   desc.innerText=weatherInfo?.weather?.[0]?.description;
   weatherIcon.src=`https://openweathermap.org/img/wn/${weatherInfo?.weather?.[0]?.icon}@2x.png`;
   temp.innerText=weatherInfo?.main?.temp;
   windspeed.innerText=weatherInfo?.wind?.speed;
   humidity.innerText=weatherInfo?.main?.humidity;
   cloudiness.innerText=weatherInfo?.clouds?.all;
}

function getLocation(){
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(showPosition);
    }
    else{
       //hw 
    }
}
function showPosition(position){
    const userCoordinates={
        lat: position.coords.latitude,
        lon: position.coords.longitude,
    }
    sessionStorage.setItem("user-coordinates" , JSON.stringify(userCoordinates));
    fetchUserWeatherInfo(userCoordinates);
}
const grantAccessButton=document.querySelector("[data-grantAccess]");
grantAccessButton.addEventListener('click', getLocation);

const searchInput=document.querySelector("[data-searchInput]");
searchForm.addEventListener('submit', (e) =>{
    e.preventDefault();
    let cityName=searchInput.value;
    if(cityName === "")
        return;
    else{
        fetchSearchWeatherInfo(cityName);
    }
});

async function fetchSearchWeatherInfo(city) {
    loadingScreen.classList.add("active");
    userInfoContainer.classList.remove("active");
    grantAccessContainer.classList.remove("active");

    try{
        const response= await fetch(`
            https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`);
        const data=await response.json();
        loadingScreen.classList.remove("active");
    userInfoContainer.classList.add("active");
    renderWeatherInfo(data);
    }
    catch(err){
    //hw
    }
    
}