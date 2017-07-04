(function() {

    const icons = {
        twitter     : 'fa fa-twitter',
        facebook    : 'fa fa-facebook',
        vkontakte   : 'fa fa-vk',
        website     : 'fa fa-globe',
        publicEmail : 'fa fa-envelope-o',
        phoneNumber : 'fa fa-phone'
    };

    const socialLinkTemplates = {
        twitter     : (param) => `https://twitter.com/${param}`,
        facebook    : (param) => `https://www.facebook.com/${param}`,
        vkontakte   : (param) => `https://vk.com/${param}`,
        website     : (param) => param,
    };

      /**
     * Sort collection of objects by given property name
     *
     * @param  {Array|Object} collection - Collection with objects
     * @param  {string} propName         - Property name by which collection should be sorted
     * @param  {boolean} invert          - Invert sorting direction.
     * @return {Array}                   - Sorted collection.
     */

    const sortBy = (collection = [], propName, invert) => {
      console.time('sort');
      const copy = Array.isArray(collection)
        ? collection.slice()
        : Object.keys(collection).map(k => collection[k]);
      const sorted = copy.sort((a, b) => {
        if (!(propName in a) || !(propName in b)) return -1;
        if (a[propName] === b[propName]) return 0;
        return a[propName] > b[propName] ? 1 : -1;
      });
      // strict equal with 'true' here is required
      // because Handlebars helper always will be invoked
      // with 'options' as last parameter, and when 'invert'
      // is omited then 'invert' === 'options'
      if (invert === true) sorted.reverse();
      console.timeEnd('sort');
      return sorted;
    };

    Handlebars.registerHelper('socialIconFor', (name) => {
        return icons[name] || '';
    });

    Handlebars.registerHelper('socialLinkFor', (name, value) => {
        const tpl = socialLinkTemplates[name];
        if (!tpl) return name;
        return tpl(value);
    });

    Handlebars.registerHelper('decamelize', (str) => {
        return str
            .split(/(?=[A-Z])/)
            .map(word => word[0].toUpperCase() + word.slice(1))
            .join(' ');
    });

    Handlebars.registerHelper('formatDate', (dateString) => {
        return moment(dateString).fromNow(true);
    });

    Handlebars.registerHelper('sortBy', sortBy);

    Handlebars.registerHelper('ifCond', (v1, operator, v2, options) => {
        switch (operator) {
            case '==':
                // eslint-disable-next-line eqeqeq
                return (v1 == v2) ? options.fn(this) : options.inverse(this);
            case '===':
                return (v1 === v2) ? options.fn(this) : options.inverse(this);
            case '!=':
                // eslint-disable-next-line eqeqeq
                return (v1 != v2) ? options.fn(this) : options.inverse(this);
            case '!==':
                return (v1 !== v2) ? options.fn(this) : options.inverse(this);
            case '<':
                return (v1 < v2) ? options.fn(this) : options.inverse(this);
            case '<=':
                return (v1 <= v2) ? options.fn(this) : options.inverse(this);
            case '>':
                return (v1 > v2) ? options.fn(this) : options.inverse(this);
            case '>=':
                return (v1 >= v2) ? options.fn(this) : options.inverse(this);
            case '&&':
                return (v1 && v2) ? options.fn(this) : options.inverse(this);
            case '||':
                return (v1 || v2) ? options.fn(this) : options.inverse(this);
            default:
                return options.inverse(this);
        }
    });



} ());
