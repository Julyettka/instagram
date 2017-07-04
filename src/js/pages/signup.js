function signup(ctx) {
  let currentUser = ctx.user;
    
    if (currentUser) {
      page.redirect('/');
    }

    rootElement.innerHTML = templates.signup();

    let form = rootElement.querySelector('#signup-form'); //not getById because we use rootElement
      
      let signupForm = new VForm(form, [
      {
          input: form.elements.email,
          validators: [
              'required',
              'email'
          ]
      },
      { 
        input: form.elements.username,
        validators: [
          "username"
        ]

      },
      { 
        input: form.elements.displayName,
        validators: [
          "required"
        ]

      },
      {
          input: form.elements.password,
          validators: [
              'required',
              'password'
          ]
      },
      {
          input: form.elements.password_confirm,
          validators: [
              'required',
              (s) => s === form.elements.password.value || "Passwords should match"
          ]
      }
  ], submitHandler);


  function submitHandler() {
      let formData = signupForm.getData();
      signupForm.setLoadingState();

      firebase.auth()
          .createUserWithEmailAndPassword(formData.email, formData.password)
          .then(successHandler, errorHandler);

      function successHandler(user) {
          signupForm.resetState();
          user.updateProfile({
            displayName: formData.username
          });
          firebase.database().ref("users/" + user.uid).set({
            email: formData.email,
            displayName: formData.displayName,
            username: formData.displayName
          });
          page.redirect("/");
      }

      function errorHandler(error) {
          signupForm.setErrorState();
          signupForm.getField('email').setErrorState([error.message]);
      }

  }
    

}











// let emailInput = form.elements.email;
//     let passwordInput = form.elements.password;
//     let passwordConfirmInput = form.elements.password_confirm;

        
//     let emailFormField = new FormField(emailInput, [
//     FormField.validationRules.email, 
//     FormField.validationRules.required]); 

//     let passwordFormField = new FormField(passwordInput, [
//         FormField.validationRules.required, 
//         FormField.validationRules.password]);

//     let passwordConfirmFormField = new FormField(passwordConfirmInput, [
//         FormField.validationRules.required, 
//         (s)=> s === passwordInput.value|| "Passwords should match"]);

//     let formFields = [emailFormField, passwordFormField, passwordConfirmFormField];
    

//     form.addEventListener('submit', (event) => {
//     event.preventDefault();

//     let isValidFormField = (formField) => formField.isValid();

//     if (formFields.every(isValidFormField)) {
//       createNewUser(emailInput.value, passwordInput.value);
//     } else {
//       console.log('sadf');
//     }
//   });

//   function createNewUser(email, password) {
//     firebase.auth()
//       .createUserWithEmailAndPassword(email, password)
//       .then(successHandler, errorHandler);

//     function successHandler(response) {
//       console.log(response);
//     }

//     function errorHandler(error) {
//       emailFormField.setErrorState([error.message]);
//     }
//   }
  