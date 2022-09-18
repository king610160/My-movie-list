const BASE_URL = "https://movie-list.alphacamp.io"
const INDEX_URL = BASE_URL + "/api/v1/movies/"
const POSTER_URL = BASE_URL + "/posters/"
const MOVIE_PER_PAGE = 12

const movies = []
let filterMovies = []

const dataPanel = document.querySelector('#data-panel')
const searchForm = document.querySelector('#search-form')
const searchInput = document.querySelector('#search-input')
const paginator = document.querySelector('#paginator')

function renderMovieList(data) {
  let rawHTML = ''
  data.forEach((item) =>{
    //title, image
    rawHTML +=`<div class="col-sm-3" >
      <div class="mb-2">
        <div class="card">
          <img src="${POSTER_URL + item.image}" class="card-img-top" alt="Movie poster">
            <div class="card-body">
              <h5 class="card-title">${item.title}</h5>
            </div>
            <div class="card-footer">
              <button class="btn btn-primary btn-show-movie" data-bs-toggle="modal" data-bs-target="#movie-modal" data-id="${item.id}">More</button>
              <button class="btn btn-info btn-add-favorite" data-id="${item.id}">+</button>
            </div>
        </div>
      </div>
    </div>`
  })
  dataPanel.innerHTML = rawHTML
}

function renderPaginator(amount) {
  const numberofPages = Math.ceil(amount / MOVIE_PER_PAGE)
  let rawHTML = ''
  for (let page = 1; page <= numberofPages; page++) {
    rawHTML +=`<li class="page-item"><a class="page-link" href="#" data-page="${page}">${page}</a></li>
    `
  }
  paginator.innerHTML = rawHTML
}

function getMoviesByPage(page) {
  const data = filterMovies.length ? filterMovies : movies//條件?A:B，如果true則A，false則B
  const startIndex = (page - 1) * MOVIE_PER_PAGE
  return data.slice(startIndex, startIndex + MOVIE_PER_PAGE)
}

function showMovieModal(id) {
  const modalTitle = document.querySelector("#movie-modal-title")
  const modalImage = document.querySelector("#movie-modal-image")
  const modalDate = document.querySelector("#movie-modal-date")
  const modalDescription = document.querySelector("#movie-modal-description")

  axios.get(INDEX_URL + id).then(response => {
    // response.data.results
    const data = response.data.results
    modalTitle.innerText = data.title
    modalDate.innerText = "Release Date : " + data.release_date
    modalDescription.innerText = data.description
    modalImage.innerHTML = `<img src="${POSTER_URL + data.image}" alt="movie-poster" class="img-full">`
  })
}

function addToFavorite(id) {
  // function isMovieIdMatched(movie){
  //   return movie.id === id
  // }

  const list = JSON.parse(localStorage.getItem('favoriteMoives')) || []
  // const movie = movies.find(isMovieIdMatched)
  const movie = movies.find((movie) => movie.id === id)//改成箭頭函式就不用return??

  if (list.some((movie) => movie.id === id)){
    return alert('此電影已經在收藏清單中!')
  }

  list.push(movie)//將list裡放喜歡電影
  console.log(list)

  localStorage.setItem('favoriteMoives', JSON.stringify(list))


  // const jsonString = JSON.stringify(list)//用stringify把字串以外東西放進去
  // console.log('json string: ',jsonString)//只傳回string內容
  // console.log('json object: ',JSON.parse(jsonString))//把傳回string內容轉為object
}

dataPanel.addEventListener('click', function onPanelClicked(event){
  if (event.target.matches('.btn-show-movie')) {
    // console.log(event.target.dataset)
    showMovieModal(Number(event.target.dataset.id))
  } else if (event.target.matches('.btn-add-favorite')) {
    addToFavorite(Number(event.target.dataset.id))
  }
})

paginator.addEventListener('click', function paginatorOnClicked(event){
  if (event.target.matches('.page-link')) {
    const page = Number(event.target.dataset.page)
    renderMovieList(getMoviesByPage(page))
  }
})

searchForm.addEventListener('submit', function onSearchFormSubmitted(event){
  event.preventDefault()
  const keyword = searchInput.value.trim().toLowerCase()


  // if (!keyword.length) {//句子長度為0會是false，前!就會為true
  //   return alert('this should not be blank')
  // }

  // for迴圈寫法
  // for (const movie of movies) {
  //   if (movie.title.toLowerCase().includes(keyword)){
  //     filterMovies.push(movie)
  //   }
  // }

  //map, filter, reduce
  filterMovies = movies.filter((movie) =>
    movie.title.toLowerCase().includes(keyword)
  )

  if (filterMovies.length === 0) {
    return alert('Cannot find movies with keywords.' + keyword)
  }
  renderPaginator(filterMovies.length)
  renderMovieList(getMoviesByPage(1))
})


axios.get(INDEX_URL).then((response) => {
  movies.push(...response.data.results)
  renderPaginator(movies.length)
  renderMovieList(getMoviesByPage(1))

  // Array(80)

  // 1. for迴圈，一個個推進去
  // for (const movie of response.data.results) { 
  //   movies.push(movie)
  // }

  // 2. 也是一個個推，但只加... 
  // movies.push(...response.data.results)
  // renderMovieList(movies)
  // console.log(movies)

  // 3. push可以不止推1個東西, 加上...可以只推內容元素
  // const numbers = [1, 2, 3]
  // movies.push(...numbers)
  // console.log(movies)
})

// localStorage用來放小資料，然後只能放string
// localStorage.setItem('default_language','English')
// console.log(localStorage.getItem('default_language'))
// localStorage.removeItem('default_language')
// console.log(localStorage.getItem('default_language'))