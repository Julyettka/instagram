function auth(ctx, next) {
  let user = firebase.auth().currentUser;

  if (!user) {
    next();
    return;
  }

  firebase.database().ref('users/' + user.uid)
    .once('value', (snapshot) => {
      ctx.user = snapshot.val();
      ctx.user.uid = user.uid;
      next();
    });


}
