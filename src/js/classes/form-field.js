let FormField = (function(){

    const EMAIL_RE = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
     
    const messages = {
        email: "Please, put a valid email",
        required: "This field is required",
        password: "The password must be at least 6 characters",
        username: "Name should be at least 3 characters"
    };


    const validationRules = {
        email: function(s){ return EMAIL_RE.test(s) || messages.email},
        required: function(s){ return !!s.length || messages.required},   //(!! ne ne)-hack to make a function return boolean
        password: function(s){ return s.length >= 6 || messages.password},
        username: function(s){ return s.length >= 3 || messages.username}
    };

    //old syntax VS new syntax

    // let FormField = function(){
    //  FormField.prototype.validate = function(){}
    // }


    class FormField {
        constructor(el, validators){
            this.el = el;
            this.validators = validators;
            this.errors = [];
            this.errorEl = document.createElement("span");
            this._bindEvents(); 
            this._setupValidators();
        }

        isValid(){
            return this._validators.every((item)=>item(this.el.value) === true); //why _?
        }

        validate(){
            let isString = (v) => typeof v === "string";

            this.errors = this._validators
            .map((item) => item(this.el.value))
            .filter(isString);

             if (!!this.errors.length) {
                 this.setErrorState(this.errors);
             } else {
                 this.setValidState();
             }
                return this.errors;
        }

        resetState(){
            this.el.parentNode.classList.remove("has-success");
            this.el.parentNode.classList.remove("has-error");
            this.errorEl.remove();
        }

        setErrorState(errorList){
            this.resetState();
            this.el.parentNode.classList.add("has-error");
            this.errorEl.innerHTML = errorList.join("<br />");
            this.errorEl.classList.add("text-danger");
            this.el.parentNode.appendChild(this.errorEl);
            
        }

        setValidState(){
           this.resetState();
            this.el.parentNode.classList.add("has-success"); 
        }
        //?
        getData() {
            return {
                [this.el.getAttribute('name')]: this.el.value
            }
        }

        _bindEvents() { //what does it do? PRIBIBAET
            this.el.addEventListener('focusin', this.resetState.bind(this));
            this.el.addEventListener('focusout', this.validate.bind(this));
        }

        _setupValidators() { //Doesn't get why we need this f?
            this._validators = this.validators.map((validator) => {
                if (typeof validator === 'string' && validationRules[validator]) {
                    return validationRules[validator];
                } else if (typeof validator === 'function') {
                    return validator;
                }
            });
        }
    } 

    FormField.validationRules = validationRules;
    return FormField;
})();







     // emailInput.addEventListener('blur', validateEmail);
    // function validateEmail(){
    //     if(EMAIL_RE.test(this.value)) {
    //         this.parentElement.classList.remove("has-error");
    //         this.parentElement.classList.add("has-success");

    //         if(this.parentElement.querySelector(".text-danger")){
    //             this.parentElement.querySelector(".text-danger").remove();
    //         }

    //     }else{
    //         this.parentElement.classList.remove("has-success");
    //         this.parentElement.classList.add("has-error");
    //         if(!this.parentElement.querySelector(".text-danger")){
    //             let errorElement = document.createElement("span");
    //             errorElement.classList.add("text-danger");
    //             errorElement.innerText = "Email should be valid";
    //             this.parentElement.appendChild(errorElement);
    //         }
    //     }
        
    // }