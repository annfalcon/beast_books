// Document is ready
// Call Jquery ready

$(document).ready(() => {
  // Handle .category click event
  $(".category").click(function () {
    const category = $(this).text();

    // Clears the books before rendering new books
    $("#books-container").empty();

    // Removes selected class from .category
    $(".category").removeClass("selected");
    $(this).addClass("selected");
    // Fetch books and add into the container
    getBooks(category);

    //Hide offcanvas
    $("#offcanvasTop").offcanvas('hide');
  });

  //  Handle .all-category click events
  $(".all-category").click(function () {
    // Removes selected class
    $(".category").removeClass("selected");
    // Removes selected class from .category
    $("#books-container").empty();
    // Adds selected to all category
    $(this).addClass("selected");
    getBooks("novels");
    getBooks("fiction");
    getBooks("non-fiction");
  });

  // Handle click event for bestseller button
  $(".bestsellers").click(function () {
    // Removes selected class from .category
    $(".category").removeClass("selected");
    // Removes selected class
    $("#books-container").empty();

    // Get Best Sellers Books
    getBestSellers();
  });

  // Handle submit event for search button
  $("#searchForm").submit(function () {
    // Read the value from search box
    const searchBox = $(".search-box").val();
    // Remove books from container
    $("#books-container").empty();

    $(".category").removeClass("selected");
    getBooks(searchBox);
    return false;
  });

  $("#books-container").on("click", ".btn-add-cart", function () {
    const item = {
      title: $(this).data("title"),
      price: parseFloat($(this).data("price")),
      quantity: parseInt($(this).data("quantity")),
      image: $(this).data("image"),
    };
    console.log(item);
    const id = $(this).data("id");

    localStorage.setItem(id, JSON.stringify(item));

    

    // Clone book cover for animation

    $(this).closest(".book").find(".imgBook")
      .clone()
      .addClass("zoom")
      .appendTo("#nav-basket");
    setTimeout(function(){
      $(".zoom").remove();
    }, 1000)
  });

  

  $(".basket").click(function () {
    $("#offcanvas-cart").empty();

    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      const item = JSON.parse(localStorage.getItem(key));
      console.log(item);
      $("#offcanvas-cart").append(`<tr id="${key}">
        <td><img class="cart-img img-title" src="${item.image}" alt="${
        item.title
      }" srcset=""></td>
        <td class="book-qty"><input type="number" class="cart-qty" name="quantity" min="1" max="5" value="${
          item.quantity
        }" data-id="${key}"></td>

        <td class="cart-price book-price"><span id="price-${key}">${
        (item.price * item.quantity).toFixed(2)
      }</span> &euro;</td>
        <td>
          <button class="button-del" data-id="${key}">Delete</button>
        </td>
      </tr>`);
    }

    $("#totalPrice").text(totalPrice())
  });

  

  // Handle click for delete button (this button is added by JS)
  $("#offcanvas-cart").on("click", ".button-del", function () {
    // Reading book id from delete button
    const id = $(this).data("id");
    // Delete book from local storage
    localStorage.removeItem(id);
    // Remove from html
    $(`#${id}`).remove();
    //Update todal price on screen
    $("#totalPrice").text(totalPrice())
  });

  // Handle quantity change events
  $("#offcanvas-cart").on("change", ".cart-qty", function () {
    //Reading book id from the input
    const id = $(this).data("id");
    //Convert string into object
    let item = JSON.parse(localStorage.getItem(id));
    //Updating qty in Item object
    item.quantity = $(this).val();
    //Update to local storage - converts object to string
    localStorage.setItem(id, JSON.stringify(item));
    //Calculate new price
    const newPrice = item.price * item.quantity;
    //Update price in cart html
    $(`#price-${id}`).text(newPrice.toFixed(2));
    //Update total 
    $("#totalPrice").text(totalPrice())
  });

  $("#books-container").on("click", ".imgBook", async function () {
    const bookId = $(this).data("id")
    console.log(bookId)
    const response = await fetch(
      `https://www.googleapis.com/books/v1/volumes/${bookId}`
    );
    // Check the status in response
    if (response.status == 200) {
      //reading json body
      const book = await response.json();
      //Exit the function if there are no books
      if (!book) {
        return;
      }

      // Reading data from book json for modal description
      const desc = book.volumeInfo.description
      const img = book.volumeInfo.imageLinks.thumbnail
      const title = book.volumeInfo.title

      $("#bookModalLabel").text(title)
      $("#bookImg").html(`
      <img class="img-modal" src="${img}" alt="" />
      `)
      $("#bookDesc").html(desc)
      $("#bookModal").modal("show")

    }

  })

});


function totalPrice() {
  let total = 0;
  for (let i=0; i< localStorage.length; i++){
    const key = localStorage.key(i);
    const item = JSON.parse(localStorage.getItem(key));
    total = total + (item.price * item.quantity);
  }
  return total.toFixed(2)
}

// This function fetch books from google books API and adds books in the book container
async function getBooks(kind) {
  // First fetch books from google API
  const response = await fetch(
    `https://www.googleapis.com/books/v1/volumes?q=${kind}`
  );
  // Check the status in response
  if (response.status == 200) {
    //reading json body
    const data = await response.json();
    let books = data.items;
    //Exit the function if there are no books
    if (!books) {
      return;
    }

    //
    for (let i = 0; i < books.length; i++) {
      let thumbnail = "";
      if (books[i].volumeInfo.imageLinks) {
        thumbnail = books[i].volumeInfo.imageLinks.thumbnail;
      }

      let amount = 24.99;
      if (books[i].saleInfo.retailPrice) {
        amount = books[i].saleInfo.retailPrice.amount;
      }

      // Add book html to container

      $("#books-container").append(`<div class="book">
        <img class="imgBook" src="${thumbnail}" alt="" srcset="" data-id="${books[i].id}">
        <div class="title">
        ${books[i].volumeInfo.title}
        </div>
        <div class="desc">
        ${books[i].volumeInfo.authors || ""}
        </div>
        
        <div class="price">${amount} &euro;</div>
      
        <button type="button" class="btn btn-primary btn-sm btn-add-cart" data-id="${
          books[i].id
        }" data-title="${books[i].volumeInfo.title.replace(
        /\"/,
        ""
      )}" data-image="${thumbnail}" data-price="${amount}" data-quantity="1">Add to cart</button>
        
      </div>`);
    }
  }
}

getBooks("novels");
getBooks("fiction");
getBooks("non-fiction");

async function getBestSellers() {
  const response = await fetch(
    `https://api.nytimes.com/svc/books/v3/lists/best-sellers/history.json?api-key=XdeEe3wf6GBydft9tgGFNHyBjVRDK1jZ`
  );

  if (response.status == 200) {
    const data = await response.json();
    let books = data.results;

    console.log(books);
    books.forEach((element) => {
      if (element.isbns.length) {
        const isbn = element.isbns[0].isbn13;
        getBooks(`isbn:${isbn}`);
      }
    });
  }
}
