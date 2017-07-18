function index(ctx, next) {
  rootElement.innerHTML = templates.main({
    user: ctx.user
  });

  if (!ctx.user) {
    return;
  }

  let feed = document.querySelector('.feed');
  const dbRef = firebase.database().ref();
 

    dbRef
    .child('posts')
    .once('value', snapshot => {
      let posts = snapshot.val();
      posts = Object.keys(posts).map(k => posts[k]);
      posts = posts.sort((a, b) => {
        return new Date(a.created) - new Date(b.created);
      });

      for (let i=0; i<posts.length; i++) {
        let post = new Post(posts[i], { currentUser: ctx.user });
        feed.insertBefore(post.getElement(), feed.firstElementChild);
      }
    });
}



