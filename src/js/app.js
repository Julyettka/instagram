(function(){
//=require 'lib/*'
//=require 'classes/*'
//=require 'pages/*'


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
  firebase.auth();

  page('/', index);
  page('/signup', signup);
  page('/login', login);
  page("/logout", logout);
  page("/add", add);
  page('*', notfound);
  

  firebase.auth().onAuthStateChanged(function(){
    page();
  });

}) ();









