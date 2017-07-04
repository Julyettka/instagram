function profile(ctx){
	 let currentUser = ctx.user;
	 rootElement.innerHTML = templates.profile({
    	user: currentUser
  	});
	 console.log("this is profile page");
}