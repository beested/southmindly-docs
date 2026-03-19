'use client';

export const meetingBackgroundSrc = '/proposta-background.svg';
export const southMindlyLogoSrc = '/logo-full.png';

export const meetingPrintStyles = `
  @media print {
    @page { margin: 0; size: A4 portrait; }

    html, body {
      width: 210mm !important;
      height: auto !important;
      margin: 0 !important;
      padding: 0 !important;
      overflow: visible !important;
      background: #05070B;
    }

    body > *:not(#meeting-print-root) {
      display: none !important;
    }

    #meeting-print-root {
      position: static !important;
      display: block !important;
      width: 210mm !important;
      margin: 0 !important;
      padding: 0 !important;
      overflow: visible !important;
      background: transparent !important;
    }

    #meeting-print-root .meeting-page {
      box-sizing: border-box !important;
      display: block !important;
      width: 210mm !important;
      height: 297mm !important;
      margin: 0 !important;
      padding: 40px !important;
      box-shadow: none !important;
      border-radius: 0 !important;
      max-width: none !important;
      overflow: hidden !important;
      break-inside: avoid;
      page-break-inside: avoid;
      page-break-after: always;
      break-after: page;
      background-color: #05070B !important;
      background-position: center center !important;
      background-repeat: no-repeat !important;
      background-size: cover !important;
      print-color-adjust: exact;
      -webkit-print-color-adjust: exact;
    }

    #meeting-print-root .meeting-page:last-child {
      page-break-after: auto;
      break-after: auto;
    }
  }
`;
