// A file can have only one component exported by default

export default 'Working with modules';

export function select(selector, scope = document) {
    return scope.querySelector(selector);
} 

export function listen(event, selector, callback) {
    return selector.addEventListener(event, callback);
}

export function selectAll(selector, scope = document) {
    return [...scope.querySelectorAll(selector)];
}

