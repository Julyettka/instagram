(function(){
//=require 'lib/*'
//=require 'classes/*'
//=require 'pages/*'
//=require 'moment/moment.js'


document.getElementById('root').innerHTML = templates['main']();

  const rootElement = document.getElementById("root");

  const firebaseConfig = {
    apiKey: "AIzaSyBZpLoWmLxrvB5Bq-yuSlXBvXQeHuiYH1U",
    authDomain: "insta-911e0.firebaseapp.com",
    databaseURL: "https://insta-911e0.firebaseio.com",
    projectId: "insta-911e0",
    storageBucket: "insta-911e0.appspot.com",
    messagingSenderId: "856827070647"
  };
  firebase.initializeApp(firebaseConfig);
  // firebase.auth();
  page("*", auth);
  page('/', index);
  page("/hashbang", hashtags); //don't know how to route it properly
  page('/signup', signup);
  page('/login', login);
  page("/logout", logout);
  page("/add", add);
  page("/profile", profile);
  page("/profile/edit", profileEdit);
  page('*', notfound);
  
  

  firebase.auth().onAuthStateChanged(function(){
    page();
  });

}) ();



