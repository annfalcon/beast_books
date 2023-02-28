$(document).ready(() => {
  $(".category").click(function () {
    const category = $(this).text();

  $(".category").removeClass("selected")

  $(this).addClass("selected")

    getBooks(category);
  });

  $(".search.btn").click(function () {
    const searchBox = $(".search-box").val();

    getBooks(searchBox);
  });
});

async function getBooks(kind) {
  const response = await fetch(
    `https://www.googleapis.com/books/v1/volumes?q=${kind}`
  );
  if (response.status == 200) {
    const data = await response.json();
    let books = data.items;

    console.log(data);
    $("#books-container").empty();
    for (let i = 0; i < books.length; i++) {
      let thumbnail = ""
      if (books[i].volumeInfo.imageLinks) {
        thumbnail=books[i].volumeInfo.imageLinks.thumbnail
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
