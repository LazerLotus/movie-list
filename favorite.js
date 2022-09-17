const BASE_URL = 'https://movie-list.alphacamp.io'
const INDEX_URL = BASE_URL + '/api/v1/movies/'
const POSTER_URL = BASE_URL + '/posters/'

let movies = JSON.parse(localStorage.getItem('favoriteMovies')) || []
const dataPanel = document.querySelector('#data-panel')
const searchForm = document.querySelector('#search-form')
const searchInput = document.querySelector('#search-input')


//將電影從local storage  中刪除，並重新 render 畫面
function removeFromFavorite(id) {
  if (!movies || !movies.length) return

  const movieIndex = movies.findIndex((movie) => movie.id === id)
  if (movieIndex === -1) return

  movies.splice(movieIndex, 1)

  localStorage.setItem('favoriteMoveis', JSON.stringify(movies))
  renderMovieList(movies)
}


searchForm.addEventListener('submit', function onSearchFormSubmitted(event) {
  //取消瀏覽器預設事件，避免提交表單時重新刷新
  event.preventDefault()
  //取得搜尋關鍵字
  const keyword = searchInput.value.trim().toLowerCase()

  //儲存篩選過後的符合項目的資料
  let filteredMovies = []

  //錯誤處理，避免空字串（沒有 length 為 0，視為 false）
  if (!keyword.length) {
    return alert('請輸入有效字串！(不能僅含有空白字元)')
  }
  //篩選出符合關鍵字的項目
  filteredMovies = movies.filter((movie) =>
    movie.title.toLowerCase().includes(keyword)
  )

  //若沒有找到相關內容則顯示警告
  if (filteredMovies.length === 0) {
    return alert(`您輸入的關鍵字 ${keyword} 沒有找到結果'`)
  }
  //渲染衰選過後的列表
  renderMovieList(filteredMovies)

  console.log('click!')
})

//按照傳入的陣列渲染 Movie List 
function renderMovieList(data) {
  let rawHTML = ''
  data.forEach(item => {
    //title, image
    rawHTML += `<div class="col-sm-2">
        <div class="mb-2">
          <div class="card">
            <img
              src="${POSTER_URL + item.image}"
              class="card-img-top" alt="Movie Poster">
            <div class="card-body">
              <h5 class="card-title">${item.title}</h5>
            </div>
            <div class="card-footer text-muted">
              <button class="btn btn-primary btn-show-movie" data-bs-toggle="modal"
                data-bs-target="#movie-modal" data-id="${item.id}">More</button>
              <button class="btn btn-danger btn-remove-favorite" data-id=${item.id}>X</button>
            </div>
          </div>
        </div>
      </div>`
  })
  dataPanel.innerHTML = rawHTML
}

//點擊 More 生成電影詳細資訊的dialog
function showMovieModal(id) {
  const modalTitle = document.querySelector('#movie-modal-title')
  const modalImage = document.querySelector('#movie-modal-image')
  const modalDate = document.querySelector('#movie-modal-date')
  const modalDescription = document.querySelector('#movie-modal-description')
  axios.get(INDEX_URL + id).then((response) => {
    const data = response.data.results
    modalTitle.innerText = data.title
    modalDate.innerText = 'Release date: ' + data.release_date
    modalDescription.innerText = data.description
    modalImage.innerHTML = `<img src="${POSTER_URL + data.image
      }" alt="movie-poster" class="img-fluid">`
  })
}

//監測 More button 與 favorite button
dataPanel.addEventListener('click', function onPanelClicked(event) {
  if (event.target.matches('.btn-show-movie')) {
    showMovieModal(event.target.dataset.id)
  } else if (event.target.matches('.btn-remove-favorite')) {
    removeFromFavorite(Number(event.target.dataset.id))
  }
})

//從 movies（local 的favorite movies list ）取得電影資料並且 render 到網頁上
renderMovieList(movies)

