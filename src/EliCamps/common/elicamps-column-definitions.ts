import { formatDate } from '@angular/common';

export const GROUPS_COL_DEFS = [
  {
    headerName: 'Year',
    field: 'year',
    minWidth: 50,
    maxWidth: 150,
    resizable: true
  },
  {
    headerName: 'Ref Number',
    field: 'refNumber',
    minWidth: 50,
    maxWidth: 150,
    resizable: true,
  },
  {
    headerName: 'Agent',
    field: 'agentName',
    minWidth: 50,
    maxWidth: 150,
    resizable: true,
  },
  {
    headerName: 'Agency Ref',
    field: 'agencyRef',
    minWidth: 50,
    maxWidth: 150,
    resizable: true,
  },
  {
    headerName: 'Country/Region',
    field: 'country',
    minWidth: 50,
    maxWidth: 150,
    resizable: true,
  },
  {
    headerName: 'Arrival Date',
    field: 'arrivalDate',
    minWidth: 50,
    maxWidth: 150,
    resizable: true,
    cellRenderer: (params) => {
      return params.value
        ? formatDate(params.value, 'MMMM dd, y', 'en')
        : '';
    }
  },
  {
    headerName: 'Terminal',
    field: 'terminal',
    minWidth: 50,
    maxWidth: 150,
    resizable: true,
  },
  {
    headerName: 'Flight Number ',
    field: 'flightNumber',
    minWidth: 50,
    maxWidth: 150,
    resizable: true,
  },
  {
    headerName: 'Destination From ',
    field: 'destinationFrom',
    minWidth: 50,
    maxWidth: 150,
    resizable: true,
  },
  {
    headerName: 'Arrival Time',
    field: 'arrivalTime',
    minWidth: 50,
    maxWidth: 150,
    resizable: true,
  },
  {
    headerName: 'Departure Date ',
    field: 'departureDate',
    minWidth: 50,
    maxWidth: 150,
    resizable: true,
    cellRenderer: (params) => {
      return params.value
        ? formatDate(params.value, 'MMMM dd, y', 'en')
        : '';
    }
  },
  {
    headerName: 'Departure Terminal',
    field: 'departureTerminal',
    minWidth: 50,
    maxWidth: 150,
    resizable: true
  },
  {
    headerName: 'Departure Flight Number ',
    field: 'departureFlightNumber',
    minWidth: 50,
    maxWidth: 150,
    resizable: true
  },
  {
    headerName: 'Destination To',
    field: 'destinationTo',
    minWidth: 50,
    maxWidth: 150,
    resizable: true
  },
  {
    headerName: 'Flight Departure Time ',
    field: 'flightDepartureTime',
    minWidth: 50,
    maxWidth: 150,
    resizable: true
  },
  {
    headerName: 'Status',
    field: 'active',
    pinned: 'right',
    minWidth: 50,
    resizable: true,
    cellRenderer: (params) => params.value === true ? 'Active' : 'Inactive',
    cellStyle: (params) => {
      if (params.value === false) {
        return { color: 'red', 'font-weight': '600' };
      } else {
        return { color: 'green', 'font-weight': '500' };
      }
    }
  },
];
export const STUDENT_COL_DEFS = [
  {
    headerName: 'First Name',
    field: 'firstName',
    minWidth: 50,
    // maxWidth: 150,
    resizable: true
  },
  {
    headerName: 'Last Name',
    field: 'lastName',
    tooltipField: 'lastName',
    minWidth: 50,
    // maxWidth: 150,
    resizable: true
  },
  {
    headerName: 'Gender',
    field: 'gender',
    minWidth: 50,
    // maxWidth: 150,
    resizable: true
  },
  {
    headerName: 'Arrival Date',
    field: 'programeStartDate',
    minWidth: 50,
    // maxWidth: 150,
    resizable: true,
    cellRenderer: (params) => {
      return params.value
        ? formatDate(params.value, 'MMMM dd, y', 'en')
        : '';
    }
  },
  {
    headerName: 'Departure Date',
    field: 'programeEndDate',
    minWidth: 50,
    // maxWidth: 150,
    resizable: true,
    cellRenderer: (params) => {
      return params.value
        ? formatDate(params.value, 'MMMM dd, y', 'en')
        : '';
    }
  },
  {
    headerName: 'Number of Nights',
    field: 'numberOfNights',
    minWidth: 50,
    // maxWidth: 150,
    resizable: true,
  },
  {
    headerName: 'Country',
    field: 'country',
    minWidth: 50,
    // maxWidth: 150,
    resizable: true,
  },
  {
    headerName: 'Age',
    field: 'age',
    minWidth: 50,
    // maxWidth: 150,
    resizable: true
  },
  {
    headerName: 'Agency',
    field: 'agentName',
    tooltipField: 'agentName',
    minWidth: 50,
    // maxWidth: 150,
    resizable: true
  },
  {
    headerName: 'Agency Ref #',
    field: 'agencyRef',
    tooltipField: 'agencyRef',
    minWidth: 50,
    // maxWidth: 150,
    resizable: true
  },
  {
    headerName: 'Format',
    field: 'formatName',
    tooltipField: 'formatName',
    minWidth: 50,
    // maxWidth: 100,
    resizable: true
  },
  {
    headerName: 'Room ID',
    field: 'roomID',
    minWidth: 50,
    // maxWidth: 100,
    resizable: true
  },
  {
    headerName: 'Status',
    field: 'active',
    pinned: 'right',
    minWidth: 50,
    resizable: true,
    cellRenderer: (params) => {
      if (params.data.active === true && new Date(params.data.programeEndDate) <= new Date()) {
        return 'Passed'
      } else if (params.data.active === true) {
        return 'Active'
      } else {
        return 'Cancelled'
      }
    },
    cellStyle: (params) => {
      if (params.value === false) {
        return { color: 'red', 'font-weight': '600' };
      } else if (params.data.active === true && new Date(params.data.programeEndDate) <= new Date()) {
        return { color: 'orange', 'font-weight': '500' };
      } else {
        return { color: 'green', 'font-weight': '500' };
      }
    }
  },
];
export const ROOMS_COL_DEFS = [
  // {
  //   headerName: 'Camps',
  //   field: 'campus',
  //   minWidth: 50,
  //   resizable: true
  // },
  {
    headerName: 'Building',
    field: 'building',
    minWidth: 50,
    resizable: true
  },
  {
    headerName: 'Room Type',
    field: 'roomType',
    minWidth: 50,
    resizable: true
  },
  {
    headerName: 'Notes',
    field: 'notes',
    minWidth: 50,
    resizable: true
  },
  {
    headerName: 'Booked From',
    field: 'bookedFrom',
    minWidth: 50,
    resizable: true,
    cellRenderer: (params) => {
      return params.value
        ? formatDate(params.value, 'MMMM dd, y', 'en')
        : '';
    }
  },
  {
    headerName: 'Booked To',
    field: 'bookedTo',
    minWidth: 50,
    resizable: true,
    cellRenderer: (params) => {
      return params.value
        ? formatDate(params.value, 'MMMM dd, y', 'en')
        : '';
    }
  },
  {
    headerName: 'Available',
    field: 'available',
    minWidth: 50,
    resizable: true
  },
  {
    headerName: 'Available From',
    field: 'availableFrom',
    minWidth: 50,
    resizable: true,
    cellRenderer: (params) => {
      return params.value
        ? formatDate(params.value, 'MMMM dd, y', 'en')
        : '';
    }
  },
  {
    headerName: 'Available To',
    field: 'availableTo',
    minWidth: 50,
    resizable: true,
    cellRenderer: (params) => {
      return params.value
        ? formatDate(params.value, 'MMMM dd, y', 'en')
        : '';
    }
  },
  // {
  //   headerName: 'Imported One',
  //   field: 'importedOne',
  //   minWidth: 50,
  //   resizable: true
  // },
  // {
  //   headerName: 'Week No',
  //   field: 'weekno',
  //   minWidth: 50,
  //   resizable: true
  // },
  // {
  //   headerName: 'Year',
  //   field: 'year',
  //   minWidth: 50,
  //   resizable: true
  // },
  {
    headerName: 'Status',
    field: 'active',
    pinned: 'right',
    minWidth: 50,
    resizable: true,
    cellRenderer: (params) => params.value === true ? 'Active' : 'Inactive',
    cellStyle: (params) => {
      if (params.value === false) {
        return { color: 'red', 'font-weight': '600' };
      } else {
        return { color: 'green', 'font-weight': '500' };
      }
    }
  },
];
export const AGENTS_COL_DEFS = [
  {
    headerName: 'Agent',
    field: 'agent',
    minWidth: 50,
    resizable: true
  },
  {
    headerName: 'Contact',
    field: 'contact',
    minWidth: 50,
    resizable: true
  },
  {
    headerName: 'Phone',
    field: 'phone',
    minWidth: 50,
    resizable: true
  },
  {
    headerName: 'Email',
    field: 'email',
    minWidth: 50,
    resizable: true
  },
  {
    headerName: 'Website',
    field: 'web',
    minWidth: 50,
    resizable: true
  },
  {
    headerName: 'Address',
    field: 'address',
    minWidth: 50,
    resizable: true
  },
  {
    headerName: 'Country',
    field: 'country',
    minWidth: 50,
    resizable: true
  },
  {
    headerName: 'Notes',
    field: 'notes',
    minWidth: 50,
    resizable: true
  },
  {
    headerName: 'Status',
    field: 'active',
    pinned: 'right',
    minWidth: 50,
    resizable: true,
    cellRenderer: (params) => params.value === true ? 'Active' : 'Inactive',
    cellStyle: (params) => {
      if (params.value === false) {
        return { color: 'red', 'font-weight': '600' };
      } else {
        return { color: 'green', 'font-weight': '500' };
      }
    }
  },
];
export const TRIP_COL_DEFS = [
  {
    headerName: 'Year',
    field: 'year',
    minWidth: 50,
    resizable: true
  },
  {
    headerName: 'Date',
    field: 'tripsDate',
    minWidth: 50,
    resizable: true,
    cellRenderer: (params) => {
      return params.value
        ? formatDate(params.value, 'MMMM dd, y', 'en')
        : '';
    }
  },
  {
    headerName: 'Trip',
    field: 'trips',
    minWidth: 50,
    resizable: true
  },
  {
    headerName: 'Notes',
    field: 'notes',
    minWidth: 50,
    resizable: true
  },
  {
    headerName: 'Status',
    field: 'active',
    pinned: 'right',
    minWidth: 50,
    resizable: true,
    cellRenderer: (params) => params.value === true ? 'Active' : 'Inactive',
    cellStyle: (params) => {
      if (params.value === false) {
        return { color: 'red', 'font-weight': '600' };
      } else {
        return { color: 'green', 'font-weight': '500' };
      }
    }
  },
];
export const CAMPUS_COL_DEFS = [
  {
    headerName: 'Campus',
    field: 'campus',
    minWidth: 50,
    resizable: true
  },
  {
    headerName: 'Address On Reports',
    field: 'addressOnReports',
    minWidth: 50,
    resizable: true
  },
  {
    headerName: 'Complete Name',
    field: 'completeName',
    minWidth: 50,
    resizable: true
  },
  {
    headerName: 'One line address',
    field: 'onelineaddress',
    minWidth: 50,
    resizable: true
  },
  {
    headerName: 'Status',
    field: 'active',
    pinned: 'right',
    minWidth: 50,
    resizable: true,
    cellRenderer: (params) => params.value === true ? 'Active' : 'Inactive',
    cellStyle: (params) => {
      if (params.value === false) {
        return { color: 'red', 'font-weight': '600' };
      } else {
        return { color: 'green', 'font-weight': '500' };
      }
    }
  },
];
export const ADDINS_COL_DEFS = [
  {
    headerName: 'Addins',
    field: 'addins',
    minWidth: 100,
    resizable: true
  },
  {
    headerName: 'Addin Type',
    field: 'addinsType',
    minWidth: 100,
    resizable: true
  },
  {
    headerName: 'Default',
    field: 'isDefault',
    minWidth: 100,
    resizable: true,
    cellRenderer: (params) => params.value === true ? 'Yes' : 'No',
    cellStyle: (params) => {
      if (params.value === false) {
        return { color: 'red', 'font-weight': '600' };
      } else {
        return { color: 'green', 'font-weight': '500' };
      }
    }
  },
  {
    headerName: 'Status',
    field: 'active',
    pinned: 'right',
    minWidth: 100,
    resizable: true,
    cellRenderer: (params) => params.value === true ? 'Active' : 'Inactive',
    cellStyle: (params) => {
      if (params.value === false) {
        return { color: 'red', 'font-weight': '600' };
      } else {
        return { color: 'green', 'font-weight': '500' };
      }
    }
  }
];
export const GROUP_PAYMENT_COL_DEFS = [
  {
    headerName: 'Ref Number',
    field: 'refNumber',
    minWidth: 100,
    resizable: true
  },
  {
    headerName: 'Date',
    field: 'date',
    minWidth: 100,
    resizable: true,
    cellRenderer: (params) => {
      return params.value
        ? formatDate(params.value, 'MMMM dd, y', 'en')
        : '';
    }
  },
  {
    headerName: 'Amount',
    field: 'amount',
    minWidth: 100,
    resizable: true
  },
  {
    headerName: 'Remarks',
    field: 'remarks',
    minWidth: 100,
    resizable: true
  }
];
export const GROUP_LEADER_PAYMENT_COL_DEFS = [
  {
    headerName: 'Ref Number',
    field: 'refNumber',
    minWidth: 100,
    resizable: true
  },
  {
    headerName: 'Date',
    field: 'date',
    minWidth: 100,
    resizable: true,
    cellRenderer: (params) => {
      return params.value
        ? formatDate(params.value, 'MMMM dd, y', 'en')
        : '';
    }
  },
  {
    headerName: 'Amount',
    field: 'amount',
    minWidth: 100,
    resizable: true
  }
];
export const STUDENT_PAYMENT_COL_DEFS = [
  {
    headerName: 'Date',
    field: 'date',
    minWidth: 100,
    resizable: true,
    cellRenderer: (params) => {
      return params.value
        ? formatDate(params.value, 'MMMM dd, y', 'en')
        : '';
    }
  },
  {
    headerName: 'Amount',
    field: 'amount',
    minWidth: 100,
    resizable: true
  },
  {
    headerName: 'Remarks',
    field: 'remarks',
    minWidth: 100,
    resizable: true
  },
];
export const HOMESTAY_COL_DEFS = [
  {
    headerName: 'Reference',
    field: 'reference',
    minWidth: 100,
    resizable: true
  },
  {
    headerName: 'Name',
    field: 'name',
    minWidth: 100,
    resizable: true
  },
  {
    headerName: 'Cell Number',
    field: 'cellNumber',
    minWidth: 100,
    resizable: true
  },
  {
    headerName: 'Email',
    field: 'email',
    minWidth: 100,
    resizable: true
  },
  {
    headerName: 'Address',
    field: 'address',
    minWidth: 100,
    resizable: true
  },
  {
    headerName: 'Region',
    field: 'region',
    minWidth: 100,
    resizable: true
  },
  {
    headerName: 'Intersection',
    field: 'intersection',
    minWidth: 100,
    resizable: true
  },
  {
    headerName: 'Meals',
    field: 'meals',
    minWidth: 100,
    resizable: true
  },
  {
    headerName: 'Student Preference',
    field: 'prefer',
    minWidth: 100,
    resizable: true
  },
  {
    headerName: 'Rooms',
    field: 'rooms',
    minWidth: 100,
    resizable: true
  },
  {
    headerName: 'Agreement Signed',
    field: 'aggrements',
    minWidth: 100,
    resizable: true
  },
  {
    headerName: 'Police Check',
    field: 'policeCheck',
    minWidth: 100,
    resizable: true
  },
  {
    headerName: 'Status',
    field: 'active',
    pinned: 'right',
    minWidth: 100,
    resizable: true,
    cellRenderer: (params) => params.value === true ? 'Active' : 'Inactive',
    cellStyle: (params) => {
      if (params.value === false) {
        return { color: 'red', 'font-weight': '600' };
      } else {
        return { color: 'green', 'font-weight': '500' };
      }
    }
  }
];
export const PROGRAM_COL_DEFS = [
  {
    headerName: 'Program Name',
    field: 'programName',
    minWidth: 100,
    resizable: true
  },
  {
    headerName: 'Default',
    field: 'isDefault',
    minWidth: 100,
    resizable: true,
    cellRenderer: (params) => params.value === true ? 'Yes' : 'No',
    cellStyle: (params) => {
      if (params.value === false) {
        return { color: 'red', 'font-weight': '600' };
      } else {
        return { color: 'green', 'font-weight': '500' };
      }
    }
  },
  {
    headerName: 'Status',
    field: 'active',
    pinned: 'right',
    minWidth: 100,
    resizable: true,
    cellRenderer: (params) => params.value === true ? 'Active' : 'Inactive',
    cellStyle: (params) => {
      if (params.value === false) {
        return { color: 'red', 'font-weight': '600' };
      } else {
        return { color: 'green', 'font-weight': '500' };
      }
    }
  }
];
export const SUB_PROGRAM_COL_DEFS = [
  {
    headerName: 'Program Name',
    field: 'programName',
    minWidth: 100,
    resizable: true
  },
  {
    headerName: 'Sub Program Name',
    field: 'subProgramName',
    minWidth: 100,
    resizable: true
  },
  {
    headerName: 'Status',
    field: 'active',
    pinned: 'right',
    minWidth: 100,
    resizable: true,
    cellRenderer: (params) => params.value === true ? 'Active' : 'Inactive',
    cellStyle: (params) => {
      if (params.value === false) {
        return { color: 'red', 'font-weight': '600' };
      } else {
        return { color: 'green', 'font-weight': '500' };
      }
    }
  }
];
export const USER_COL_DEFS = [
  {
    headerName: 'Email',
    field: 'email',
    minWidth: 50,
    resizable: true
  },
  {
    headerName: 'First Name',
    field: 'firstName',
    minWidth: 50,
    resizable: true
  },
  {
    headerName: 'Sur Name',
    field: 'surName',
    minWidth: 50,
    resizable: true
  },
  {
    headerName: 'Status',
    field: 'active',
    pinned: 'right',
    minWidth: 50,
    resizable: true,
    cellRenderer: (params) => params.value === true ? 'Active' : 'Inactive',
    cellStyle: (params) => {
      if (params.value === false) {
        return { color: 'red', 'font-weight': '600' };
      } else {
        return { color: 'green', 'font-weight': '500' };
      }
    }
  },
];
export const PAYMENT_REPORT_COL_DEFS = [
  {
    headerName: 'Ref',
    field: 'reg_Ref',
    minWidth: 50,
    pinned: 'left',
    resizable: true
  },
  {
    headerName: 'Programme',
    field: 'programName',
    minWidth: 50,
    resizable: true
  },
  {
    headerName: 'Student Name',
    field: 'studentName',
    minWidth: 50,
    resizable: true
  },
  {
    headerName: 'Campus',
    field: 'campusName',
    minWidth: 50,
    resizable: true
  },
  {
    headerName: 'Format',
    field: 'formatName',
    minWidth: 50,
    resizable: true
  },
  {
    headerName: 'Agent',
    field: 'agentName',
    minWidth: 50,
    resizable: true
  },
  {
    headerName: 'Total Gross Price',
    field: 'totalGrossPrice',
    minWidth: 50,
    resizable: true,
    precision: 2,
    valueFormatter: (params) => {
      return '$' + params.value.toFixed(params.colDef.precision);
    }
  },
  {
    headerName: 'Net Price',
    field: 'netPrice',
    minWidth: 50,
    resizable: true,
    precision: 2,
    valueFormatter: (params) => {
      return '$' + params.value.toFixed(params.colDef.precision);
    }
  },
  {
    headerName: 'Commision',
    field: 'commision',
    minWidth: 50,
    resizable: true,
    precision: 2,
    valueFormatter: (params) => {
      return '$' + params.value.toFixed(params.colDef.precision);
    }
  },
  {
    headerName: 'Paid',
    field: 'paid',
    minWidth: 50,
    resizable: true,
    precision: 2,
    valueFormatter: (params) => {
      return '$' + params.value.toFixed(params.colDef.precision);
    }
  },
  {
    headerName: 'Balance',
    field: 'balance',
    minWidth: 50,
    resizable: true,
    precision: 2,
    valueFormatter: (params) => {
      return '$' + params.value.toFixed(params.colDef.precision);
    }
  }
];
export const INSURANCE_REPORT_COL_DEFS = [
  {
    headerName: 'Student #',
    field: 'id',
    width: 130,
    resizable: true,
    pinned: 'left'
  },
  {
    headerName: 'First Name',
    field: 'firstName',
    minWidth: 50,
    resizable: true
  },
  {
    headerName: 'Last Name',
    field: 'lastName',
    minWidth: 50,
    resizable: true
  },
  {
    headerName: 'Birth',
    field: 'dob',
    minWidth: 50,
    resizable: true,
    cellRenderer: (params) => {
      return params.value
        ? formatDate(params.value, 'MMMM dd, y', 'en')
        : '';
    }
  },
  {
    headerName: 'Sex',
    field: 'gender',
    minWidth: 50,
    resizable: true
  },
  {
    headerName: 'Destination',
    field: 'destinationTo',
    minWidth: 50,
    resizable: true
  },
  {
    headerName: 'Start',
    field: 'programeStartDate',
    minWidth: 50,
    resizable: true,
    cellRenderer: (params) => {
      return params.value
        ? formatDate(params.value, 'MMMM dd, y', 'en')
        : '';
    }
  },
  {
    headerName: 'End',
    field: 'programeEndDate',
    minWidth: 50,
    resizable: true,
    cellRenderer: (params) => {
      return params.value
        ? formatDate(params.value, 'MMMM dd, y', 'en')
        : '';
    }
  },
  {
    headerName: 'Group Name',
    field: 'reg_Ref',
    minWidth: 50,
    resizable: true
  },
  {
    headerName: 'Days',
    field: 'numberOfNights',
    minWidth: 50,
    resizable: true
  }
];
export const AIRPORT_REPORT_COL_DEFS = [
  {
    headerName: 'Gender',
    field: 'gender',
  },
  {
    headerName: 'First Name',
    field: 'firstName',
  },
  {
    headerName: 'Last Name',
    field: 'lastName',
  },
  {
    headerName: 'Agency',
    field: 'agentName',
  },
  {
    headerName: 'Country',
    field: 'country',
  },
  {
    headerName: 'Start Date',
    field: 'programeStartDate',
    cellRenderer: (params) => {
      return params.value
        ? formatDate(params.value, 'MMMM dd, y', 'en')
        : '';
    }
  },
  {
    headerName: 'End Date',
    field: 'programeEndDate',
    cellRenderer: (params) => {
      return params.value
        ? formatDate(params.value, 'MMMM dd, y', 'en')
        : '';
    }
  },
  {
    headerName: 'Program',
    field: 'programName',
  },
  {
    headerName: 'Campus',
    field: 'campusName',
  },
  {
    headerName: 'Accomodation Type',
    field: 'homestayOrResi',
    cellRenderer: (params) => {
      if (params.value === '1') {
        return 'Homestay';
      }
      if (params.value === '2') {
        return 'Room';
      }

    }
  },
  {
    headerName: 'Accomodation Address',
    field: 'accAddress',
  },
  {
    headerName: 'Flight Information (Arive)',
    field: 'flightNumber',
  },
  {
    headerName: 'Arrival Date',
    field: 'programeStartDate',
    cellRenderer: (params) => {
      return params.value
        ? formatDate(params.value, 'MMMM dd, y', 'en')
        : '';
    }
  },
  {
    headerName: 'Arrival Time',
    field: 'arrivalTime',
    cellRenderer: (params) => {
      return params.value
        ? formatDate(params.value, 'HH:mm', 'en')
        : '';
    }
  },
  {
    headerName: 'Terminal',
    field: 'terminal',
  },
  {
    headerName: 'Flight Information (Depart)',
    field: 'departureFlightNumber',
  },
  {
    headerName: 'Departure Date',
    field: 'programeEndDate',
    cellRenderer: (params) => {
      return params.value
        ? formatDate(params.value, 'MMMM dd, y', 'en')
        : '';
    }
  },
  {
    headerName: 'Departure Time',
    field: 'flightDepartureTime',
    cellRenderer: (params) => {
      return params.value
        ? formatDate(params.value, 'HH:mm', 'en')
        : '';
    }
  },
  {
    headerName: 'Terminal',
    field: 'departureTerminal',
  }
];
export const TRIP_REPORT_COL_DEFS = [
  {
    headerName: 'First Name',
    field: 'firstName',
  },
  {
    headerName: 'Family Name',
    field: 'lastName',
  },
  {
    headerName: 'Gender',
    field: 'gender',
  },
  {
    headerName: 'Agent',
    field: 'agentName',
  },
  {
    headerName: 'Age',
    field: 'age',
  },
  {
    headerName: 'Cource',
    field: 'programName',
  },
];
export const SITE_BY_DATE_REPORT_COL_DEFS = [
  {
    headerName: 'Student Number',
    field: 'id',
  },
  {
    headerName: 'Gender',
    field: 'gender',
  },
  {
    headerName: 'Student Name',
    field: 'name',
  },
  {
    headerName: 'Date of Birth',
    field: 'dob',
    cellRenderer: (params) => {
      return params.value
        ? formatDate(params.value, 'MMMM dd, y', 'en')
        : '';
    }
  },
  {
    headerName: 'Age',
    field: 'age',
  },
  {
    headerName: 'Agency',
    field: 'agentName',
  },
  {
    headerName: 'Country',
    field: 'country',
  },
  {
    headerName: 'Start Date',
    field: 'programeStartDate',
    cellRenderer: (params) => {
      return params.value
        ? formatDate(params.value, 'MMMM dd, y', 'en')
        : '';
    }
  },
  {
    headerName: 'Arrival Flight Info',
    field: 'flightNumber',
  },
  {
    headerName: 'End Date',
    field: 'programeEndDate',
    cellRenderer: (params) => {
      return params.value
        ? formatDate(params.value, 'MMMM dd, y', 'en')
        : '';
    }
  },
  {
    headerName: 'Departure Flight',
    field: 'departureFlightNumber',
  },
  {
    headerName: 'Medical Information',
    field: 'medicalInformation',
  },

  {
    headerName: 'Program',
    field: 'programName',
  },
  {
    headerName: 'Campus',
    field: 'campusName',
  },
  {
    headerName: 'Format',
    field: 'formatName',
  },
  {
    headerName: 'Meal Plan',
    field: 'mealPlan',
  },
  {
    headerName: 'Address',
    field: 'homeAddress',
  },
  {
    headerName: 'Room Number',
    field: 'room.roomID',
  },
  {
    headerName: 'Building',
    field: 'room.building',
  },
  {
    headerName: 'Trips',
    field: 'studentTrips',
  },
  {
    headerName: 'Add ins',
    field: 'programeAddins',
  },
  {
    headerName: '(If homestay accommodation) Host Information',
    field: 'homestayName',
    valueGetter: (params) => {
      if (params.data.homestayOrResi === '1') {
        return params.homestayName;
      }
    }
  },
  {
    headerName: 'Host contact info',
    field: 'hostContactInfo',
    valueGetter: (params) => {
      if (params.data.homestayOrResi === '1') {
        return params.hostContactInfo;
      }
    }
  }
];
