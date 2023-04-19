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
          pdfContainer.innerHTML = '';
          pdfContainer.appendChild(canvas);
          const viewport = page.getViewport({ scale: 1.5 });
          canvas.width = 800; // establece el ancho del canvas en 800 píxeles
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




//////////////////////////////////////////////////////////////////////////////////
// Selecciona el elemento de entrada de archivo y el contenedor PDF
const fileInput = document.getElementById('fileInput');
const pdfContainer = document.getElementById('pdfContainer');

// Manejador de evento para cargar un archivo PDF
fileInput.addEventListener('change', function() {
  // Obtiene el archivo seleccionado
  const file = this.files[0];

  // Crea un nuevo objeto FileReader
  const reader = new FileReader();

  // Manejador de evento para cargar el PDF una vez que se haya leído el archivo
  reader.addEventListener('load', function() {
    // Carga el contenido del PDF utilizando PDF.js
    pdfjsLib.getDocument({ data: new Uint8Array(reader.result) }).promise.then(function(pdf) {
      // Muestra la primera página del PDF en el contenedor
      pdf.getPage(1).then(function(page) {
        const canvas = document.createElement('canvas');
        canvas.classList.add('centered'); // Agrega la clase 'centered' al canvas
        pdfContainer.appendChild(canvas);
        const viewport = page.getViewport({ scale: 1.5 });
        canvas.width = 900; // establece el ancho del canvas en 800 píxeles
        canvas.height = 600; // establece el alto del canvas en 600 píxeles
        page.render({ canvasContext: canvas.getContext('2d'), viewport: viewport });
      });
    });
  });

  // Lee el archivo como un array de bytes
  reader.readAsArrayBuffer(file);
});

/////////CON CONTADOR DE ARCHIVOS*********************************


// Selecciona el botón de carga y el contenedor PDF
const loadButton = document.getElementById('loadButton');
const pdfContainer = document.getElementById('pdfContainer');

// Establece la ruta de la carpeta que contiene los PDFs
const pdfPath = 'ruta/de/la/carpeta';

// Obtiene la lista de archivos en la carpeta de PDFs
let pdfFiles;
fetch(`${pdfPath}/?f=json`)
  .then(response => response.json())
  .then(data => pdfFiles = data.filter(file => file.name.endsWith('.pdf')))
  .catch(err => console.error(`No se pudo obtener la lista de archivos en la carpeta: ${err}`));

// Variable para llevar un seguimiento de si ya se cargaron todos los PDFs
let allPdfsLoaded = false;

// Manejador de evento para cargar el siguiente archivo PDF
loadButton.addEventListener('click', function() {
  // Si ya se cargaron todos los PDFs, no hacer nada
  if (allPdfsLoaded) return;

  // Si todavía hay PDFs que cargar, obtener el siguiente
  const nextPdf = pdfFiles.shift();

  // Si no hay más PDFs, actualizar el estado y mostrar el mensaje correspondiente
  if (!nextPdf) {
    allPdfsLoaded = true;
    loadButton.disabled = true;
    pdfContainer.textContent = 'No hay más archivos PDF en la carpeta';
    return;
  }

  // Crea un nuevo objeto FileReader
  const reader = new FileReader();

  // Manejador de evento para cargar el PDF una vez que se haya leído el archivo
  reader.addEventListener('load', function() {
    // Carga el contenido del PDF utilizando PDF.js
    pdfjsLib.getDocument({ data: new Uint8Array(reader.result) }).promise.then(function(pdf) {
      // Muestra la primera página del PDF en el contenedor
      pdf.getPage(1).then(function(page) {
        const canvas = document.createElement('canvas');
        pdfContainer.textContent = '';
        pdfContainer.appendChild(canvas);
        const viewport = page.getViewport({ scale: 1.5 });
        canvas.width = 800; // establece el ancho del canvas en 800 píxeles
        canvas.height = 600; // establece el alto del canvas en 600 píxeles
        page.render({ canvasContext: canvas.getContext('2d'), viewport: viewport });

      });
    });
  });

  // Lee el archivo como un array de bytes
  reader.readAsArrayBuffer(nextPdf);
});

///////////////HASTA ACA FUNCIONA

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


