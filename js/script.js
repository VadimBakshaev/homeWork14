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
    const popup = document.querySelector('.popup');

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

    checkboxEl.addEventListener('change', function () {
        if (this.checked) {
            removeError(this.parentElement);
        } else {
            showError(this.parentElement, 'Необходимо принять соглашение');
        };
    });

    function validator(corrector = 0) {
        const inputEl = document.querySelectorAll('.form-input');
        let valid = 0 - corrector;
        for (let i = 0; i < inputEl.length; i++) {
            // Проверка полей на пустое значение
            if (!inputEl[i].value) {
                inputEl[i].dispatchEvent(new Event('input'));
            } else {
                valid += 1;
            };
        };
        // Проверка активации чекбокса
        if (corrector === 0) {
            if (!checkboxEl.checked) {
                checkboxEl.dispatchEvent(new Event('change'));
            } else {
                valid += 1;
            };
        };
        if (valid === inputEl.length + 1) {
            return true;
        };
        return false;
    }

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
    };


    // 5. Обработка нажатия кнопки Sign Up    
    function onSignUp(e) {
        e.preventDefault();
        if (validator()) {
            let base = localStorage.getItem('base');
            const client = {};
            client.name = nameEl.value;
            client.user = userNameEl.value;
            client.password = passwordEl.value;
            if (base) {
                let baseArr = JSON.parse(base);
                baseArr.push(client);
                localStorage.setItem('base', JSON.stringify(baseArr));
            } else {
                let baseArr = [];
                baseArr.push(client);
                localStorage.setItem('base', JSON.stringify(baseArr));
            }
            document.querySelector('.form').reset();    // Очистка формы
            popup.classList.add('open');                // Открытие всплывающего окна
        };
    };
    formBtn.addEventListener('click', onSignUp);

    // 6. Переход на Log In   

    function onLogIn(e) {
        e.preventDefault();
        if (validator(1)) {
            const base = JSON.parse(localStorage.getItem('base'));
            for (let i = 0; i < base.length; i++) {
                if (base[i].user === userNameEl.value && base[i].password === passwordEl.value) {
                    console.log(1);
                } else {
                    console.log(0);
                }
            }

        }
    }
    // функция удаления и изменения элементов согласно ТЗ
    function transitionToLogIn() {
        document.querySelector('.main-form-title').textContent = 'Log in to the system';
        nameEl.parentElement.remove();
        emailEl.parentElement.remove();
        repPasswordEl.parentElement.remove();
        checkboxEl.parentElement.remove();
        questionLinkEl.textContent = 'Registration';
        formBtn.textContent = 'Sign In';

        // Замена обработчика клика на кнопке формы
        formBtn.removeEventListener('click', onSignUp);
        formBtn.addEventListener('click', onLogIn);
    };
    // Вешаем функцию как обработчик клика на попап и ссылку в форме
    questionLinkEl.onclick = transitionToLogIn;
    document.getElementsByClassName('popup-button')[0].onclick = () => {
        popup.classList.remove('open');
        transitionToLogIn();
    };
}
