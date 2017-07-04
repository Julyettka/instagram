function profileEdit(ctx){
	 let currentUser = ctx.user;
	 rootElement.innerHTML = templates["profile-edit"]({
	 	user: currentUser
	 });
	 console.log("this is profile-edit page");
}