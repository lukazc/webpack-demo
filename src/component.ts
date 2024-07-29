export default (text = TITLE_TEXT): HTMLElement => {
    console.log("drop_console test");
    // comment test
    const element = document.createElement("div");
    element.innerHTML = text;
    element.onclick = () => {
        import("./lazy").then((lazy) => {
            element.textContent = lazy.default;
        }).catch((err) => { console.error(err); });
    }
    return element;
};