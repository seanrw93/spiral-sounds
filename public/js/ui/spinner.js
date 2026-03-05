export const createSpinner = (container) => {
    const spinner = document.createElement("div");
    spinner.className = "spinner";
    container.append(spinner);
    return spinner;
}

export const destroySpinner = (spinner) => {
    if (spinner && spinner.parentNode) {
        spinner.parentNode.removeChild(spinner);
    }
}