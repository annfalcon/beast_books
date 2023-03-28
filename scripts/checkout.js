$(document).ready(() => {

    // Handles form validation and submition
    const form = document.getElementById("order-form")

    form.addEventListener("submit", function(event) {
        const isValid = form.checkValidity()
       
        if (!isValid) {
            // if form is not valid don't submit it
            event.preventDefault()
            event.stopPropagation()
            // add bootstrap class for validation
            form.classList.add("was-validated")
        }

    }, false)


    // Get countries for form options
    getCountries()
})


async function getCountries(){
    const response=await fetch("https://restcountries.com/v2/all");

    if(response.status ==200) {
        const countries = await response.json()

        console.log(countries)

        for (let i=0; i<countries.length; i++){
            const country = countries[i]

            const option = `<option value="${country.alpha3Code}">${country.name}</option>`
            $("#country-select").append(option)
        }

        
    }


}