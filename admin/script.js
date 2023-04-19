$(document).ready(()=>{
    $("#orderSaveButton").click(()=>{
        console.log("saving....")
        const email = $("#orderInputEmail").val()
        const books = $("#orderInputBooks").val()
        const price = $("#orderInputPrice").val()
        const status = $("#orderInputStatus").val()

        console.log(books)

        addToTable(email, books, price, status)

        $("#orderInputEmail").val("")
        $("#orderInputBooks").val("")
        $("#orderInputPrice").val("")


        $("#orderModal").modal("hide")
    })


})

function addToTable(email, books, price, status){
    const orderId = parseInt($("#tableOrdersBody tr:last td:first").text()) + 1;
    $("#tableOrdersBody").append(`
    <tr>
        <td scope="col">${orderId}</td>
        <td scope="col">${books}</td>
        <td scope="col">${email}</td>
        <td scope="col">${price}&euro;</td>
        <td scope="col">${status}</td>
        <td><i class="bi bi-trash"></i></td>
        <td><i class="bi bi-pencil-square"></i></td>
    </tr>
    `)

}

