import * as jspdf from "jspdf";
import html2canvas from "html2canvas";
import { Student } from "../EliCamps-Models/Elicamps";
import * as rasterizeHTML from "rasterizeHTML";
import * as fileSaver from "file-saver";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import * as JSZip from "jszip";
import { base64String } from "./certificateBase64";
pdfMake.vfs = pdfFonts.pdfMake.vfs;
export enum LookupEnum {
  CAMPS = "tblCamps",
  INVOICE_TYPE = "InvoiceType",
  FORMAT = "Format",
  MEALPLAN = "MealPlan",
  CHAPPROGRAM = "ChapFamily",
  CONFIG = "Config",
  STUDENT_STATUS = "StudentStatus",
}
export enum Keys {
  TOKEN_INFO = "TOKEN:INFO",
  USER_INFO = "USER:INFO",
  REG_FEE = "REG:FEE",
}
export const convertToPdf = (invoiceType: string, student: any) => {
  const data = document.getElementById("invoice");
  const buttons = document.getElementById("btns");
  buttons.className = "action-panel no-print d-none";
  // headerHTML.className = 'container-fluid';
  const htmlWidth = document.getElementById("invoice").offsetWidth;
  const htmlHeight = document.getElementById("invoice").offsetHeight;
  const topLeftMargin = 15;
  const pdfWidth: any = htmlWidth + topLeftMargin * 2;
  const pdfHeight: any = pdfWidth * 1.2 + topLeftMargin * 2;
  const canvasImageWidth = htmlWidth;
  const canvasImageHeight = htmlHeight;
  const totalPDFPages = Math.ceil(htmlHeight / pdfHeight) - 1;
  const that = this;
  html2canvas(data, { scale: 5 }).then((canvas) => {
    const context = canvas.getContext("2d");
    const imgData = canvas.toDataURL("image/jpeg", 1.0);
    const pdf = new jspdf("p", "pt", [pdfWidth, pdfHeight - 150]);
    pdf.internal.scaleFactor = 1.55;
    pdf.addImage(
      imgData,
      "image/jpeg",
      topLeftMargin,
      topLeftMargin,
      canvasImageWidth,
      canvasImageHeight
    );
    for (let i = 1; i <= totalPDFPages; i++) {
      pdf.addPage(pdfWidth, pdfHeight);
      pdf.addImage(
        imgData,
        "image/jpeg",
        topLeftMargin,
        -(pdfHeight * i) + topLeftMargin * 4,
        canvasImageWidth,
        canvasImageHeight
      );
      // pdf.setPage(i);
      // pdf.addImage(header, 80, 500);
    }
    pdf.save(`${invoiceType}${student.reg_Ref || student.groupRef}.pdf`); // Generated PDF;
    buttons.className = "action-panel no-print";
  });
};
export const downloadPDF = (name: string) => {
  const data = document.getElementById(name);
  // headerHTML.className = 'container-fluid';
  const htmlWidth = document.getElementById(name).offsetWidth;
  const htmlHeight = document.getElementById(name).offsetHeight;
  const topLeftMargin = 15;
  const pdfWidth: any = htmlWidth + topLeftMargin * 2;
  const pdfHeight: any = pdfWidth * 1.2 + topLeftMargin * 2;
  const canvasImageWidth = htmlWidth;
  const canvasImageHeight = htmlHeight;
  const totalPDFPages = Math.ceil(htmlHeight / pdfHeight) - 1;
  const that = this;
  // var canvas = document.getElementById(name);
  // rasterizeHTML.drawHTML(canvas.innerHTML , null).then((value) => {

  // })
  // html2canvas(data, { scale: 5 }).then((canvas, ) => {
  //   const context = canvas.getContext('2d');
  //   const imgData = canvas.toDataURL('image/jpeg', 1.0);
  //   const pdf: jspdf = new jspdf('p', 'pt', [pdfWidth, pdfHeight - 150]);
  //   pdf.internal.scaleFactor = 1.55;
  //   pdf.addHTML(canvas, 'image/jpeg', topLeftMargin, topLeftMargin, canvasImageWidth, canvasImageHeight);
  //   for (let i = 1; i <= totalPDFPages; i++) {
  //     pdf.addPage(pdfWidth, pdfHeight);
  //     pdf.addHTML(canvas, 'image/jpeg', topLeftMargin, -(pdfHeight * i) + (topLeftMargin * 4), canvasImageWidth, canvasImageHeight);
  //     // pdf.setPage(i);
  //     // pdf.addImage(header, 80, 500);
  //   }

  //   pdf.save(`RoomCheckInReport.pdf`); // Generated PDF;
  // });
  // getPDF(data)
};
export function generatePDF(
  action = "open",
  studentList,
  startDate,
  endDate,
  sort,
  campus
) {
  let columns = [
    "Room Space",
    "Room Type",
    "Name",
    "Group Ref",
    "Arrival Date",
    "Departure Date",
    "Number of Nights",
  ];
  const mappedStudents = studentList.map((p) => [
    p.roomID || "",
    p.roomType || "",
    `${p.firstName} ${p.lastName}`,
    p.agencyRef,
    (p.arrivalDate && new Date(p.arrivalDate).toLocaleDateString()) || "",
    (p.departureDate && new Date(p.departureDate).toLocaleDateString()) || "",
    p.numberOfNights,
  ]);
  mappedStudents.forEach((row) => {
    row = row.map((el, index) => {
      return {
        text: el,
        fontSize: 10,
      };
    });
  });
  let mappedcolumns = columns.map((row) => {
    return {
      text: row,
      style: "tableHeader",
    };
  });
  let docDefinition = {
    pageSize: "A4",
    content: [
      {
        text: `All Rooms by ${sort} Report`,
        fontSize: 16,
        alignment: "left",
        color: "#000080",
        margin: 0,
      },
      {
        text: `${campus}`,
        fontSize: 16,
        bold: true,
        alignment: "right",
        color: "#808080",
        margin: 0,
      },
      {
        text: `Date Range: ${startDate.toDateString()} - ${endDate.toDateString()};`,
        style: "sectionHeader",
        margin: [0, 0, 0, 15],
      },
      {
        style: "tableExample",
        table: {
          widths: ["auto", "auto", "auto", "auto", "auto", "auto", "auto"],
          headerRows: 1,
          body: [mappedcolumns, ...mappedStudents],
        },
        layout: "headerLineOnly",
      },
    ],
    styles: {
      tableHeader: {
        bold: true,
        fontSize: 11,
        color: "black",
      },
    },
  };

  if (action === "download") {
    pdfMake
      .createPdf(docDefinition)
      .download(`Rooms_Check_In_Report${new Date().toISOString()}.pdf`);
  } else if (action === "print") {
    pdfMake.createPdf(docDefinition).print();
  } else {
    pdfMake.createPdf(docDefinition).open();
  }
}
export async function generateCertificat(studentNames: Array<string>, storage) {
  let pdfs = [];
  studentNames.forEach(async (name) => {
    var dd = {
  // a string or { width: number, height: number }
  pageSize: { width: 1000, height: 761},

  // by default we use portrait, you can change it to landscape if you wish
  // pageOrientation: 'landscape',

  // [left, top, right, bottom] or [horizontal, vertical] or just a number for equal margins
  pageMargins: [ 10, 15, 10, 15 ],
      background: [
        {
          image: base64String,
        },
      ],
      content: [
        {
          text: name,
          fontSize: 24,
          bold:true,
          absolutePosition: { x: 400, y: 275 },
        },
      ],
    };
    const pdf = pdfMake.createPdf(dd, name);
    pdfs.push(pdf);
  });
  let blobs = [];
  var index = 0;
  var prevIndex = -1;
  setBlobList(pdfs, index, blobs, prevIndex, storage);
}
export function setBlobList(pdfs, index, blobs, prevIndex, storage) {
    if (index < pdfs.length) {
      // docArray here is array of docs contents
      if (pdfs[index] && prevIndex !== index) {
        prevIndex = index;
        pdfs[index].getBlob((blob) => {
          blobs.push({blob: blob, name: pdfs[index].tableLayouts});
          index++;
          setBlobList(pdfs, index, blobs, prevIndex, storage)
        });
      }

    }
  if (index == pdfs.length ) {
    var zip = new JSZip();
    const Student_Certifcates = zip.folder("Student_Certifcates");
    blobs.forEach((file) => {
      Student_Certifcates.file(file.name+'.pdf', file.blob, { binary: true });

    });
    Student_Certifcates.generateAsync({ type: "blob" }).then(function (
      content
    ) {
      fileSaver.saveAs(content, "Student_Certificates.zip");
      storage.loading.next(false)
    });
  }
}
export function getBase64ImageFromURL(url) {
  return new Promise((resolve, reject) => {
    var img = new Image();
    img.setAttribute("crossOrigin", "anonymous");

    img.onload = () => {
      var canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;

      var ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0);

      var dataURL = canvas.toDataURL("image/png");

      resolve(dataURL);
    };

    img.onerror = (error) => {
      reject(error);
    };

    img.src = url;
  });
}
