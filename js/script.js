// 1. Создаем обработчик события полной загрузки страницы
window.onload = () => {
    // 2. Запрещаем вводить все кроме букв и пробела в поле Full Name
    document.getElementsByName('fullName')[0].addEventListener('input', function () {
        this.value = this.value.replace(/[^a-zа-яё\s]/gi, '');
    });
    // 3. Поле User Name может содержать только буквы, цифры, символ подчеркивания и тире
    document.getElementsByName('userName')[0].addEventListener('input', function () {
        this.value = this.value.replace(/[^a-zа-яё\-_\d]/gi, '');
    });
    // 4. Выводим сообщение в консоль об изменении состояния чекбокса
    const checkboxEl = document.getElementById('checkAgreed');
    checkboxEl.onchange = function () {
        if (this.checked) {
            console.log('Согласен');
        } else {
            console.log('Не согласен');
        };
    };

    // 5. Обработка нажатия кнопки Sign Up
    const popup = document.querySelector('.popup');
    document.querySelector('.form-button').onclick = (event) => {
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
        document.getElementsByName('fullName')[0].parentElement.remove();
        document.getElementsByName('eMail')[0].parentElement.remove();
        document.getElementsByName('repeatPassword')[0].parentElement.remove();
        checkboxEl.parentElement.remove();
        document.getElementsByClassName('form-question-link')[0].remove();
        document.getElementsByClassName('form-button')[0].textContent = 'Sign In';

        // Замена обработчика клика на кнопке формы
        document.getElementsByClassName('form-button')[0].onclick = (event) => {
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
    document.getElementsByClassName('form-question-link')[0].onclick = transitionToLogIn;
    document.getElementsByClassName('popup-button')[0].onclick = () => {
        popup.classList.remove('open');
        transitionToLogIn();
    };
}
