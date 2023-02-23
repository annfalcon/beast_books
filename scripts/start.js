$(document).ready(() => {});

async function getBooks(kind) {
  const response = await fetch(
    `https://www.googleapis.com/books/v1/volumes?q=${kind}`
  );
  if (response.status == 200) {
    const data = await response.json();
    let books = data.items;

    console.log(data);

    for (let i = 0; i < books.length; i++) {
      $("#books-container").append(`<div class="book">
        <img src="${books[i].volumeInfo.imageLinks.thumbnail}" alt="" srcset="">
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
