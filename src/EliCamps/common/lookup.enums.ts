import * as jspdf from 'jspdf';
import html2canvas from 'html2canvas';
import { Student } from '../EliCamps-Models/Elicamps';
export enum LookupEnum {
  CAMPS = 'tblCamps',
  INVOICE_TYPE = 'InvoiceType',
  FORMAT = 'Format',
  MEALPLAN = 'MealPlan',
  CHAPPROGRAM = 'ChapFamily',
  CONFIG = 'Config',
  STUDENT_STATUS='StudentStatus'
}
export enum Keys {
  TOKEN_INFO = 'TOKEN:INFO',
  USER_INFO = 'USER:INFO',
  REG_FEE = 'REG:FEE'
}
export const convertToPdf = (invoiceType: string, student: any) => {
  const data = document.getElementById('invoice');
  const buttons = document.getElementById('btns');
  buttons.className = 'action-panel no-print d-none';
  // headerHTML.className = 'container-fluid';
  const htmlWidth = document.getElementById('invoice').offsetWidth;
  const htmlHeight = document.getElementById('invoice').offsetHeight;
  const topLeftMargin = 15;
  const pdfWidth: any = htmlWidth + (topLeftMargin * 2);
  const pdfHeight: any = (pdfWidth * 1.2) + (topLeftMargin * 2);
  const canvasImageWidth = htmlWidth;
  const canvasImageHeight = htmlHeight;
  const totalPDFPages = Math.ceil(htmlHeight / pdfHeight) - 1;
  const that = this;
  html2canvas(data, { scale: 5 }).then((canvas, ) => {
    const context = canvas.getContext('2d');
    const imgData = canvas.toDataURL('image/jpeg', 1.0);
    const pdf = new jspdf('p', 'pt', [pdfWidth, pdfHeight - 150]);
    pdf.internal.scaleFactor = 1.55;
    pdf.addImage(imgData, 'image/jpeg', topLeftMargin, topLeftMargin, canvasImageWidth, canvasImageHeight);
    for (let i = 1; i <= totalPDFPages; i++) {
      pdf.addPage(pdfWidth, pdfHeight);
      pdf.addImage(imgData, 'image/jpeg', topLeftMargin, -(pdfHeight * i) + (topLeftMargin * 4), canvasImageWidth, canvasImageHeight);
      // pdf.setPage(i);
      // pdf.addImage(header, 80, 500);
    }
    pdf.save(`${invoiceType}${student.reg_Ref || student.groupRef}.pdf`); // Generated PDF;
    buttons.className = 'action-panel no-print';
  });
};

