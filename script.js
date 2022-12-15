import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, deleteDoc, doc } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-firestore.js"

  const firebaseConfig = {
    apiKey: "AIzaSyBrX-AnkhrTEBEbTN_iK4GQ0B1rXCZRzd4",
    authDomain: "de-ve-de-2b2b5.firebaseapp.com",
    projectId: "de-ve-de-2b2b5",
    storageBucket: "de-ve-de-2b2b5.appspot.com",
    messagingSenderId: "795904837924",
    appId: "1:795904837924:web:91294dba6423299deacbb1"
  };

  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);
  const btn = document.querySelector('#input-button');
  const movieTitel = document.querySelector('#titel');
  const movieGenre = document.querySelector('#genre');
  const movieDate = document.querySelector('#date');
  const moviesElem = document.querySelector('#movie');
  const completedMoviesElem = document.querySelector('#completedMovies');


   let movie = {
        titel: '',
        genre: '',
        date: ''
    }


async function saveToDataBase(movie) {
    try{
        await addDoc(collection(db, 'de-ve-de' ), movie);
        location.reload();
    } catch (error) {
        console.log('ERROR', error);
    }
}

function addMovieInfo(){
    btn.addEventListener('click', () => {
        movie.titel = movieTitel.value;
        movie.genre = movieGenre.value;
        movie.date = movieDate.value;
        saveToDataBase(movie);
        
    }) 
    
}

async function removeFromDatabase(movieID, movieText) {
    try {
        await deleteDoc(doc(db, 'de-ve-de', movieID));
        await addDoc(collection(db, 'CompletedMovies'), {
            titel: movieText,
            
        });
        location.reload();
    } catch (error){
        console.log('ERROR', error);
    }
}

     function addClickEvent() {
        const moviesElem = document.querySelectorAll('li');
        moviesElem.forEach((moviesElem) => {
            moviesElem.addEventListener('click', (event) => {
                
                const movieId = event.target.getAttribute('data-de-ve-de-id');
                const movieText = event.target.innerText;
                removeFromDatabase(movieId, movieText);
            });
        })
    }


async function getAllMovies(){
    const movies = await getDocs(collection(db, 'de-ve-de'));
    const completedMovies = await getDocs(collection(db, 'CompletedMovies'))
    
    
    movies.forEach((movie) => {
        console.log(movie.data());
        const titelElem = `<li data-de-ve-de-id="${movie.id}">${movie.data().titel}</li>`;
        const genreElem = `<li data-de-ve-de-id="${movie.id}">${movie.data().genre}</li>`;
        const dateElem = `<li data-de-ve-de-id="${movie.id}">${movie.data().date}</li>`;
        moviesElem.insertAdjacentHTML('beforeend', titelElem);
        moviesElem.insertAdjacentHTML('beforeend', genreElem);
        moviesElem.insertAdjacentHTML('beforeend', dateElem);
    });

    completedMovies.forEach((completedMovies) => {
        console.log(completedMovies.data());
        const titelElem = `<li data-CompletedMovies-id="${completedMovies.id}">${completedMovies.data().titel}</li>`;
        completedMoviesElem.insertAdjacentHTML('beforeend', titelElem);

    });

    addClickEvent()
}

addMovieInfo()
getAllMovies()
