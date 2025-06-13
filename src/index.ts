const form: HTMLFormElement | null = document.querySelector('.form');
const errorMessage: HTMLDivElement | null = document.querySelector('.error');
const inputMessage: HTMLInputElement | null = document.querySelector('.form-input-url');
const inputButton: HTMLInputElement | null = document.querySelector('.form-button');
const apiUrl: string = 'https://api.pdfbolt.com/v1/direct';

if (form) {
  form.addEventListener('submit', (event) => {
    event.preventDefault();

    if (inputMessage && errorMessage && inputButton) {
      errorMessage.classList.add('hidden');

      const url = inputMessage.value;
      inputMessage.value = '';
      inputButton.disabled = true;

      if (!url.startsWith('http://') && !url.startsWith('https://')) {
        errorMessage.textContent = 'please paste correct url';
        errorMessage.classList.remove('hidden');
      } else {
        getPDFfromURL(url)
          .then((blob) => {
            errorMessage.classList.add('hidden');
            inputButton.disabled = false;

            const tempUrl = URL.createObjectURL(blob);
            const tempLink = document.createElement('a');
            
            tempLink.href = tempUrl;
            tempLink.download = 'web-site.pdf';
            
            form.appendChild(tempLink);
            tempLink.click();
            tempLink.remove();
            
            URL.revokeObjectURL(tempUrl);
            errorMessage.textContent = `Your PDF is ready.`;
            errorMessage.classList.remove('hidden');
          })
          .catch((error: string) => {
            inputButton.disabled = false;
            errorMessage.textContent = error;
            errorMessage.classList.remove('hidden');
          })
      }
    }
  });
}

function getPDFfromURL(url: string): Promise<Blob> {
  return fetch(apiUrl, {
    method: 'POST',
    headers: {
      API_KEY: API_KEY,
      'Content-type': 'application/json',
    },
    body: JSON.stringify({
      "url": url,
      "printBackground": true,
    }),
})
  .then((response) => {
    if (response.ok) {
      return response.blob();
    } else {
      throw new Error('The generated PDF size exceeds the maximum allowed size. Free plan limit: 2MB per PDF');
    }
  })
}
