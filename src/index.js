document.addEventListener('DOMContentLoaded', () => {
    const dogBar = document.getElementById('dog-bar')
    const baseUrl = "http://localhost:3000/pups/"
    console.log(dogBar)

    const fetchDogs = () => {
        fetch(baseUrl)
        .then(res => res.json())
        .then(dogs => showDogs(dogs))
    }

    const showDogs = (dogs, filter = false) => {
        dogBar.innerHTML = ""
        if (filter) {
            dogs.filter(dog => dog.isGoodDog).forEach(renderDog)
        } else {
            dogs.forEach(renderDog)
        }
    }

    const renderDog = (dog) => {
        const span = document.createElement('span')
        span.dataset.id = dog.id 
        span.innerText = dog.name
        span.dataset.status = dog.isGoodDog
        dogBar.append(span) 
    }

    const clickHandler = () => {
        document.addEventListener('click', (e) => {
            if (e.target.matches('span')) {
                const dogId = e.target.dataset.id
                const div = document.getElementById('dog-info') 
                const img = document.createElement('img')
                const h2 = document.createElement('h2')
                const button = document.createElement('button')

                const fetchDogInfo = (id) => {
                    fetch(baseUrl + id)
                    .then(res => res.json())
                    .then(dogInfo => assignInfo(dogInfo))
                }
                const assignInfo = (info) => {
                    img.src = info.image
                    h2.innerText = info.name 
                    if (info.isGoodDog === true) {
                        button.innerText = "good"
                        button.dataset.status = button.innerText
                    } else {
                        button.innerText = "bad"
                        button.dataset.status = button.innerText
                    }
                    button.id = "good-button"

                    div.append(img)
                    div.append(h2)
                    div.append(button)
                    div.dataset.id = dogId
                }

                const removeInfo = () => {
                    while (div.firstChild) {
                        div.removeChild(div.firstChild);
                    }
                }

                removeInfo()
                fetchDogInfo(dogId)
            }

            if (e.target.matches('#good-button')) {
                const goodButton = e.target 
                const buttonContainer = goodButton.parentNode
                const dogId = buttonContainer.dataset.id

                const updateDog = (status, id) => {
                    const options = {
                        method: "PATCH",
                        headers: {
                            "content-type": "application/json",
                            "accept": "application/json"
                        },
                        body: JSON.stringify({isGoodDog: status})
                    }


                    return fetch(baseUrl + id, options)
                    .then(res => res.json())
                    .then(console.log)
                }

                if (goodButton.innerText === "good") {
                    updateDog("false", dogId)
                    goodButton.innerText = "bad"
                } else {
                    updateDog("true", dogId)
                    goodButton.innerText = "good"
                }
            }

            if (e.target.matches('#good-dog-filter')) {
                const filterButton = e.target 

                if (filterButton.innerText === "Filter good dogs: OFF") {
                    filterButton.innerText = "Filter good dogs: ON"
                    filterDogs()
                } else {
                    filterButton.innerText = "Filter good dogs: OFF"
                }

                const filterDogs = () =>{
                    const dogs = dogBar.children 
                    for (const dog of dogs) {
                        if (dog.dataset.status === "false") {
                            dog.style.display = "hidden"
                        }
                    }
                }

            }
        })
    }


    fetchDogs()
    clickHandler()
})