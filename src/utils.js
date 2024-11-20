import { saveAs } from 'file-saver';
import { Description as DefaultIcon, PictureAsPdf, InsertDriveFile, TableChart } from '@mui/icons-material';
import { ViewDocumentButton } from './admin/modules/ViewDocumentButton';
// Map file types to standard colors and icons
export const fileTypeColors = {
  pdf: { color: '#ff0000', icon: <PictureAsPdf sx={{ fontSize: 40 }}/>},
  csv: { color: '#4caf50', icon: <TableChart sx={{ fontSize: 40 }}/>},
  txt: { color: '#2196f3', icon: <InsertDriveFile sx={{ fontSize: 40 }}/>},
  docx: { color: '#3f51b5', icon: <InsertDriveFile sx={{ fontSize: 40 }}/>},
  default: { color: '#9e9e9e', icon: <DefaultIcon sx={{ fontSize: 40 }}/>}, // Default grey color
};

export const getFileType = (fileName) => {
  const extension = fileName?.split('.').pop().toLowerCase();
  return fileTypeColors[extension] || fileTypeColors.default;
};

export const bytesToSize = (bytes, decimals = 2) => {
    if (!Number(bytes)) {
        return '0 Bytes';
    }

    const kbToBytes = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB'];
    const index = Math.floor(Math.log(bytes) / Math.log(kbToBytes));

    return `${parseFloat((bytes / Math.pow(kbToBytes, index)).toFixed(dm))} ${sizes[index]}`;
}

export const tags = [
  "Affidavit",
  "Attorney Authorization Form",
  "Bankruptcy",
  "Birth Certificate",
  "Case Update Letter",
  "Census form",
  "Certified No Record",
  "CFA (Retainer)",
  "Claimant correspondence (emails or letters)",
  "CLJA",
  "CLJA Form",
  "Complaint",
  "Contact card",
  "Death Certificate",
  "Deposition",
  "Disbursement Statement - Final",
  "Disbursement Statement - Initial",
  "Disbursement Statement - Interim #1",
  "Disbursement Statement - Interim #2",
  "Docket Report",
  "Dual Rep Agreement",
  "Dual Rep Expenses",
  "Electronic Consent",
  "Filed Letter",
  "Health insurance documents",
  "HIPAA/HITECH",
  "Immediate Action Letter or Close Letter",
  "Intake Form",
  "Lien document",
  "Loan document",
  "Marriage License",
  "Medical Bills",
  "Medical Records",
  "Medical Records (From Pattern)",
  "Medical Records Summary",
  "Military Records",
  "Other (not able to classify)",
  "Perfection Letter",
  "Personal Identification Document",
  "PFS Authorization",
  "Pharmacy Records",
  "Plaintiff Fact Sheet",
  "Plaintiff Information Sheet",
  "Plaintiff profile form",
  "Power Of Attorney",
  "Probate/Estate Document",
  "Questionnaire",
  "Questionnaire (Handwritten, need OCR)",
  "Receipt",
  "School records",
  "Settlement release",
  "SF180",
  "Substantiation Packet",
  "Supporting Images",
  "Tolling document",
  "VA 10-5345",
  "Wage loss document"
];


export const claimantDropdownTags = [
  "Select an Issue",
  "Assistance requested populating the document",
  "I have previously submitted requested documentation",
  "Can not access the document",
  "Other"
]

export const getClientUserIdFromUrl = (location) => {
  const urlParams = new URLSearchParams(location);  // Get query string parameters
  return urlParams.get('clientUserId');  // Retrieve the 'clientUserId' parameter value
}

export const getFormattedDate = () => {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0'); // Months are zero-based, so +1
    const day = String(currentDate.getDate()).padStart(2, '0');
    const hours = String(currentDate.getHours()).padStart(2, '0');
    const minutes = String(currentDate.getMinutes()).padStart(2, '0');
    const seconds = String(currentDate.getSeconds()).padStart(2, '0');

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}  

export const removeTime = (dateTimeString) => {
  return dateTimeString.split(' ')[0];
}

export const buttonStyles = {
    height: "50%",
    '&:hover': {
        backgroundColor: '#000080',
        color: "#fff"
    }
}

export const handlePinChange = (e, setPin) => {
    if (e.target.value.length <= 4) {
        setPin(e.target.value);
    }
};

