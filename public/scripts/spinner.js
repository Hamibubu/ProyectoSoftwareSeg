function runSpinner() {
    const spinner = document.getElementById('loading-spinner');
    spinner.style.display = 'block';
    setTimeout(() => {
        hideSpinner();
    }, 2000);
}

function hideSpinner() {
    const spinner = document.getElementById('loading-spinner');
    spinner.style.display = 'none';
}

module.exports = {runSpinner};