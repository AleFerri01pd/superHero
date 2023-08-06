//https://superheroapi.com/api/access-token/character-id

const SUPERHERO_TOKEN = '2604368956387033'
const BASE_URL = `https://superheroapi.com/api.php/${SUPERHERO_TOKEN}`
const maxIndexHero = 731 //👉🏻 start from 1 and not from 0

const randomHeroButton = document.getElementById('newHeroButton')
const heroImageDiv = document.getElementById('heroImage')
const heroInfo = document.getElementById('infoHero')
const clearButton = document.getElementById('clearButton')
const searchInput = document.getElementById('searchInput')
const suggestionsDiv = document.getElementById('suggestions')

const getSuperHero = (id) => {
    fetch(`${BASE_URL}/${id}`)
        .then(response => response.json())
        .then(json => {
            heroImageDiv.innerHTML = `<img class="img-fluid rounded-start" src="${json.image.url}"/>`
            showHeroInfo(json)
        })
}

const getSearchSuperHero = async (name) => {
    const results = await fetch(`${BASE_URL}/search/${name}`)
        .then(response => response.json())
        .then(json => {
            if (json.response !== 'success') {
                suggestionsDiv.innerHTML = ''
            }

            return json
        })

    return results
}

const showHeroInfo = (character) => {
    const heroCard = document.querySelector('.hero.card')
    const nameHero = `<h3 class="card-title mb-3">${character.name}</h3>`
    const name = `<p><strong>📛 Full Name</strong>: ${character.biography['full-name']}</p>`
    const gender = `<p><strong>🧬 Gender</strong>: ${character.appearance.gender}</p>`
    const stats = Object.keys(character.powerstats).map(stat => {
        return `<p><strong style="text-transform: capitalize">${statToEmoji[stat]} ${stat}</strong>: ${character.powerstats[stat]}</p>`
    }).join('')

    suggestionsDiv.innerHTML = ''
    heroCard.style.display = 'block'
    heroInfo.innerHTML = `${nameHero}${name}${gender}${stats}`
}

const statToEmoji = {
    intelligence: '🧠',
    strength: '💪🏻',
    speed: '⚡️',
    durability: '🏋🏻‍♀️',
    power: '📊',
    combat: '⚔️',

}

//handles
randomHeroButton.onclick = () => {
    const randomHeroIndex = Math.floor(Math.random() * maxIndexHero) + 1
    getSuperHero(randomHeroIndex)
}

clearButton.onclick = () => {
    searchInput.value = ''
    suggestionsDiv.innerHTML = ''
}

searchInput.onkeyup = async () => {
    const heros = await getSearchSuperHero(searchInput.value)

    if (heros.response === 'success') {
        const suggestionsItems = heros.results.map(item => {
            return `
        <div class="col">
            <div class="heroSuggestion card">
                <div class="row g-0">
                    <div class="col-md-4">
                        <img class="img-fluid rounded-start" src="${item.image.url}"/>
                    </div>
                    <div class="col-md-8">
                        <div class="card-body">
                            <h5 class="card-title">${item.biography['full-name']}</h5>
                            <a class="icon-link icon-link-hover" onclick="getSuperHero(${item.id})">
                            See more
                            <svg class="bi" aria-hidden="true"><use xlink:href="#arrow-right"></use></svg>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        `
        }).join('')

        suggestionsDiv.innerHTML = suggestionsItems
    }
}


