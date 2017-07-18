function hashtags(ctx) {
  let currentUser = ctx.user;
  rootElement.innerHTML = templates.main({
    user: currentUser
  });

  if (!ctx.user) {
    return;
  }

  let feed = document.querySelector('.feed');
  const dbRef = firebase.database().ref();

  console.log("this is hashtags!");
  let url = window.location.href;
  let arrUrl = url.split("/");
  let hashwordinUrl = arrUrl[arrUrl.length-1];
  console.log("The url is " + hashwordinUrl);

    dbRef
    .child('posts')
    .once('value', snapshot => {
      let posts = snapshot.val();
      let filteredPosts = [];
      // console.log(posts);
      posts = Object.keys(posts).map(k => posts[k]);
      // console.log(posts);

      for (let i = 0; i < posts.length; i++){
        let hashtagsArr = posts[i].hashtags;
        for (let j = 0; j < hashtagsArr.length; j++){
          // console.log(hashtagsArr[j].hashtag);
          if (hashwordinUrl === hashtagsArr[j].hashtag){
            console.log(hashtagsArr[j].hashtag);
            filteredPosts.push(posts[i]);
          }
        }
      }

      posts = filteredPosts;
      

      posts = posts.sort((a, b) => {
        return new Date(a.created) - new Date(b.created);
      });
      for (let i=0; i<posts.length; i++) {
        let post = new Post(posts[i], { currentUser: ctx.user });
        feed.insertBefore(post.getElement(), feed.firstElementChild);
      }
    });
}

    // dbRef.child("hashtags[i].hashtag")