export const claimantPin = '1520'; // Replace with global PIN
export const adminPin = '4950'; // Replace with global PIN

export const handlePinVerify = (setError, setAttempts, attempts, setLockedOut, pin, flow) => {
    if (pin === flow) {
        setError('');
        return true;
    } else {
        setAttempts(prevAttempts => prevAttempts - 1);
    if (attempts - 1 <= 0) {
        setLockedOut(true);
        setError('You have been locked out after 3 incorrect attempts.');
    } else {
        setError(`Incorrect PIN. You have ${attempts - 1} attempts left.`);
    }
    return false;
}
};

export const dataGridColumns = [
  // completed: item.recipient_signed_completed,
  // finishLater: item.recipient_finish_later,
  // authFailure: item.recipient_authentication_failure,
  // declined: item.recipient_declined,
  // delivered: item.recipient_delivered,
  { field: 'request_Id', headerName: 'ID', width: 50 },
  { 
    field: 'url',
    headerName: 'URL', 
    width: 175,
    renderCell: (params) => (
      // params.value ?
        <ViewDocumentButton urlData={params.value} />
      // :
      // <p>Not Created</p>
    ),
  },
  { field: 'matter', headerName: 'Matter', width: 150 },
  { field: 'completed', headerName: 'Completed', width: 100 },
  { field: 'delivered', headerName: 'Delivered', width: 100 },
  { field: 'finishLater', headerName: 'Finish Later', width: 100 },
  { field: 'declined', headerName: 'Declined', width: 100 },
  { field: 'authFailure', headerName: 'Auth Failure', width: 100 },
  { field: 'note', headerName: 'Note', width: 200 },
  // { field: 'campaign', headerName: 'Campaign', width: 150 },
  { field: 'createdDate', headerName: 'Created On', width: 200 },
  { field: 'document_Id', headerName: 'Document ID', width: 150 },
];

export const documentAlertsColumns = [
    { field: 'matter_name', headerName: 'Matter', width: 150 },
    { field: 'alert_document_url', headerName: 'Document URL', width: 350 },
    // { field: 'message', headerName: 'Message', width: 150 },
    // { field: 'insert_date', headerName: 'Created Date', width: 175 },
    // { field: 'campaign', headerName: 'Campaign', width: 125 },
    // { field: 'admin_read', headerName: 'Admin Read', width: 100 },
    { field: 'claimant_read', headerName: 'Claimant Read', width: 125 },
    { field: 'created_by', headerName: 'Created By', width: 125 },
];

export const combinedColumns = [
  { field: 'id', headerName: 'ID', width: 50 },
  { 
    field: 'url',
    headerName: 'Document Link', 
    width: 175,
    renderCell: (params) => (
      // params.value ?
        <ViewDocumentButton urlData={params.value} />
      // :
      // <p>Not Created</p>
    ),
  },
  { field: 'matter_name', headerName: 'Matter', width: 150 },
  { field: 'completed', headerName: 'Completed', width: 100 },
  { field: 'delivered', headerName: 'Delivered', width: 100 },
  { field: 'finishLater', headerName: 'Finish Later', width: 100 },
  { field: 'declined', headerName: 'Declined', width: 100 },
  { field: 'authFailure', headerName: 'Auth Failure', width: 100 },
  { field: 'createdDate', headerName: 'Created On', width: 200 },
  { field: 'note', headerName: 'Note', width: 200 },
  { field: 'document_Id', headerName: 'Document ID', width: 250 },
  // { field: 'matter_name', headerName: 'Matter', width: 150 },
  // { field: 'alert_document_url', headerName: 'Document URL', width: 250 },
  { field: 'claimant_read', headerName: 'Claimant Read', width: 125 },
  { field: 'created_by', headerName: 'Created By', width: 125 },
]



export const convertBooleanNumberToString = (booleanNumber) => {
  return booleanNumber === 1 ? "true" : "false";
}

