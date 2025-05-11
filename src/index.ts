const form: HTMLFormElement | null = document.querySelector('.form');
const errorMessage = document.querySelector('.error');
const apiUrl = 'https://service.headless-render-api.com/pdf/';

if (errorMessage) {
    errorMessage.classList.add('hidden');
}

if (form) {
    form.addEventListener('submit', (event) => {
        event.preventDefault();
        const input: HTMLInputElement | null = document.querySelector('.form-input-url');

        if (input && errorMessage) {
            const url = input.value;
            input.value = '';

            if (!url.startsWith('http://') && !url.startsWith('https://')) {
                errorMessage.classList.remove('hidden');
            } else {
                fetch(apiUrl + url, {
                    headers: {
                        'X-Prerender-Token': API_KEY,
                    },
                })
                    .then((response) => response.blob())
                    .then((blob) => {
                        const tempUrl = URL.createObjectURL(blob);
                        const tempLink = document.createElement('a');
                        tempLink.href = tempUrl;
                        tempLink.download = 'web-site.pdf';
                        form.appendChild(tempLink);
                        tempLink.click();
                        tempLink.remove();
                        URL.revokeObjectURL(tempUrl);
                    });
            }
        }
    });
}
