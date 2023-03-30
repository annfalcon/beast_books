$(document).ready(() => {
  // Handles form validation and submition
  const form = document.getElementById("order-form");

  form.addEventListener(
    "submit",
    function (event) {
      const isValid = form.checkValidity();

      if (!isValid) {
        // if form is not valid don't submit it
        event.preventDefault();
        event.stopPropagation();
        // add bootstrap class for validation
        form.classList.add("was-validated");
      }
    },
    false
  );

  loadItems();

  // Get countries for form options
  getCountries();

  $("#shipping-options input[type=radio]").click(function(){

    let val=parseFloat($(this).val())
    let price = totalPrice()
    let totalWithShipping = (val + price).toFixed(2)

    $("#shipping-cost").text(val)
    $("#total-cost").text(totalWithShipping)


  })

  $("#total-cost").text(totalPrice())

});

// Total price without shipping

function totalPrice() {
    let total = 0;
    for (let i=0; i< localStorage.length; i++){
      const key = localStorage.key(i);
      const item = JSON.parse(localStorage.getItem(key));
      total = total + (item.price * item.quantity);
    }
    return total
  }

// Function load item
function loadItems() {
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    const item = JSON.parse(localStorage.getItem(key));
    console.log(item);
    $("#cart-items")
      .append(`<div id="${key}" class="d-flex flex-row align-items-center justify-content-between">
       
        
          <img class="cart-img img-title" src="${item.image}" alt="${
      item.title
    }" srcset="">
        
            <div class="item-quantity">${item.quantity}</div>
          
  
          <div class="cart-price book-price col-md-2 checkout-cart-price"><span id="price-${key}">${(
      item.price * item.quantity
    ).toFixed(2)}</span> &euro;</div>
          
        </div>`);
  }
}

async function getCountries() {
  const response = await fetch("https://restcountries.com/v2/all");

  if (response.status == 200) {
    const countries = await response.json();

    console.log(countries);

    for (let i = 0; i < countries.length; i++) {
      const country = countries[i];

      const option = `<option value="${country.alpha3Code}">${country.name}</option>`;
      $("#country-select").append(option);
    }
  }
}
