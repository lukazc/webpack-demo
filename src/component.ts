export default (text = "Hello world"): HTMLElement => {
    const element = document.createElement("div");
    element.innerHTML = text;
    return element;
};