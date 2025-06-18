// Создаем обработчик события полной загрузки страницы
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
    const titleEl = document.querySelector('.main-form-title');

    // Запрещаем вводить все кроме букв и пробела в поле Full Name
    nameEl.addEventListener('input', function () {
        this.value = this.value.replace(/[^a-zа-яё\s]/gi, '');
        if (!this.value) {
            showError(this, 'Введите имя и фамилию');
        } else {
            removeError(this);
        };
    });

    // Поле User Name может содержать только буквы, цифры, символ подчеркивания и тире
    userNameEl.addEventListener('input', function () {
        this.value = this.value.replace(/[^a-zа-яё\-_\d]/gi, '');
        if (!this.value) {
            showError(this, 'Введите имя пользователя');
        } else {
            removeError(this);
        };
    });

    // Проверяем правильность ввода е-мейла
    emailEl.addEventListener('input', function () {
        if (this.value &&
            this.value.match(/[a-zа-яё\d\-\._]+@[a-zа-яё\d\-\._]+\.[a-zа-я]{2,3}/gi)) {
            removeError(this);
            return;
        };
        showError(this, 'Введите e-mail в формате email@mail.com');
    });

    // Проверяем правильность ввода пароля
    passwordEl.addEventListener('input', function () {
        // при изменении пароля, вызывам обработчик поля повторения пароля
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

    // Проверям соответствие полей пароля
    repPasswordEl.addEventListener('input', function () {
        if (this.value === passwordEl.value) {
            removeError(this);
        } else {
            showError(this, 'Поторите пароль');
        };
    });

    // Проверяем состояние чекбокса
    checkboxEl.addEventListener('change', function () {
        if (this.checked) {
            removeError(this.parentElement);
        } else {
            showError(this.parentElement, 'Необходимо принять соглашение');
        };
    });

    // Функция валидатор, так как на второй странице нет чекбокса, 
    // ввел корректор для универсальности
    function validator(corrector = 0) {
        const inputEl = document.querySelectorAll('.form-input');
        let valid = 0 + corrector;
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

    // Функция показывает сообщение об ошибке
    function showError(el, text) {
        if (el.classList.contains('error')) return;
        el.classList.add('error');
        el.insertAdjacentHTML('afterend', `<p class="error-message">${text}</p>`);
    };
    // Функция убирает сообщение об ошибке
    function removeError(el) {
        if (el.classList.contains('error')) {
            el.nextElementSibling.remove();
            el.classList.remove('error');
        };
    };

    // Обработка нажатия кнопки Sign Up (Регистрация)   
    function onSignUp(e) {
        // Форму мы никуда не отправляем
        e.preventDefault();
        // Если все поля заполнены
        if (validator()) {
            // получаем данные из хранилица
            const base = localStorage.getItem('base');
            // создаем объект с данными пользователя
            const client = {
                name : nameEl.value,
                user : userNameEl.value,
                password : passwordEl.value
            };    
            // добавляем пользователя в базу        
            if (base) {
                let baseArr = JSON.parse(base);
                baseArr.push(client);
                localStorage.setItem('base', JSON.stringify(baseArr));
            } else {
                let baseArr = [];
                baseArr.push(client);
                localStorage.setItem('base', JSON.stringify(baseArr));
            }
            // очищаем форму
            document.querySelector('.form').reset();    
            popup.classList.add('open');            
        };
    };
    // Вешаем обработчик на кнопку регистрации
    formBtn.addEventListener('click', onSignUp);

    // Переход на Sign In(Log In)   

    // Обработка нажатия кнопки Sign In (Вход)
    function onLogIn(e) {
        // Форму мы не отправляем
        e.preventDefault();
        // Если поля заполнены
        if (validator(1)) {
            // получаем данные
            const base = JSON.parse(localStorage.getItem('base'));
            let flag = true;
            // сверяем данные из полей с базой
            for (let i = 0; i < base.length; i++) {
                if (base[i].user === userNameEl.value) {
                    removeError(userNameEl);
                    flag = false;
                    if (base[i].password === passwordEl.value) {
                        removeError(passwordEl);
                        // если все данные введены правильно, переход в "ЛК"
                        transitionToPersonalAccount(base[i]);
                    } else {
                        showError(passwordEl, 'Неверный пароль');
                    };
                };
            };
            // если пользователь не найден
            if (flag) {
                showError(userNameEl, `Пользователь ${userNameEl.value} не зарегистрирован`);
            };
        };
    };

    // функция "перехода" на страницу Log In
    function transitionToLogIn() {
        titleEl.textContent = 'Log in to the system';
        nameEl.parentElement.remove();
        emailEl.parentElement.remove();
        repPasswordEl.parentElement.remove();
        checkboxEl.parentElement.remove();
        questionLinkEl.textContent = 'Registration';
        formBtn.textContent = 'Sign In';

        // Замена обработчков
        formBtn.removeEventListener('click', onSignUp);
        formBtn.addEventListener('click', onLogIn);
        questionLinkEl.removeEventListener('click', transitionToLogIn);
        questionLinkEl.addEventListener('click', onReload);

    };

    // Функция "перехода" в личный кабинет
    function transitionToPersonalAccount(user) {
        titleEl.textContent = `Welcome, ${user.name}!`;
        formBtn.removeEventListener('click', onLogIn);
        formBtn.addEventListener('click', onReload);
        formBtn.textContent = 'Exit';
        userNameEl.parentElement.remove();
        passwordEl.parentElement.remove();
        questionLinkEl.remove();
        document.querySelector('.main-form-text').remove();
    };

    // Функция перезагрузки страницы
    function onReload() {
        // Здесь начались "Чудеса". Почему-то location.reload() срабатывает по клику на ссылке
        // но на кнопке Exit не работает. Все что меняется - это контекст, и даже после того
        // как я сделал одинаковый контекст window, все равно, поведение осталось, я не понял почему так((
        console.log('exit');  
        // Пришлось изобретать "костыль":      
        fetch(window.location.href).then(() => location.reload());

        // Оставил варианты, что пробовал (на будущее)
        //window.location.href = window.location.href + '?' + Date.now();
        //window.location.replace(window.location.href);        
        //location.reload();
        // history.go(0);
        // window.location.href = window.location.href;
    };    

    // Вешаем обработчик на клик по ссылке "Already have an account"
    questionLinkEl.addEventListener('click', transitionToLogIn);
    // Вешаем обработчик на кнопку ОК в модалке
    document.querySelector('.popup-button').addEventListener('click', () => {
        popup.classList.remove('open');
        transitionToLogIn();
    });
}
