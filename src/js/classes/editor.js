class Editor {
    constructor(rootElement, props) {
        //по дефолту определяется пропс, в случае если нам нужно что то изменить
        // передаем в assign пропс конфигурацию
        this.root = rootElement;
        this.props            = Object.assign({}, Editor.defaults, props);

        this.canvasContainer  = this.root.querySelector(this.props.canvasContainer);
        this.filtersContainer  = this.root.querySelector(this.props.filtersContainer);
        this.fileInput  = this.root.querySelector(this.props.fileInput);
        this.triggerReset  = this.root.querySelector(this.props.triggerReset);
        this.triggerUpload  = this.root.querySelector(this.props.triggerUpload);
        this.progressBar  = this.root.querySelector(this.props.progressBar);
        this.caption  = this.root.querySelector(this.props.caption);

        this.file             = null;
        this.filter           = null;
        this._processing      = false;

        this.resetFilter       = this.resetFilter.bind(this);
        this.save              = this.save.bind(this);
        this._onFileChange     = this._onFileChange.bind(this);
        this._onFilterClick    = this._onFilterClick.bind(this);
        this._onUploadProgress = this._onUploadProgress.bind(this);

        this._bindEvents();
    }

    applyFilter(filter) {
        if (!(filter in this.caman)) {
            console.log(`There is no filter with name "${filter}"`);
            return;
        }

        if (this.filter === filter || this._processing) {
            return;
        }

        this._processing = true;
        this._toggleBusyState();
        this.caman.revert();
        this.caman[filter]();
        this.caman.render(() => {
            this._processing = false;
            this._toggleBusyState();
            this.filter = filter;
            this._highlightActiveFilter();
        });
    }

    resetFilter() {
        if (!this.filter) return;
        this.filter = null;
        this.caman && this.caman.revert();
        this._highlightActiveFilter();
        this.triggerReset.style.display = 'none';
    }

    save() {
        const id          = generateID('post-');
        const user        = firebase.auth().currentUser;
        const dbPath      = `/posts/${id}`;
        const storagePath = `/pictures/${user.uid}/${id}.jpg`;
        const storageRef  = firebase.storage().ref(storagePath);
        const dbRef       = firebase.database().ref(dbPath);

        // show spinner and progress bar
        this._toggleBusyState();
        this._toggleUploadingState();

        // upload image to firebase as base64 encoded string
        const uploadTask = storageRef.putString(
            this.caman.toBase64('.jpg'),
            'data_url'
        );

        // show progress while uploading
        uploadTask.on('state_changed', this._onUploadProgress);

        uploadTask
        // create entry in firebase database after successfull upload
            .then(snapshot => {
                const { timeCreated, downloadURLs, fullPath } = snapshot.metadata;
                return dbRef.set({
                    id,
                    author: user.uid,
                    created: timeCreated,
                    url: downloadURLs[0],
                    filterName: this.filter,
                    storagePath: fullPath,
                    dimensions: {
                        width: this.caman.width,
                        height: this.caman.height
                    },
                    comments: this._getComments()
                });
            })
            // hide spinner and progress bar
            .then(() => {
                this._toggleBusyState();
                this._toggleUploadingState();
                this.props.onSave();
                page.redirect('/');
            })
            // handle error while uploading or entry creation
            .catch(error => {
                console.log(error);
                this.props.onError(error);
            });
    }

    // get caption and add it to the post as first comment
    _getComments() {
        const caption = this.caption.value.trim();

        if (!caption) return {};
        
        const { uid, displayName } = this.props.currentUser;
        const commentId = generateID('comment-');

        return {
            [commentId]: {
                id: commentId,
                value: caption,
                author: displayName,
                authorId: uid,
                created: moment().toJSON()
            }
        };
    }

    _highlightActiveFilter() {
        const { activeClass } = this.props;
        const prevActive = this.filtersContainer.querySelector('.is-active');
        const nextActive = this.filter
            ? this.filtersContainer.querySelector(`[data-filter="${this.filter}"]`)
            : null;
        prevActive && prevActive.classList.remove(activeClass);
        nextActive && nextActive.classList.add(activeClass);
        this.triggerReset.style.display = '';
    }


    _toggleBusyState() {
        const { busyClass } = this.props;
        const isBusy   = this.root.classList.contains(busyClass);
        const triggers = [this.triggerReset, this.triggerUpload];
        const method   = isBusy ? 'removeAttribute' : 'setAttribute';

        this.root.classList.toggle(busyClass);
        triggers.forEach(el => el[method]('disabled', true));
    }

    _toggleUploadingState() {
        this.root.classList.toggle(this.props.uploadingClass);
    }

    _onUploadProgress(snapshot) {
        const progress = snapshot.bytesTransferred / snapshot.totalBytes * 100;
        this.progressBar.style.width = progress + '%';
    }

    _onFileChange() {
        this.file = this.fileInput.files[0];
        this._initEditor();
    }

    _onFilterClick(e) {
        const target     = e.delegateTarget;
        const { filter } = target.dataset;
        if (!filter) return;
        this.applyFilter(filter);
    }

    _bindEvents() {
        this.triggerReset.addEventListener('click', this.resetFilter);
        this.triggerUpload.addEventListener('click', this.save);
        this.fileInput.addEventListener('change', this._onFileChange);
        delegate(
            this.filtersContainer,
            'click',
            '[data-filter]',
            this._onFilterClick
        );
    }

    _initEditor() {
        const { busyClass, hasImageClass, imageMaxSize } = this.props;
        const url    = URL.createObjectURL(this.file);
        const canvas = document.createElement('canvas');

        if (this.canvas) {
            this.canvas.parentNode.replaceChild(canvas, this.canvas);
        } else {
            this.canvasContainer.appendChild(canvas);
        }

        this.canvas = canvas;
        this._toggleBusyState();
        this.caman = Caman(this.canvas, url, (caman) => {
            const { originalWidth, originalHeight } = caman;
            const ratio  = originalWidth / originalHeight;
            const width  = originalWidth > imageMaxSize ? imageMaxSize : originalWidth;
            const height = Math.round(width / ratio);

            caman.resize({ width, height }).render();

            this._toggleBusyState();
            this.root.classList.add(hasImageClass);
        });
    }
}

Editor.defaults = {
    currentUser: {},
    activeClass: 'is-active',
    busyClass: 'is-busy',
    hasImageClass: 'has-image',
    uploadingClass: 'is-uploading',
    filtersContainer: '.editor__presets',
    canvasContainer: '.editor__canvas-container',
    triggerReset: '.editor__reset',
    triggerUpload: '.editor__upload',
    fileInput: 'input[type="file"]',
    progressBar: '.editor__progress .progress-bar',
    caption: '.editor__caption textarea',
    imageMaxSize: 1200,
    onSave: noop,
    onError: noop
};

Editor.FILTERS = [
    'vintage',
    'lomo',
    'clarity',
    'sinCity',
    'sunrise',
    'crossProcess',
    'orangePeel',
    'love',
    'grungy',
    'jarques',
    'pinhole',
    'oldBoot',
    'glowingSun',
    'hazyDays',
    'herMajesty',
    'nostalgia',
    'hemingway',
    'concentrate'
];
