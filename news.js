const apiKey = `6f5f78ac4cff473b8c4e11a7031f2e47`;
let newsList = []; // 뉴스 사용
const menus = document.querySelectorAll('.menus button');
// PageNation용
let totalResults = 0; //api 에서 몇개의 결과를 받아올건지
let page = 1; // 현재 페이지가 몇인지
const pageSize = 10; // 페이지에서 몇개씩 보여줄건지 고정값
const groupSize = 5; // 페이지 네이션을 몇개 출력할건지 고정값
// querySelecterAll 이므로 menus는 배열 SO, forEach값을 사용할 수 있며, forEach는 반환값이 없다.
menus.forEach((menu) => menu.addEventListener("click",(event)=>{getNewsCategory(event)}));
let url = new URL(`https://newsapi.org/v2/top-headlines?country=us&apiKey=${apiKey}`);


const getNews = async() =>{
    try{
        //*주의 사항 URL에 붙인 다음에 URL을 호출해야하기 때문에, 호출코드 앞에 선언해준다.
        url.searchParams.set("page",page); // => &page = page
        url.searchParams.set("pageSize",pageSize); // =>&pageSize = pageSize

        let response = await fetch(url);
        const data = await response.json(); //json은 파일 형식
        
        if(response.status === 200){
            if(data.articles.length == 0){
                throw new Error("No result for this search");
            }
            newsList = data.articles; // 뉴스 재할당 그래서 let 사용
            totalResults = data.totalResults; // api에서 주는 totalResults 값을 가져옴
            render();
            pageNationRender();
        }else{
            throw new Error(data.message);
        }
    } catch(error){
        errorRender(error.message);
    }
    
};


// 뉴스 데이터 세팅
const getLatestNews = async () => {
    url = new URL(`https://newsapi.org/v2/top-headlines?country=us&apiKey=${apiKey}`);

    getNews();
}

//카테고리 필터
const getNewsCategory = async(event) =>{
    const category = event.target.textContent.toLowerCase();

    url = new URL(`https://newsapi.org/v2/top-headlines?country=us&category=${category}&apiKey=${apiKey}`)
    getNews();

}

// 키워드별 뉴스
const getBySearchKeyword = async() => {
    const input = document.querySelector('.search_input').value;

    url = new URL(`https://newsapi.org/v2/top-headlines?country=us&q=${input}&apiKey=${apiKey}`);
    getNews();
}

// 펼쳐서 보여주는 값
const render = () =>{
    const newsHTML = newsList.map(
        (item)=>`<div class = "row news">
    <div class = "col-lg-4">
      <img class = "news-img-size" src = ${item.urlToImage}>
    </div>
    <div class = "col-lg-8">
      <h2>${item.title}</h2>
      <p>
        ${item.description}
      </p>
      <div>
        ${item.publishedAt}
      </div>
    </div>
  </div>`
  ).join('');

    document.getElementById('news-board').innerHTML = newsHTML;
}


const errorRender = (errorMessage) => {
    const errorHTML = `<div class="alert alert-danger" role="alert">
        ${errorMessage}
     </div>`;

     document.getElementById('news-board').innerHTML = errorHTML

}

const pageNationRender = () => {
    // 페이지 네이션 (뉴스 에이피아이에 있는것)
    // pageGroup = 현재 페이지 / 그룹사이즈  -> 결과값에서 올림처리하면 해당페이지가 몇번째 위치해야하는지 알수 있다.
    // firstPage
    // lastPage
    // totalPage

    let totalPages = Math.ceil(totalResults / pageSize);
    let pageGroup = Math.ceil(page / groupSize); // 몇 번째 그룹에 속해있는지 
    let lastPage = pageGroup * groupSize; //마지막 페이지
    if(lastPage > totalPages){
        lastPage = totalPages;
    }

    const firstPage = lastPage - (groupSize - 1) <= 0? 1:lastPage - (groupSize - 1);

    let paginationHTML = `<li class="page-item" onclick = "moveToPage(${page-1})"><a class="page-link" href="#">Previous</a></li>`;

    for(let i = firstPage; i<= lastPage; i++) {
        paginationHTML += `<li class="page-item" onclick = "moveToPage(${i})"><a class="page-link" href="#">${i}</a></li>`;
    }
    paginationHTML += `<li class="page-item" onclick = "moveToPage(${page+1})"><a class="page-link" href="#">Next</a></li>`;
    document.querySelector('.pagination').innerHTML = paginationHTML;
} 

const moveToPage = (pageNumber) => {
    page = pageNumber;
    getNews();
}


getLatestNews();