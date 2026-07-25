import { marked } from 'marked';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

document.addEventListener("DOMContentLoaded", function () {
   var exportHtmlBtn = document.getElementById("export-to-html");
   var exportPdfBtn = document.getElementById("export-to-pdf");

   console.log('exportfile.js: DOM loaded, exportHtmlBtn:', !!exportHtmlBtn, 'exportPdfBtn:', !!exportPdfBtn);

   if (exportHtmlBtn) {
     exportHtmlBtn.addEventListener("click", function (e) {
       e.preventDefault();
       exportToHtml();
     });
   } else {
     console.error('exportfile.js: export-to-html button not found in DOM');
   }

   if (exportPdfBtn) {
     exportPdfBtn.addEventListener("click", function (e) {
       e.preventDefault();
       exportToPdf();
     });
   } else {
     console.error('exportfile.js: export-to-pdf button not found in DOM');
   }
});

function waitForTauriHost() {
   return new Promise(function(resolve) {
     console.log('exportfile.js: waitForTauriHost checking, tauriHost exists:', !!window.tauriHost, '_ready:', window.tauriHost?._ready);
     if (window.tauriHost && window.tauriHost._ready) {
       resolve(true);
       return;
     }

     var resolved = false;

     function doResolve() {
       if (!resolved) {
         resolved = true;
         resolve(true);
       }
     }

     function checkReady() {
       console.log('exportfile.js: tauriHostReady event received, _ready:', window.tauriHost?._ready);
       if (window.tauriHost && window.tauriHost._ready) {
         doResolve();
       }
     }

     window.addEventListener('tauriHostReady', checkReady);

     var attempts = 0;
     var poll = setInterval(function() {
       if (window.tauriHost && window.tauriHost._ready) {
         clearInterval(poll);
         doResolve();
       } else if (attempts++ > 100) {
         clearInterval(poll);
         console.error('exportfile.js: tauriHost not available after polling');
         resolve(false);
       }
     }, 100);
   });
}

async function exportToHtml() {
   console.log('exportfile.js: exportToHtml called');
   var markdown = extractMarkdownFromEditor();
   console.log('exportfile.js: extracted markdown length:', markdown?.length);
   if (!markdown) {
     alert("Could not extract markdown from editor");
     return;
   }

   try {
     var ready = await waitForTauriHost();
     console.log('exportfile.js: tauriHost ready:', ready);
     if (!ready || !window.tauriHost) {
       alert("Tauri host not available - cannot export");
       return;
     }

     console.log('exportfile.js: converting markdown to HTML');
     var html = marked.parse(markdown);
     console.log('exportfile.js: converted html length:', html?.length);
     console.log('exportfile.js: calling showExportHtmlDialog');
     var result = await window.tauriHost.showExportHtmlDialog(html, false);
     console.log('exportfile.js: export result:', result);
     if (result) {
       alert(result);
     } else {
       console.log('exportfile.js: export was cancelled or failed');
     }
   } catch (err) {
     console.error('exportfile.js: Export to HTML failed:', err);
     alert("Export to HTML failed: " + (err?.message || err));
   }
}

async function exportToPdf() {
   console.log('exportfile.js: exportToPdf called');
   var markdown = extractMarkdownFromEditor();
   if (!markdown) {
     alert("Could not extract markdown from editor");
     return;
   }

   try {
     var ready = await waitForTauriHost();
     if (!ready || !window.tauriHost) {
       alert("Tauri host not available - cannot export");
       return;
     }

     console.log('exportfile.js: converting markdown to HTML for PDF');
     var html = marked.parse(markdown);
     
     var tempDiv = document.createElement('div');
     tempDiv.innerHTML = '<style>body{font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;line-height:1.6;color:#333;}pre{background:#f5f5f5;padding:10px;border-radius:4px;overflow-x:auto;}code{font-family:"Courier New",Courier,monospace;background:#f5f5f5;padding:2px 4px;border-radius:3px;}h1,h2,h3,h4,h5,h6{margin:1em 0 0.5em 0;}p{margin:0.5em 0;}</style>' + html;
     tempDiv.style.position = 'fixed';
     tempDiv.style.top = '-9999px';
     tempDiv.style.width = '800px';
     tempDiv.style.padding = '20px';
     document.body.appendChild(tempDiv);
     
     var canvas = await html2canvas(tempDiv, { scale: 2 });
     document.body.removeChild(tempDiv);
     
     var imgData = canvas.toDataURL('image/png');
     
     var doc = new jsPDF('p', 'mm', 'a4');
     var imgWidth = 210;
     var pageHeight = 295;
     var imgHeight = canvas.height * imgWidth / canvas.width;
     var heightLeft = imgHeight;
     
     var position = 0;
     doc.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
     heightLeft -= pageHeight;
     
     while (heightLeft >= 0) {
       position = heightLeft - imgHeight;
       doc.addPage();
       doc.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
       heightLeft -= pageHeight;
     }
     
     var pdfData = doc.output('arraybuffer');
     
     console.log('exportfile.js: calling savePdfFile');
     var result = await window.tauriHost.savePdfFile(new Uint8Array(pdfData), 'document.pdf');
     if (result) {
       alert(result);
     } else {
       console.log('exportfile.js: PDF export was cancelled');
     }
   } catch (err) {
     console.error('exportfile.js: Export to PDF failed:', err);
     alert("Export to PDF failed: " + (err?.message || err));
   }
}

function extractMarkdownFromEditor() {
   var crepeInstance = window.crepeInstance;
   if (crepeInstance && typeof crepeInstance.getMarkdown === 'function') {
     return crepeInstance.getMarkdown();
   }
   return null;
}