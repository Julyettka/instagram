function index(ctx, next) {
  let currentUser = firebase.auth().currentUser;
  
  rootElement.innerHTML = templates.main({
    user: currentUser
  });
}