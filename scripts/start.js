$(document).ready(() => {
  $(".category").click(function () {
    const category = $(this).text();
    $("#books-container").empty();

    $(".category").removeClass("selected");
    $(this).addClass("selected");
    getBooks(category);
  });

  $(".all-category").click(function() {
      $(".category").removeClass("selected")
      $("#books-container").empty();
      $(this).addClass("selected");
      getBooks("novels");
      getBooks("fiction");
      getBooks("non-fiction");
  })

  $(".bestsellers").click(function () {
    $(".category").removeClass("selected");
    $("#books-container").empty();
    
    getBestSellers();
  });

  $(".search.btn").click(function () {
    const searchBox = $(".search-box").val();
    $("#books-container").empty();

    $(".category").removeClass("selected");
    getBooks(searchBox);
  });
});

async function getBooks(kind) {
  const response = await fetch(
    `https://www.googleapis.com/books/v1/volumes?q=${kind}`
  );
  if (response.status == 200) {
    const data = await response.json();
    let books = data.items || [];

    console.log(data);
    for (let i = 0; i < books.length; i++) {
      let thumbnail = "";
      if (books[i].volumeInfo.imageLinks) {
        thumbnail = books[i].volumeInfo.imageLinks.thumbnail;
      }

      $("#books-container").append(`<div class="book">
        <img class="imgBook" src="${thumbnail}" alt="" srcset="">
        <div class="title">
        ${books[i].volumeInfo.title}
        </div>
        <div class="desc">
        ${books[i].volumeInfo.authors || ""}
        </div>
        
      </div>`);
    }
  }
}

getBooks("novels");
getBooks("fiction");
getBooks("non-fiction");


async function getBestSellers(){
  const response = await fetch(`https://api.nytimes.com/svc/books/v3/lists/best-sellers/history.json?api-key=XdeEe3wf6GBydft9tgGFNHyBjVRDK1jZ`)

  if (response.status == 200) {
    const data = await response.json();
    let books = data.results;

    console.log(books)
    books.forEach(element => {
      if (element.isbns.length){
        const isbn=element.isbns[0].isbn13
        getBooks(`isbn:${isbn}`)
      }
     
      
    });
  }


}