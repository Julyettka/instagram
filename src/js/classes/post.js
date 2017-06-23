class Post {
    constructor(props) {
        this.getAuthor(props.author);
        let tmpl = Handlebars.partials.post({
        })
        
    }

    render(author){
        Handlebars.partials.post({
            author: author,
            created: created,
            url: url,
            name: name,
            comments: comments
        });
    }

    createDomElement(){
        this.element = document.createElement("article");
        this.element.classList = "post";
    }

    onDelete(){

    }

     onDeleteComment(){

    }

    onAddComment(){

    }

    getAuthor(id){
        firebase
        .database()
        .ref("users/${id}")
        .once("value", snapshot =>{
            console.log(snapshot.val());
            this.render(snapshot.val());
        })
    }

}

