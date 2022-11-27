const input = document.querySelector('.header__input');
const divNode = document.querySelector('.repositories');
const suggBox = document.querySelector(".autocom-box");
let suggList = [];
let reps;

onChange = debounce(onChange, 600);

input.addEventListener('input', () => {
    input.value == '' ? suggBox.classList.add('hidden') : suggBox.classList.remove('hidden');
});

input.addEventListener('input', onChange);
divNode.addEventListener('click', deleteRepository);
suggBox.addEventListener('click', createRepCard);

async function onChange() {
    try {
        reps = await getUsers(input.value);
        if (reps) suggList = saveSugg(reps.items);
    
        if (document.querySelector('.autocom-box__item')) suggBox.innerHTML = '';
    
        suggList.forEach((curr, index) => {
            showSuggestions(curr, index);
        })
    }
    catch (err) {
        renderError();
        console.log('to samoe', err);
    }
}

function renderError() {
    let code = `<li class="autocom-box__item autocom-box__error">
        <span class="error-rext">Не найдено :(</span>
        <img src="./img/error.png" alt="error" class="error-image" width="80px" height="80px">
    </li>`;
    suggBox.innerHTML = '';
    suggBox.insertAdjacentHTML('afterbegin', code);
}


function saveSugg(fullData) {
    let resArr = [];
    for (i = 0; i < 5; i++) {
        resArr.push(fullData[i]);
    }
    return resArr;
}

function createRepCard(event) {
    let id = event.target.id;
    if (id) renderRepository(suggList[id]);

    suggBox.innerHTML = '';
    input.value = '';
    suggBox.classList.add('hidden');
}

function showSuggestions(repository, id) {
    let code = `<li class="autocom-box__item" id="${id}">${repository.name}</li>`;
    suggBox.insertAdjacentHTML('afterbegin', code);
}

async function getUsers (request) {
    try {
        if (request == '') return;
        const response = await fetch(`https://api.github.com/search/repositories?q=${request}&sort=stars`);
        const repositories = await response.json();
        return repositories;
    }
    catch (err) {
        throw err;
    }
}

function renderRepository (repository) {
    let code = `
    <div class="rep">
                    <div class="rep__info">
                        <div class="rep__section">
                            <span class="rep__field">repository</span>
                            <span class="rep__name">${repository.name}</span>
                        </div>
                        <div class="rep__section">
                            <span class="rep__field">owner</span>
                            <span class="rep__owner">${repository.owner.login}</span>
                        </div>
                        <div class="rep__section">
                            <span class="rep__field">stars</span>
                            <span class="rep__stars">${repository.stargazers_count}</span>
                        </div>   

                    </div>
                    <div class="rep__buttons">
                        <a href="${repository.html_url}" class="rep__field rep__link">
                            <img class="rep__github" src="./img/Octocat.png" alt="github" width="60px" height="60px">
                        </a>
                        <button type="button" class="rep__button-delete" data-action="delete"></button>
                    </div>
                </div>
    `;
    divNode.insertAdjacentHTML('afterbegin', code);
}

function deleteRepository (event) {
    if (event.target.dataset.action !== 'delete') return;

    const parentNode = event.target.closest('.rep');
    parentNode.remove();
}

function debounce (fn, debounceTime) {
    let timer;
    return function (...args) {
        clearTimeout(timer);
        timer = setTimeout(() => {
            fn.apply(this, args);
        }, debounceTime);
    }
};