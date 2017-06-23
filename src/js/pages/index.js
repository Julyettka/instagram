function index(ctx, next) {
  let currentUser = firebase.auth().currentUser;
  rootElement.innerHTML = templates.main({
    user: currentUser
  });

  const dbRef = firebase.database().ref();
  dbRef.child("post").once("value", snapshot => {
  	let posts = snapshot.val();
  	for (key in posts){
  		console.log(new Post(post[key]));
  		feed.innerHTML = post;
  	}
  });
}