export const emailWhitelist = [
    "All",
    "gjuarez@wagstafflawfirm.com",
    "rventrapragada@wagstafflawfirm.com",
    "reception@wagstafflawfirm.com",
    "skellerman@wagstafflawfirm.com",
    "aharvey@wagstafflawfirm.com",
    "cbandstra@wagstafflawfirm.com",
    "hmatia@wagstafflawfirm.com",
    "iforgie@wagstafflawfirm.com",
    "dlillig@wagstafflawfirm.com",
    "jweisz@wagstafflawfirm.com",
    "ktaylor@wagstafflawfirm.com",
    "mmassey@wagstafflawfirm.com",
    "malothman@wagstafflawfirm.com",
    "osasseville@wagstafflawfirm.com",
    "vgomez@wagstafflawfirm.com",
    "jgeize@wagstafflawfirm.com",
    "kschreifels@wagstafflawfirm.com",
    "krhoades@wagstafflawfirm.com",
    "ksnodgrass@wagstafflawfirm.com",
    "amendes@wagstafflawfirm.com",
    "dponce@wagstafflawfirm.com",
    "edettloff@wagstafflawfirm.com",
    "jducett@wagstafflawfirm.com",
    "jpierce@wagstafflawfirm.com",
    "lkampling@wagstafflawfirm.com",
    "lwake@wagstafflawfirm.com",
    "mheller@wagstafflawfirm.com",
    "mspence@wagstafflawfirm.com",
    "mgshyamba@wagstafflawfirm.com",
    "mschwartz@wagstafflawfirm.com",
    "receptionist@wagstafflawfirm.com",
    "vlaws@wagstafflawfirm.com",
    "randrus@wagstafflawfirm.com",
    "rjimenez@wagstafflawfirm.com",
    "sthomas@wagstafflawfirm.com",
    "tfryan@wagstafflawfirm.com"
  ];

export const convertISODateToReadable = (isoDateString) => {
    const date = new Date(isoDateString);
    return date.toISOString().slice(0, 19).replace('T', ' ');
}

export const states = [
    'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 
    'Connecticut', 'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 
    'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 
    'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi', 'Missouri', 'Montana', 
    'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico', 'New York', 
    'North Carolina', 'North Dakota', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania', 
    'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 
    'Vermont', 'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'
];

const stateAbbreviations = {
    Alabama: 'AL',
    Alaska: 'AK',
    Arizona: 'AZ',
    Arkansas: 'AR',
    California: 'CA',
    Colorado: 'CO',
    Connecticut: 'CT',
    Delaware: 'DE',
    Florida: 'FL',
    Georgia: 'GA',
    Hawaii: 'HI',
    Idaho: 'ID',
    Illinois: 'IL',
    Indiana: 'IN',
    Iowa: 'IA',
    Kansas: 'KS',
    Kentucky: 'KY',
    Louisiana: 'LA',
    Maine: 'ME',
    Maryland: 'MD',
    Massachusetts: 'MA',
    Michigan: 'MI',
    Minnesota: 'MN',
    Mississippi: 'MS',
    Missouri: 'MO',
    Montana: 'MT',
    Nebraska: 'NE',
    Nevada: 'NV',
    'New Hampshire': 'NH',
    'New Jersey': 'NJ',
    'New Mexico': 'NM',
    'New York': 'NY',
    'North Carolina': 'NC',
    'North Dakota': 'ND',
    Ohio: 'OH',
    Oklahoma: 'OK',
    Oregon: 'OR',
    Pennsylvania: 'PA',
    'Rhode Island': 'RI',
    'South Carolina': 'SC',
    'South Dakota': 'SD',
    Tennessee: 'TN',
    Texas: 'TX',
    Utah: 'UT',
    Vermont: 'VT',
    Virginia: 'VA',
    Washington: 'WA',
    'West Virginia': 'WV',
    Wisconsin: 'WI',
    Wyoming: 'WY',
};
  
export const getStateAbbreviation = (stateName) => {
    return stateAbbreviations[stateName] || 'Unknown State';
}

export const getStateName = (abbreviation) => {
    const stateName = Object.keys(stateAbbreviations).find(
        (key) => stateAbbreviations[key] === abbreviation
    );
    return stateName || 'Unknown Abbreviation';
}


export const formatBirthDate = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
}

export const getMatterNumber = (matterNumber) => {
    return matterNumber.replace("MAT-", "");
}

