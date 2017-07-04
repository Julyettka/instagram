function logout(){
    firebase.auth().signOut();
    page.redirect("/login");
    console.log("logout");
  }