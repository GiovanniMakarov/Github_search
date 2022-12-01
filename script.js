const input = document.querySelector('.header__input');
const addedRepositories = document.querySelector('.repositories');
const suggestionBox = document.querySelector(".autocom-box");
let suggestionList = [];
let data;

onChange = debounce(onChange, 600);

input.addEventListener('input', () => {
    input.value == '' ? suggestionBox.classList.add('hidden') : suggestionBox.classList.remove('hidden');
});

input.addEventListener('input', onChange);
addedRepositories.addEventListener('click', deleteRepository);
suggestionBox.addEventListener('click', createRepCard);

async function onChange() {
    try {
        data = await getUsers(input.value);
        if (data) {
            suggestionList = saveSuggestion(data.items);
        }
    
        if (document.querySelector('.autocom-box__item')) {
            suggestionBox.textContent = '';
        }
    
        suggestionList.forEach((curr, index) => {
            showSuggestions(curr, index);
        })
    }
    catch (err) {
        renderError();
    }
}

function renderError() {
    let code = `<li class="autocom-box__item autocom-box__error">
        <span class="error-rext">Не найдено :(</span>
        <img src="./img/error.png" alt="error" class="error-image" width="80px" height="80px">
    </li>`;
    suggestionBox.textContent = '';
    suggestionBox.insertAdjacentHTML('afterbegin', code);
}


function saveSuggestion(fullData) {
    let resArr = [];
    // Использую императивный for чтобы записать только 5 объектов из ответа сервера
    for (i = 0; i < 5; i++) {
        resArr.push(fullData[i]);
    }
    return resArr;
}

function createRepCard(event) {
    let id = event.target.id;
    if (id) {
        renderRepository(suggestionList[id]);
    };

    suggestionBox.textContent = '';
    input.value = '';
    suggestionBox.classList.add('hidden');
}

function showSuggestions(repository, id) {
    let code = `<li class="autocom-box__item" id="${id}">${repository.name}</li>`;
    suggestionBox.insertAdjacentHTML('afterbegin', code);
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
    addedRepositories.insertAdjacentHTML('afterbegin', code);
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
