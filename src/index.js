document.addEventListener('DOMContentLoaded', () => {
    //create global variables

    const dogBar = document.getElementById('dog-bar')
    const baseUrl = "http://localhost:3000/pups/"

    const getData = () => {
        fetch(baseUrl)
        .then(resp => resp.json())
        .then(dogs => renderDogs(dogs)) //aspirational code
    }

    function renderDogs(dogs, filter = "false"){
        dogBar.innerHTML = ""

        if (filter) {
            dogs.filter(dog => dog.isGoodDog).forEach(renderDog)
        } else {
            for (const dog of dogs){
                renderDog(dog) //aspirational code
                // console.log(dog)
            }
        }
    }

    function renderDog(dog){
        let span = document.createElement('span')
        span.dataset.id = `${dog.id}`
        span.innerHTML = `${dog.name}`
        span.dataset.status = `${dog.isGoodDog}`
        dogBar.append(span)
    }

    const clickHandler = () => {
        document.addEventListener('click', e => {
            // console.log(e.target)
            if (e.target.matches('span')) {
                // console.log(e.target)
                let id = e.target.dataset.id
                let infoDiv = document.getElementById('dog-info')
                let img = document.createElement('img')
                let h2 = document.createElement('h2')
                let button = document.createElement('button')

                //create the function to fetch the info for a specific dog (with 'id')
                const fetchInfo = (id) => {
                    fetch(baseUrl + id)
                    .then(resp => resp.json())
                    .then(info => assignInfo(info)) //aspirational code
                }

                const assignInfo = (info) => {
                    img.src = info.image
                    h2.innerText = info.name
                    
                    //conditional for if the dog is good or not
                    if (info.isGoodDog === true) {
                        button.innerText = "Good"
                        button.dataset.status = button.innerText
                    } else {
                        button.innerText = "Bad"
                        button.dataset.status = button.innerText
                    }
                    button.id = "good-button"

                    infoDiv.append(img)
                    infoDiv.append(h2)
                    infoDiv.append(button)
                    infoDiv.dataset.id = id
                }

                //create a function to clear the infoDiv section, so that the next clicked dog's info can properly be displayed
                const removeInfo = () => {
                    while (infoDiv.firstChild){
                        infoDiv.removeChild(infoDiv.firstChild)
                    }
                }

                //invoke the removeInfo function to clear out the div info, to display 
                // the dog info for the next clicked 'dog name'
                //invoke the functions created within the scope of the clickHandler
                removeInfo()
                fetchInfo(id)

            } else if (e.target.matches('#good-button')) {
                // console.log(e.target)
                const goodButton = e.target
                const buttonDiv = goodButton.parentNode
                const dogId = buttonDiv.dataset.id

                //create a function that will take in the new status of the dog, and the id
                // and update the dog info via a PATCH method
                const updateDog = (status, dogId) => {
                    const options = {
                        method: "PATCH",
                        headers: {
                            "content-type": "application/json",
                            "accept": "application/json"
                        },
                        body: JSON.stringify({
                            isGoodDog: status
                        })
                    }

                    return fetch(baseUrl + dogId, options)
                    .then(response => response.json())
                    .then(console.log) //doesn't cause a problem in the dogBar
                }

                if (goodButton.innerText === "Good") {
                    updateDog('false', dogId)
                    goodButton.innerText = "Bad"
                } else {
                    updateDog('true', dogId)
                    goodButton.innerText = "Good"
                }

            } else if (e.target.matches('#good-dog-filter')) {
                const filterButton = e.target
                //create the function that will be invoked whenever the 'filter button' is invoked
                const filterDogs = () => {
                    let dogs = dogBar.children //set all the current dogs in the dog-bar div to a variable

                    for (const dog of dogs){
                        if (dog.dataset.status === "false"){
                            dog.style.display = "hidden"
                        }
                    }
                }

                if (filterButton.innerText === "Filter good dogs: OFF") {
                    filterButton.innerText = "Filter good dogs: ON"
                    filterDogs()
                } else {
                    filterButton.innerText = "Filter good dogs: OFF"
                }
            }

        })
    }
    
    //invoke appropriate functions
    getData()
    clickHandler()
})