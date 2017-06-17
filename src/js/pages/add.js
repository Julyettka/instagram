function add() {
    let currentUser = firebase.auth().currentUser;

    rootElement.innerHTML = templates.add({
        user: currentUser,
        filters: Editor.FILTERS
    });

    let editorRoot = rootElement.querySelector('#editor');

    new Editor(editorRoot);

}