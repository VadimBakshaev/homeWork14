// 1. Создаем обработчик события полной загрузки страницы
window.onload = () => {
    const nameEl = document.getElementsByName('fullName')[0];
    const userNameEl = document.getElementsByName('userName')[0];
    const checkboxEl = document.getElementById('checkAgreed');
    const emailEl = document.getElementsByName('eMail')[0];
    const passwordEl = document.getElementsByName('password')[0];
    const repPasswordEl = document.getElementsByName('repeatPassword')[0];
    const formBtn = document.querySelector('.form-button');
    const questionLinkEl = document.querySelector('.form-question-link');

    // 2. Запрещаем вводить все кроме букв и пробела в поле Full Name
    nameEl.addEventListener('input', function () {
        this.value = this.value.replace(/[^a-zа-яё\s]/gi, '');
        if (!this.value) {
            showError(this, 'Введите имя и фамилию');
        } else {
            removeError(this);
        };
    });
    // 3. Поле User Name может содержать только буквы, цифры, символ подчеркивания и тире
    userNameEl.addEventListener('input', function () {
        this.value = this.value.replace(/[^a-zа-яё\-_\d]/gi, '');
        if (!this.value) {
            showError(this, 'Введите имя пользователя');
        } else {
            removeError(this);
        };
    });
    // 4. Выводим сообщение в консоль об изменении состояния чекбокса
    emailEl.addEventListener('input', isEmailValid);
    function isEmailValid() {
        if (this.value &&
            this.value.match(/[a-zа-яё\d\-\._]+@[a-zа-яё\d\-\._]+\.[a-zа-я]{2,3}/gi)) {
            removeError(this);
            return;
        };
        showError(this, 'Введиет e-mail в формате email@mail.com');
    };

    passwordEl.addEventListener('input', function () {
        repPasswordEl.dispatchEvent(new Event('input'));
        if (this.value.length < 8) {
            showError(this, 'Пароль должен быть не менее 8 символов');
        } else if (!this.value.match(/[A-Z]/)) {
            removeError(this);
            showError(this, 'Должна быть хотя бы одна буква в верхнем регистре');
        } else if (!this.value.match(/[0-9]/)) {
            removeError(this);
            showError(this, 'Должна быть хотя бы одна цифра');
        } else if (!this.value.match(/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/)) {
            removeError(this);
            showError(this, 'Должен быть хотя бы один спецсимвол !@#$%^&* и т. д.');
        } else {
            removeError(this);
        };
    });

    repPasswordEl.addEventListener('input', function () {
        if (this.value === passwordEl.value) {
            removeError(this);
        } else {
            showError(this, 'Поторите пароль');
        };
    });

    function showError(el, text) {
        if (el.classList.contains('error')) return;
        el.classList.add('error');
        el.insertAdjacentHTML('afterend', `<p class="error-message">${text}</p>`);
    };
    function removeError(el) {
        if (el.classList.contains('error')) {
            el.nextElementSibling.remove();
            el.classList.remove('error');
        };
    }

    // 5. Обработка нажатия кнопки Sign Up
    const popup = document.querySelector('.popup');

    formBtn.onclick = (event) => {
        const inputEl = document.querySelectorAll('.form-input');
        for (let i = 0; i < inputEl.length; i++) {
            // Проверка полей на пустое значение
            if (!inputEl[i].value &&
                !(inputEl[i].name === 'password' || inputEl[i].name === 'repeatPassword')) {
                switch (inputEl[i].name) {
                    case 'fullName':
                        alert('Введите Имя и Фамилию');
                        break;
                    case 'userName':
                        alert('Введите Имя пользователя');
                        break;
                    case 'eMail':
                        alert('Введите E-mail');
                }
                event.preventDefault();
                return;
            };
            // Проверка поля ввода пароля
            if (inputEl[i].name === 'password') {
                if (inputEl[i].value.length < 8) {
                    alert('Длинна пароля должна быть не менее 8 символов');
                    event.preventDefault();
                    return;
                }
            };
            // Проверка подтверждения пароля
            if (inputEl[i].name === 'repeatPassword') {
                const passwordEl = document.getElementsByName('password')[0];
                if (passwordEl.value !== inputEl[i].value) {
                    alert('Подтвердите пароль');
                    event.preventDefault();
                    return;
                }
            };
        };
        // Проверка активации чекбокса
        if (!checkboxEl.checked) {
            alert('Примите соглашение');
            event.preventDefault();
            return;
        };
        event.preventDefault();                     // Отмена отправки формы
        document.querySelector('.form').reset();    // Очистка формы
        popup.classList.add('open');                // Открытие всплывающего окна
    };

    // 6. Переход на Log In   

    // функция удаления и изменения элементов согласно ТЗ
    function transitionToLogIn() {
        document.getElementsByClassName('main-form-title')[0].textContent = 'Log in to the system';
        nameEl.parentElement.remove();
        emailEl.parentElement.remove();
        repPasswordEl.parentElement.remove();
        checkboxEl.parentElement.remove();
        questionLinkEl.remove();
        formBtn.textContent = 'Sign In';

        // Замена обработчика клика на кнопке формы
        formBtn.onclick = (event) => {
            const inputEl = document.querySelectorAll('.form-input');
            for (let i = 0; i < inputEl.length; i++) {
                // Проверка полей на пустые значения
                if (!inputEl[i].value) {
                    switch (inputEl[i].name) {
                        case 'userName':
                            alert('Введите Имя пользователя');
                            break;
                        case 'password':
                            alert('Введите пароль');
                    }
                    event.preventDefault();
                    return;
                }
            };
            alert(`Добро пожаловать, ${inputEl[0].value}!`);
            event.preventDefault();
        }
    };
    // Вешаем функцию как обработчик клика на попап и ссылку в форме
    questionLinkEl.onclick = transitionToLogIn;
    document.getElementsByClassName('popup-button')[0].onclick = () => {
        popup.classList.remove('open');
        transitionToLogIn();
    };
}
