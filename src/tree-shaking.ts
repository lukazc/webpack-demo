const createDiv = (text: string): HTMLDivElement => {
    const div = document.createElement("div");
    div.textContent = text;
    return div;
};

const shake = (): HTMLDivElement => {
    return createDiv("This function is shaken, not stirred");
};

const bake = (): HTMLDivElement => {
    return createDiv("This function is included in the output bundle");
};

export { shake, bake };