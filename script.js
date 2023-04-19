const openPdfBtn = document.getElementById('openPdfBtn');
const pdfContainer = document.getElementById('pdfContainer');

let pdfFiles = [];
let currentPdfIndex = 0;

// Obtener archivos PDF de la carpeta
function getPDFFiles() {
  const folderPath = './bills-pdf';
  fetch(folderPath)
    .then(response => response.text())
    .then(data => {
      const parser = new DOMParser();
      const html = parser.parseFromString(data, 'text/html');
      const fileLinks = html.querySelectorAll('a[href$=".pdf"]');

      pdfFiles = [...fileLinks].map(link => link.href);
      if (pdfFiles.length > 0) {
        openPdfBtn.disabled = false;
      } else {
        openPdfBtn.textContent = 'No hay más archivos PDF';
      }
    })
    .catch(error => console.error(error));
}

// Función para abrir un PDF
function openPDF(filePath) {
  const xhr = new XMLHttpRequest();
  xhr.open('GET', filePath, true);
  xhr.responseType = 'blob';

  xhr.onload = function() {
    if (this.status === 200) {
      const blob = new Blob([this.response], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);

      // Carga el contenido del PDF utilizando PDF.js
      pdfjsLib.getDocument({ url }).promise.then(function(pdf) {
        // Muestra la primera página del PDF en el contenedor
        pdf.getPage(1).then(function(page) {
          const canvas = document.createElement('canvas');
          canvas.classList.add('centered'); // Agrega la clase 'centered' al canvas
          pdfContainer.innerHTML = '';
          pdfContainer.appendChild(canvas);
          const viewport = page.getViewport({ scale: 1.5 });
          canvas.width = 900; // establece el ancho del canvas en 800 píxeles
          canvas.height = 600; // establece el alto del canvas en 600 píxeles
          page.render({ canvasContext: canvas.getContext('2d'), viewport: viewport });
        });
      });
    }
  };

  xhr.send();
}

// Obtener archivos PDF y habilitar el botón si hay archivos
getPDFFiles();

// Manejador de evento para abrir el siguiente PDF
openPdfBtn.addEventListener('click', function() {
  if (currentPdfIndex < pdfFiles.length) {
    const filePath = pdfFiles[currentPdfIndex];
    openPDF(filePath);
    currentPdfIndex++;
  }
});


