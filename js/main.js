// console.log("connected");

// *****************************************************************************
//  Movie Data from The Movie Database API
// *****************************************************************************
let movieData = [];
let TVData = [];
let nameData = [];

// *****************************************************************************
//  API Key
// *****************************************************************************
const apiKey = IMDB_KEY; 

// *****************************************************************************
//  API Path Snippets (URLs)
// *****************************************************************************
// with "/3/discover/movie" End-Point (current movies in the theatres pull)
const nowMovieURL = `https://api.themoviedb.org/3/discover/movie?primary_release_date.gte=2021-03-01&primary_release_date.lte=2021-04-30&api_key=${apiKey}&page=1`;

// with "/3/tv/popular" End-Point (popular TV pull)
const popularTVURL = `https://api.themoviedb.org/3/tv/popular?api_key=${apiKey}&language=en-US&page=1`;

// search End-Points
const searchMovie = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=`;
const searchTVShow = `https://api.themoviedb.org/3/search/tv?api_key=${apiKey}&query=`;
const searchPerson = `https://api.themoviedb.org/3/search/person?api_key=${apiKey}&query=`;

// Get Movie Image
const imgURL = "https://image.tmdb.org/t/p/w200";
    // typical build: imgURL + obj.poster_path; (obj.poster_path comes from the object, so you need to referrence it)

// *****************************************************************************

// Populate the Movie Table
getMovies(nowMovieURL);

async function getMovies(url) {
    const res = await fetch(url);
    const data = await res.json();

    // console.log(data.results);

    movieData = data.results;

    for (let i=0; i < movieData.length; i++) {
        const movieID = movieData[i].id;
        // Setup the Table Row
        const movieRow = movieTable.insertRow(-1); 

        // New Cells
        const cell1 = movieRow.insertCell(0);
        const cell2 = movieRow.insertCell(1);
        const cell3 = movieRow.insertCell(2);
        const cell4 = movieRow.insertCell(3);

        // Populate the Cells
        cell1.innerHTML = movieData[i].title;
        cell2.innerHTML = movieData[i].release_date;
        cell3.innerHTML = movieData[i].vote_average;
        cell4.innerHTML = `<input type="checkbox" onclick="updateMovieList()" class="movieItems" id="${movieID}" value="${movieID}">`;
    }
};

async function getGenre(url) {
    const res = await fetch(url);
    const data = await res.json();

    // console.log(data.results);

    movieData = data.results;

    for (let i=0; i < movieData.length; i++) {
        // Setup the Table Row

        for (let j=0; j < movieData[i].genre_ids.length; j++) {

            const movieID = movieData[i].genre_ids[j]; 

            if (movieID == genreMovies.value) {

            const movieRow = movieTable.insertRow(-1);

            // New Cells
            const cell1 = movieRow.insertCell(0);
            const cell2 = movieRow.insertCell(1);
            const cell3 = movieRow.insertCell(2);
            const cell4 = movieRow.insertCell(3);

            // Populate the Cells
            cell1.innerHTML = movieData[i].title;
            cell2.innerHTML = movieData[i].release_date;
            cell3.innerHTML = movieData[i].vote_average;
            cell4.innerHTML = `<input type="checkbox" class="movieItems" id="${movieID}" value="${movieID}">`;
            }        
        }
    };
};

async function getTVShows(url) {
    const res = await fetch(url);
    const data = await res.json();

    // console.log(data.results);

    TVData = data.results;

    for (let i=0; i < TVData.length; i++) {
        const TVID = TVData[i].id;
        // Setup the Table Row
        const TVRow = movieTable.insertRow(-1); 

        // New Cells
        const cell1 = TVRow.insertCell(0);
        const cell2 = TVRow.insertCell(1);
        const cell3 = TVRow.insertCell(2);
        const cell4 = TVRow.insertCell(3);

        // Populate the Cells
        cell1.innerHTML = TVData[i].name;
        cell2.innerHTML = TVData[i].first_air_date;
        cell3.innerHTML = TVData[i].vote_average;
        cell4.innerHTML = `<input type="checkbox" onclick="updateTVList()" class="TVItems" id="${TVID}" value="${TVID}">`;
    }
};

