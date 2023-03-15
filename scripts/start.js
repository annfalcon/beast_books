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

  $("#books-container").on("click", ".btn-add-cart", function (){
    const item = {
      title: $(this).data("title"),
      price: parseInt($(this).data("price")),
      quantity: parseInt($(this).data("quantity")),
      image: $(this).data("image"),
    }
    console.log(item)
    const id = $(this).data("id")

    localStorage.setItem(id, JSON.stringify(item))
  })

  $(".basket-big").click(function(){
    $("#offcanvas-cart").empty()

    for (let i = 0; i<localStorage.length; i++) {
      const key = localStorage.key(i)
      const item = JSON.parse(localStorage.getItem(key))
      console.log(item)
      $("#offcanvas-cart").append(`<tr>
        <td><img class="cart-img img-title" src="${item.image}" alt="${item.title}" srcset=""></td>
        <td class="book-qty">${item.quantity} </td>
        <td class="cart-price book-price">${item.price} &euro;</td>
      </tr>`)
    }
  })

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

    // Add book html to container

      $("#books-container").append(`<div class="book">
        <img class="imgBook" src="${thumbnail}" alt="" srcset="">
        <div class="title">
        ${books[i].volumeInfo.title}
        </div>
        <div class="desc">
        ${books[i].volumeInfo.authors || ""}
        </div>

        <button type="button" class="btn btn-primary btn-sm btn-add-cart" data-id="${books[i].id}" data-title="${books[i].volumeInfo.title.replace(/\"/, '')}" data-image="${thumbnail}" data-price="10" data-quantity="1">Add to cart</button>
        
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