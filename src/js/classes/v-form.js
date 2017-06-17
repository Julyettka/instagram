const VForm = (function() {
    class VForm {
        // el - елемент формы
        // fields - конфигурация инпутов формы
        // submitHandler - обработчик сабмита. Отработает только когда форма валидна
        constructor(el, fields, submitHandler) {
            this.element = el;
            this._fields = fields;
            this.submitHandler = submitHandler || (() => console.log("please, define handler for submit event"));

            this._setupFields();
            this._bindEvents();
        }

        // возвратит true, если все инпуты валидны
        // возвратит false, если хотя ббы один инпут инвалидный
        isValid() {
            let isValidField = (field) => field.isValid();
            return this.fields.every(isValidField);
        }

        // провести валидацию всех инпутов в форме
        validate() {
            this.fields.forEach((field) => field.validate());

            if (!this.isValid()) {
                this.setErrorState();
            } else {
                this.resetState();
            }
        }

        // установить форму в состояние  "загрузка"
        setLoadingState() {
            this.element.classList.add('is-loading');
            this.submitButton.setAttribute('disabled', true);
        }

        // установить форму в состояние "инвалидность"
        setErrorState() {
            this.element.classList.add('is-invalid');
            this.submitButton.setAttribute('disabled', true);
        }

        // обнулить состояние формы
        resetState() {
            this.element.classList.remove('is-invalid');
            this.element.classList.remove('is-loading');
            this.submitButton.removeAttribute('disabled');
        }

        getData() {
            let formData = {};
            this.fields.forEach(field => Object.assign(formData, field.getData()));

            return formData;
        }

        getField(fieldName) {
            return this.fields.filter((field) => field.el.getAttribute('name') === fieldName)[0];
        }

        // создание инстансов FormField и выборка кнопки submit
        _setupFields() {
            this.fields = this._fields.map(field => {
                return new FormField(field.input, field.validators);
            });

            this.submitButton = this.element.querySelector('button[type="submit"]');
        }

        // навешиваем слушатели событий
        _bindEvents() {
            this.element.addEventListener('submit', this._submitHandler.bind(this));

            let handler = this._updateState.bind(this);
            this.element.addEventListener('focusout', handler);
            this.element.addEventListener('focusin', handler);
        }

        // обработчик события сабмит
        _submitHandler(e) {
            e.preventDefault();
            // валидируем форму
            this.validate();

            // если форма валидна, то вызываем обработчик
            // если форма инвалидна, то переводим ее в состояние "инвалидности"
            if (this.isValid()) {
                this.submitHandler();
            } else {
                this.setErrorState();
            }
        }

        // обработчик событий фокусаут и фокусин
        _updateState(e) {
            if (e.target.tagName !== 'INPUT') return;
            if (this.isValid()) {
                this.resetState();
            } else {
                this.setErrorState();
            }
        }
    }

    return VForm;
})();