async function getPeople(url) {
    const res = await fetch(url);
    const data = await res.json();

    // console.log(data.results);

    movieData = data.results;

    for (let i=0; i < movieData.length; i++) {
        // Setup the Table Row

        for (let j=0; j < movieData[i].known_for.length; j++) {

            const movieID = movieData[i].known_for[j].id;

            const movieRow = movieTable.insertRow(-1);

            // New Cells
            const cell1 = movieRow.insertCell(0);
            const cell2 = movieRow.insertCell(1);
            const cell3 = movieRow.insertCell(2);
            const cell4 = movieRow.insertCell(3);
            const cell5 = movieRow.insertCell(4);

            // Populate the Cells
            cell1.innerHTML = movieData[i].name;
            cell2.innerHTML = movieData[i].known_for[j].title;
            cell3.innerHTML = movieData[i].known_for[j].release_date;
            cell4.innerHTML = movieData[i].known_for[j].vote_average;
            cell5.innerHTML = `<input type="checkbox" onclick="updateMovieList()" class="nameItems" id="name${movieID}" value="${movieID}">`;

            const nameItem = {
                name : movieData[i].name,
                id : movieID,
                title : movieData[i].known_for[j].title,
                poster_path : movieData[i].known_for[j].poster_path,
                vote_average : movieData[i].known_for[j].vote_average,
                vote_count : movieData[i].known_for[j].vote_count,
                overview : movieData[i].known_for[j].overview
            }
            nameData.push(nameItem);
        }
    }
};

// Processing the checked boxes to display the movie cards

const updateMovieList = () => {
    movieDetails.innerHTML = "";
    let allMovies = document.querySelectorAll('.movieItems');
    let movieIndex = 0;
    let isName = false;

    if(allMovies.length === 0) {
       allMovies = document.querySelectorAll('.nameItems');
       movieData = nameData; 
       isName = true;
    }

    for (let i=0; i < allMovies.length; i++) {
        if (allMovies[i].checked) {

            for (let j=0; j < movieData.length; j++) {
                if (movieData[j].id == allMovies[i].value) {
                    movieIndex = j;
                }
            }

            // Setup the Information Section
            const newDiv = document.createElement('div');
            newDiv.className = "movieBlock";

            // Add the Heading
            const divHeader = document.createElement('h3');
            const divHeaderText = document.createTextNode(`${ isName ? movieData[movieIndex].name + " - Known for: " + movieData[movieIndex].title : movieData[movieIndex].title }`);
            divHeader.appendChild(divHeaderText);
            newDiv.appendChild(divHeader);

            // Add Description Container
            const descriptionContainer = document.createElement('div');
            descriptionContainer.className = "descriptionContainer";

            // Add the Image to the Description Container
            const movieImage = document.createElement('img');
            const imagePath = `${imgURL + movieData[movieIndex].poster_path}`;
            const imageAlt = `${movieData[movieIndex].title}`;
            movieImage.setAttribute('src', imagePath);
            movieImage.setAttribute('alt', imageAlt);

            // Create a Text Container to add to the Description Container
            const movieText = document.createElement('div');
            movieText.className = "textDescription";

            // Add the Movie Description to the Text Container
            const movieDescription = document.createElement('div');
            const description = document.createTextNode(`${movieData[movieIndex].overview}`)
            movieDescription.appendChild(description);
            movieText.appendChild(movieDescription);

            // Add the Rating to the Text Container
            const movieRating = document.createElement('div');
            const rating = document.createTextNode(`Rated ${movieData[movieIndex].vote_average} averaged over ${movieData[movieIndex].vote_count} voters`);
            movieRating.appendChild(rating);
            movieText.appendChild(movieRating);

            // Put it all together
            descriptionContainer.appendChild(movieImage);
            descriptionContainer.appendChild(movieText);
            newDiv.appendChild(descriptionContainer);
            movieDetails.appendChild(newDiv);
        }
    }
}

// Processing the checked boxes to display the TV Show cards

