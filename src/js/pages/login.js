function login(ctx) {
  let currentUser = ctx.user;
  if (currentUser) {
    page.redirect('/');
  }
  rootElement.innerHTML = templates.login();
  let form = rootElement.querySelector('#login-form');

  let loginForm = new VForm(form, [
      {
          input: form.elements.email,
          validators: [
              'required',
              'email'
          ]
      },
      {
          input: form.elements.password,
          validators: [
              'required',
              'password'
          ]
      }
    ], submitHandler);

  function submitHandler() {
      let formData = loginForm.getData();
      loginForm.setLoadingState();

      firebase.auth()
          .signInWithEmailAndPassword(formData.email, formData.password)
          .then(successHandler, errorHandler);
          
     }

     function successHandler(user) {
          loginForm.resetState();
          page.redirect("/");
      }

      function errorHandler(error) {
          loginForm.setErrorState();
          loginForm.getField('email').setErrorState([error.message]);
      }

}
