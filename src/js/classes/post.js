class Post {
  constructor(post, props = {}) {
    this.tpl         = Handlebars.partials.post;
    this.currentUser = props.currentUser;
    this._onDataRetrieved = this._onDataRetrieved.bind(this);
    this.getDataAuthor(post.author);
    this._setupDomElement();
    this._setupDbRef(post);
    this._bindEvents();
  }


  render(author) {
    if (!this.data){
      this.element.innerHTML = "";
    }else{
      this.element.innerHTML = this.tpl(Object.assign({}, this.data, {
        author: this.author,
        currentUser: this.currentUser,
        liked: this.liked,
        likesCount: this.likesCount,
      }));
    }
  }


  getElement() {
    return this.element;
  }

  _setupDomElement() {
    this.element = document.createElement('article');
    this.element.classList = 'post';
  } // creates article in DOM with class post

  getDataAuthor(id) {
    firebase
      .database()
      .ref(`users/${id}`)
      .once('value', snapshot => {
        this.author = snapshot.val();
        this.render();
      });
  }

  _setupDbRef(post) {
    const id = typeof post === 'string' ? post : post.id;
    this.dbRef = firebase.database().ref(`posts/${id}`);
    this.dbRef.on('value', this._onDataRetrieved);
  }

   _onDataRetrieved(snapshot) {
    this.data = snapshot.val();
      if (this.data){
      this.liked = !!(this.data.likes && this.data.likes[this.currentUser.uid]);
      this.likesCount = !!(this.data.likes) ? Object.keys(this.data.likes).length : 0;
    }
    this.render();
    
  }

  onDelete() {
    let post = this.element.querySelector(".post");
    let postId = this.data.id;
    let ref = firebase.database().ref(`posts/${postId}`);
    console.log(ref);
    ref.remove();

    // post.remove();
    // перевірка чи id автора рівний id поточного юзера
    // якщо ні, то показувати повідомлення що тільки власник може видалити коммент
    // та блокувати подальше виконання коду
    // (потім це приховаємо в шаблоні)

    // показати повідомлення чи юзер дійсно хоче видалити

    // далі робота з БД, поки без неї(
      this._unbindLikeEvent();
  }

  onAddCommment(value) {
        let id = (generateID('comment-'));
        let { uid, displayName } = this.currentUser;
        var hashtag_RE = /(#)/;
        hashtag_RE.test(value);
        if (hashtag_RE.test(value) == true){
           var captionArray = value.split(" ");
            var captionWithTags = captionArray.map(function(hashtag){
                if (hashtag.charAt(0) == "#"){
                    hashtag = "<a href=/hashtags/" + hashtag.replace("#", "") +">" + hashtag + "</a>";
                }
                return hashtag;
                
            })
            value = captionWithTags.join(" ");

        }

        this.dbRef.child(`comments/${id}`).set({
            id,
            value,
            author: displayName,
            authorId: uid,
            created: moment().toJSON()
        }).catch(
            // повідомлення про помилку
        );
    }

  onRemoveComment(event) {
    let comment = this.element.querySelector(".comment"); //this.element потому что именно этого поста коммент
    let commentId = event.target.getAttribute("data-comment"); //retrieve comments unique code
    console.log(event.target);
      let ref = this.dbRef.child(`comments/${commentId}`);
      ref.remove();
    // перевірка чи є комент по такому id
    // тільки автор може видалити комент (можливо потім це заблокуємо в шаблоні)
    // запитати чи дійсно користувач хоче видалити коммент
    // this.dbRef.child(`comments/${id}`).remove().catch(/*повідомлення про помилку*/);
  }

  

  _bindEvents() {
    // тут будуть івенти на кнопки
    // івент лайка
    this._unbindLikeEvent = delegate(this.element, 'click', '.post__like', this.toggleLike.bind(this));
    this._onDataRetrieved = this._onDataRetrieved.bind(this);
    // івент видалення коментаря
    this.onRemoveComment = delegate(this.element, 'click', '.comment__delete', this.onRemoveComment.bind(this));

    // івент на видалення поста
    this.onDelete = delegate(this.element, "click", ".post__delete", this.onDelete.bind(this));
    // івент додавання коментаря
    delegate(this.element, "submit", ".post__add-comment", (e) => {
      e.preventDefault();
      this.onAddCommment(e.target.elements.comment.value);
    });
  }


  toggleLike() {
      // отримання лайка
      let userId = this.currentUser.uid;
      let ref = this.dbRef.child(`likes/${userId}`);
      if (this.liked) {
      // видалити лайк
      ref.remove();
      } else {
        // поставити лайк
      ref.set({
        // userName: this.currentUser.displayName, 
        userId: userId, 
        created: moment().toJSON(),
        });
      }
  }
}