const updateTVList = () => {
    movieDetails.innerHTML = "";
    let allTVShows = document.querySelectorAll('.TVItems');
    let tvIndex = 0;
    let isName = false;

    if(allTVShows.length === 0) {
       allTVShows = document.querySelectorAll('.nameItems');
       movieData = nameData; 
       isName = true;
    }

    for (let i=0; i < allTVShows.length; i++) {
        if (allTVShows[i].checked) {

            for (let j=0; j < TVData.length; j++) {
                if (TVData[j].id == allTVShows[i].value) {
                    tvIndex = j;
                }
            }

            // Setup the Information Section
            const newDiv = document.createElement('div');
            newDiv.className = "tvBlock";

            // Add the Heading
            const divHeader = document.createElement('h3');
            const divHeaderText = document.createTextNode(`${ isName ? TVData[tvIndex].name + " - Known for: " + TVData[tvIndex].name : TVData[tvIndex].name }`);
            divHeader.appendChild(divHeaderText);
            newDiv.appendChild(divHeader);

            // Add Description Container
            const descriptionContainer = document.createElement('div');
            descriptionContainer.className = "descriptionContainer";

            // Add the Image to the Description Container
            const tvImage = document.createElement('img');
            const imagePath = `${imgURL + TVData[tvIndex].poster_path}`;
            const imageAlt = `${TVData[tvIndex].title}`;
            tvImage.setAttribute('src', imagePath);
            tvImage.setAttribute('alt', imageAlt);

            // Create a Text Container to add to the Description Container
            const tvText = document.createElement('div');
            tvText.className = "textDescription";

            // Add the TV Description to the Text Container
            const tvDescription = document.createElement('div');
            const description = document.createTextNode(`${TVData[tvIndex].overview}`)
            tvDescription.appendChild(description);
            tvText.appendChild(tvDescription);

            // Add the Rating to the Text Container
            const tvRating = document.createElement('div');
            const rating = document.createTextNode(`Rated ${TVData[tvIndex].vote_average} averaged over ${TVData[tvIndex].vote_count} voters`);
            tvRating.appendChild(rating);
            tvText.appendChild(tvRating);

            // Put it all together
            descriptionContainer.appendChild(tvImage);
            descriptionContainer.appendChild(tvText);
            newDiv.appendChild(descriptionContainer);
            movieDetails.appendChild(newDiv);
        }
    }
}

// Reset table for movies, TV shows and name

const resetForMovie = () => {
    movieTable.innerHTML = "";

    // Setup the Table Row
    const movieRow = movieTable.insertRow(0);

    // Add New Cells
    const cell1 = document.createElement('th');
    cell1.appendChild(document.createTextNode("Current and Upcoming Movies"));
    const cell2 = document.createElement('th');
    cell2.appendChild(document.createTextNode("Release Date"));
    const cell3 = document.createElement('th');
    cell3.appendChild(document.createTextNode("Rating"));
    const cell4 = document.createElement('th');
    cell4.appendChild(document.createTextNode("Select"));

    // Append the Cells to the Row
    movieRow.appendChild(cell1);
    movieRow.appendChild(cell2);
    movieRow.appendChild(cell3);
    movieRow.appendChild(cell4);
}

const resetForTVShow = () => {
    movieTable.innerHTML = "";

    // Setup the Table Row
    const TVRow = movieTable.insertRow(0);

    // Add New Cells
    const cell1 = document.createElement('th');
    cell1.appendChild(document.createTextNode("TV Title"));
    const cell2 = document.createElement('th');
    cell2.appendChild(document.createTextNode("First Air Date"));
    const cell3 = document.createElement('th');
    cell3.appendChild(document.createTextNode("Rating"));
    const cell4 = document.createElement('th');
    cell4.appendChild(document.createTextNode("Select"));

    // Append the Cells to the Row
    TVRow.appendChild(cell1);
    TVRow.appendChild(cell2);
    TVRow.appendChild(cell3);
    TVRow.appendChild(cell4);
}

const resetForName = () => {
    movieTable.innerHTML = "";

    // Setup the Table Row
    const movieRow = movieTable.insertRow(0);

    // Add New Cells
    const cell1 = document.createElement('th');
    cell1.appendChild(document.createTextNode("Name"));
    const cell2 = document.createElement('th');
    cell2.appendChild(document.createTextNode("Known For"));
    const cell3 = document.createElement('th');
    cell3.appendChild(document.createTextNode("Release Date"));
    const cell4 = document.createElement('th');
    cell4.appendChild(document.createTextNode("Rating"));
    const cell5 = document.createElement('th');
    cell5.appendChild(document.createTextNode("Select"));

    // Append the Cells to the Row
    movieRow.appendChild(cell1);
    movieRow.appendChild(cell2);
    movieRow.appendChild(cell3);
    movieRow.appendChild(cell4);
    movieRow.appendChild(cell5);
}

//Process click event to see popular tv shows

