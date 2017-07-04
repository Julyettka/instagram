function add(ctx) {
    let currentUser = ctx.user;
    rootElement.innerHTML = templates.add({
        user: currentUser,
        filters: Editor.FILTERS
    });

    let editorRoot = rootElement.querySelector('#editor');
    new Editor(editorRoot, {currentUser});

}