export const testAlerts = [
    {
      alertId: 1,
      name: "System Update",
      subject: "Scheduled System Maintenance",
      message: "We will be performing system maintenance on September 25th at 2:00 AM.",
      timestamp: "2024-09-19 10:45 AM",
      isRead: false,
      isReadByClaimant: false,
    },
    {
      alertId: 2,
      name: "Policy Change",
      subject: "Changes to Privacy Policy",
      message: "Please review the updated privacy policy effective October 1st.",
      timestamp: "2024-09-18 02:15 PM",
      isRead: false,
      isReadByClaimant: false,
    },
    {
      alertId: 3,
      name: "New Feature",
      subject: "Introducing Two-Factor Authentication",
      message: "We are excited to announce the launch of two-factor authentication for your account security.",
      timestamp: "2024-09-17 08:30 AM",
      isRead: true,
      isReadByClaimant: true,
    },
    {
      alertId: 4,
      name: "Support",
      subject: "Support Ticket Update",
      message: "Your recent support ticket has been updated. Please review the changes.",
      timestamp: "2024-09-16 05:10 PM",
      isRead: false,
      isReadByClaimant: false,
    },
    {
      alertId: 5,
      name: "Survey",
      subject: "Customer Satisfaction Survey",
      message: "We would love to hear your feedback on your recent experience with our service.",
      timestamp: "2024-09-15 09:20 AM",
      isRead: true,
      isReadByClaimant: true,
    },
    {
        alertId: 6,
        name: "System Update",
        subject: "Scheduled System Maintenance",
        message: "We will be performing system maintenance on September 25th at 2:00 AM.",
        timestamp: "2024-09-19 10:45 AM",
        isRead: false,
        isReadByClaimant: false,
      },
      {
        alertId: 7,
        name: "Policy Change",
        subject: "Changes to Privacy Policy",
        message: "Please review the updated privacy policy effective October 1st.",
        timestamp: "2024-09-18 02:15 PM",
        isRead: false,
        isReadByClaimant: false,
      },
      {
        alertId: 8,
        name: "New Feature",
        subject: "Introducing Two-Factor Authentication",
        message: "We are excited to announce the launch of two-factor authentication for your account security.",
        timestamp: "2024-09-17 08:30 AM",
        isRead: true,
        isReadByClaimant: true,
      },
      {
        alertId: 9,
        name: "Support",
        subject: "Support Ticket Update",
        message: "Your recent support ticket has been updated. Please review the changes.",
        timestamp: "2024-09-16 05:10 PM",
        isRead: false,
        isReadByClaimant: false,
      },
      {
        alertId: 10,
        name: "Survey",
        subject: "Customer Satisfaction Survey",
        message: "We would love to hear your feedback on your recent experience with our service.",
        timestamp: "2024-09-15 09:20 AM",
        isRead: true,
        isReadByClaimant: true,
      },
  ];

export const exampleDocumentData = {
  request_name: 'NDA',
  description: 'Details of document',
  is_sequential: true,
  actions: JSON.stringify([
    {
      action_type: 'SIGN', // Changed to "SIGN"
      recipient_email: 'abc@example.com',
      recipient_name: 'Alex James',
      signing_order: 0, // Added signing_order
      verify_recipient: true,
      verification_type: 'EMAIL', // Added verification_type
      private_notes: 'To be signed' // Added private_notes
    },
    {
      action_type: 'INPERSONSIGN', // Changed to "INPERSONSIGN"
      recipient_email: 'alex.james@securesign24x7.com',
      recipient_name: 'Alex James',
      in_person_name: 'David', // Added in_person_name
      in_person_email: 'david@example.com', // Added in_person_email
      signing_order: 1, // Added signing_order
      verify_recipient: false,
      private_notes: 'Sign as Inperson' // Added private_notes
    }
  ]),
  expiration_days: 10,
  email_reminders: true,
  reminder_period: 2,
  notes: 'Note for all recipients'
};

export const exportToCSV = (rows, columns) => {
  // Extract column headers
  const headers = columns.map((column) => column.headerName).join(',');
  
  // Extract row data
  const csvRows = rows.map((row) => {
    return columns.map((column) => {
      return row[column.field];
    }).join(',');
  });

  // Join headers and rows
  const csvString = [headers, ...csvRows].join('\n');

  // Create a Blob and trigger file download
  const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
  saveAs(blob, 'data_export.csv');
};

export const encodeFileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result.split(',')[1]); // Remove the prefix
    reader.onerror = (error) => reject(error);
  });
};