popularTVShows.addEventListener('change', () => {
    let apiPath;
    if (popularTVShows.checked) {
        apiPath = popularTVURL;
        resetForTVShow();
        getTVShows(apiPath);
    } else {
        apiPath = nowMovieURL;
        resetForMovie();
        getMovies(apiPath);
    }
})

//Process the select genre event for movies

pickGenre.addEventListener('click', () => {
    let apiPath;
        apiPath = nowMovieURL;
        resetForMovie();
        getGenre(apiPath);
})

//Search by Movie Title, TV Show Title, or Actor's Name

findItem.addEventListener('click', () => {
    if (searchItem.value !== "") {
        if (searchTitle.checked) {
            resetForMovie();
            getMovies(searchMovie + `'${ encodeURI(searchItem.value) }'`);
        } else if (searchName.checked) {
            resetForName();
            getPeople(searchPerson + `'${ encodeURI(searchItem.value) }'`);
        } else if (searchTV.checked) {
            resetForTVShow();
            getTVShows(searchTVShow + `'${ encodeURI(searchItem.value) }`);
        }
    }    
})

//Process the purchase rentals and treats button

purchaseBtn.addEventListener('click', () => {
    let movieRental = movieRent.value;
    let tvRental = tvRent.value;
    let buyPopcorn = popcorn.value;
    let addButter = butter.value;
    let buySoftDrink = softdrink.value;
    let typeOfDrink = typeDrink.value; 
    let buyCandies = candies.value;
    let typeOfCandies = typeCandies.value; 
    let buyTshirt = tshirt.value;

    let totalBill = (movieRental*2)+(tvRental*1)+(buyPopcorn*1)+(buySoftDrink*1)+(buyCandies*1)+(buyTshirt*1);

    let bill = `Thank you for your purchase. The total comes to $${totalBill}.  UberEats will deliver your purchases in 15 minutes.  Enjoy your show!<br><br>`;

    let listOfTreats=`Here are the following treats you purchased: <br><br><ul>`;
    if (buyPopcorn==="1") {
        let popcorn="<li>Small popcorn";
        listOfTreats+=popcorn;
    }
    if (buyPopcorn==="2") {
        let popcorn="<li>Medium popcorn";
        listOfTreats+=popcorn;
    }
    if (buyPopcorn==="3") {
        let popcorn="<li>Large popcorn";
        listOfTreats+=popcorn;
    }
    if (buyPopcorn!=="0") {
        if (addButter==="0") {
            let butter=" without butter</li>";
            listOfTreats+=butter;
        }
        if (addButter==="1") {
            let butter=" with butter</li>";
            listOfTreats+=butter;
        }
    }
    if(buySoftDrink==="1") {
        let drink="<li>Small";
        listOfTreats+=drink;
    }
    if(buySoftDrink==="2") {
        let drink="<li>Medium";
        listOfTreats+=drink;
    }
    if(buySoftDrink==="3") {
        let drink="<li>Large";
        listOfTreats+=drink;
    }

    if(buySoftDrink!=="0") {
        if(typeOfDrink==="0") {
            let drink=" Coke</li>";
            listOfTreats+=drink;
        }
        if(typeOfDrink==="1") {
            let drink=" Sprite</li>";
            listOfTreats+=drink;
        }
        if(typeOfDrink==="2") {
            let drink=" Orange Crush</li>";
            listOfTreats+=drink;
        }
        if(typeOfDrink==="3") {
            let drink=" Rootbeer</li>";
            listOfTreats+=drink;
        }
    }

    if(buyCandies==="2"){
        if(typeOfCandies==="0") {
            let candy="<li>Skittles</li>";
            listOfTreats+=candy;
        }
        if(typeOfCandies==="1") {
            let candy="<li>Milk Duds</li>";
            listOfTreats+=candy;
        }
        if(typeOfCandies==="2") {
            let candy="<li>Twizzlers</li>";
            listOfTreats+=candy;
        }
        if(typeOfCandies==="3") {
            let candy="<li>Sour Patch Kids</li>";
            listOfTreats+=candy;
        }
    }

    if (buyPopcorn==="0"&&buySoftDrink==="0"&&buyCandies==="0") {
        listOfTreats = `You did not buy any treats today.<br><br>`;
    }


    outputArea.innerHTML = bill + listOfTreats + "</ul>" + `<br>  You will get 10% OFF on your next rental with us!`;

    // Reset UI Fields
    movieRent.value = "";
    tvRent.value = "";
    popcorn.value = "";
    movieRent.focus();
})

