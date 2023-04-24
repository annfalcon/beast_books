$(document).ready(() => {
  $("#orderForm").submit(() => {
    const form = document.getElementById("orderForm");

    const isValid = form.checkValidity();
   
    if (!isValid) {
      // add bootstrap class for validation
      form.classList.add("was-validated");
    } else {
      const email = $("#orderInputEmail").val();
      const books = $("#orderInputBooks").val();
      const price = $("#orderInputPrice").val();
      const status = $("#orderInputStatus").val();

      addToTable(email, books, price, status);

      $("#orderInputEmail").val("");
      $("#orderInputBooks").val("");
      $("#orderInputPrice").val("");
      $("#orderModal").modal("hide");
    }

    return false;
  });

  $("#loginForm").submit(() => {
    const username = $("#username").val();
    const password = $("#password").val();

    if (username === "admin" && password === "admin") {
      $(".page").show();
      $(".card").hide();
    } else {
      $(".invalid-feedback").show();
      $("#loginForm").addClass("was-validated");
    }

    return false;
  });

  $("#orderEditSaveButton").click(() => {
    // reading ID
    const id = $("#orderEditInputId").val();
    const email = $("#orderEditInputEmail").val();
    const books = $("#orderEditInputBooks").val();
    const price = $("#orderEditInputPrice").val();
    const status = $("#orderEditInputStatus").val();

    // you can find this tr using `order-${id}`

    $(`#order-${id} td:nth-child(2)`).text(books);
    $(`#order-${id} td:nth-child(3)`).text(email);
    $(`#order-${id} td:nth-child(4)`).html(`${price}&euro;`);
    $(`#order-${id} td:nth-child(5)`).text(status);
    $("#orderEditModal").modal("hide");
  });

  $("#tableOrdersBody").on("click", ".btn-delete", function () {
    const result = confirm("Are you sure you want to delete order?");

    if (result) {
      const id = $(this).data("id");
      $(`#order-${id}`).remove();
    }
  });

  $("#tableOrdersBody").on("click", ".btn-edit", function () {
    const id = $(this).data("id");
    const books = $(`#order-${id} td:nth-child(2)`).text();
    const email = $(`#order-${id} td:nth-child(3)`).text();
    const price = $(`#order-${id} td:nth-child(4)`).text();
    const status = $(`#order-${id} td:nth-child(5)`).text();

    $("#orderEditInputEmail").val(email);
    $("#orderEditInputBooks").val(books);
    $("#orderEditInputPrice").val(parseFloat(price));
    $("#orderEditInputStatus").val(status);
    $("#orderEditInputId").val(id);
    $("#orderEditModal").modal("show");
  });
});

function addToTable(email, books, price, status) {
  const orderId = parseInt($("#tableOrdersBody tr:last td:first").text()) + 1;
  $("#tableOrdersBody").append(`
    <tr id="order-${orderId}">
        <td scope="col">${orderId}</td>
        <td scope="col">${books}</td>
        <td scope="col">${email}</td>
        <td scope="col">${price}&euro;</td>
        <td scope="col">${status}</td>
        <td><i class="bi bi-trash btn-delete" data-id="${orderId}"></i></td>
        <td><i class="bi bi-pencil-square btn-edit" data-id="${orderId}"></i></td>
    </tr>
    `);
}
