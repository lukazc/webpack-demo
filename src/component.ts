export default (text = TITLE_TEXT): HTMLElement => {
    console.log("drop_console test");
    // comment test
    const element = document.createElement("div");

    const worker = new Worker(
        new URL("./worker.ts", import.meta.url)
    );
    const state = { text };
    let lazyModule: any;

    worker.addEventListener("message", ({ data: { text } }) => {
        state.text = text;
        const workerTextElement = document.createElement("div");
        workerTextElement.textContent = text;
        element.appendChild(workerTextElement);
    });
    element.innerHTML = state.text;

    element.onclick = () => {
        worker.postMessage({ text: state.text });

        if(!lazyModule) {
            import("./lazy").then((lazy) => {
                lazyModule = lazy;
                const lazyElement = document.createElement("div");
                lazyElement.textContent = lazy.default;
                element.appendChild(lazyElement);
            }).catch((err) => { console.error(err); });
        }
    }
    return element;
};