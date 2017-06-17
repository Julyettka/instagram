/**
 * Attach a handler to an event for all elements matching a selector.
 *
 * @param  {Element} target    - Element which the event must bubble to
 * @param  {string} selector   - Selector to match
 * @param  {string} type       - Event name
 * @param  {Function} handler  - Function called when the event bubbles to target
 *                               from an element matching selector
 * @param  {boolean} [capture] - Capture the event
 * @return {Function}          - Function for removing listener
 */
const delegate = (target, type, selector, handler, capture) => {
    const dispatchEvent = (event) => {
        // console.time('delegate');
        let targetElement = event.target;

        while (targetElement && targetElement !== target ) {
            if (targetElement.matches(selector)) {
                event.delegateTarget = event.delegateTarget || targetElement;
                handler.call(targetElement, event);
                break;
            }
            targetElement = targetElement.parentNode;
        }
        // console.timeEnd('delegate');
    };

    target.addEventListener(type, dispatchEvent, !!capture);

    return () => target.removeEventListener(type, dispatchEvent, !!capture);
};


/**
 * Empty function
 */
const noop = () => {};

/**
 * Generate unique ID
 *
 * @param  {String} prefix - Prefix for ID
 * @param  {Number} len    - Lenght of ID string
 * @return {String}        - ID
 */
const generateID = (prefix = '', len = 6) =>
prefix + Math.random().toString(36).slice(2, len + 2);
