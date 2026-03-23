/**
 * IGCA Nexus Intranet - Google Apps Script Backend API
 * 
 * Provides decoupled REST API endpoints via `doGet` and `doPost` to interact 
 * with a connected Google Sheet Database for the React Frontend.
 */

// **CONFIGURATION**
// Connect to your Google Sheet by entering the Sheet ID below.
const SHEET_ID = '1hNaHaZovhoJq_6jQDgRfhNCS0SY3kKlO7bvv4Wv68uc';

/**
 * Handle GET Requests
 * Acts as a router based on the ?action= parameter.
 */
function doGet(e) {
  const action = e.parameter.action || 'getAllData';
  
  try {
    let data;

    // Use CacheService to serve instant JSON for 15 minutes globally
    const cache = CacheService.getScriptCache();
    
    if (action === 'getAllData') {
      const cachedData = cache.get('nexus_all_data');
      if (cachedData) {
        // Return instantly from Google's edge cache
        return createJsonResponse({ success: true, data: JSON.parse(cachedData) });
      }

      // Cache miss: Read from spreadsheet
      data = {
        updates: getSheetData('Important Updates'),
        directory: getSheetData('Teams Data'),
        formats: getSheetData('Formats'),
        systems: getSheetDataByFilter('System Links', 'Category', 'System'),
        hr: getSheetDataByFilter('System Links', 'Category', 'HR'),
        stats: [
          { label: 'Years Experience', value: '62+' },
          { label: 'Team Members', value: '125+' },
          { label: 'Happy Clients', value: '12K+' },
          { label: 'Cases Completed', value: '53K+' }
        ]
      };
      
      // Store in cache for 60 seconds so sheet changes reflect quickly
      cache.put('nexus_all_data', JSON.stringify(data), 60);
      return createJsonResponse({ success: true, data: data });
    }

    if (action === 'getWordDownload') {
      const docUrl = e.parameter.docUrl;
      const exportUrl = generateWordDownloadLink(docUrl);
      return createJsonResponse({ success: true, downloadUrl: exportUrl });
    }
        
    return createJsonResponse({ error: 'Invalid action provided.' }, 400);
    
  } catch (error) {
    return createJsonResponse({ error: error.toString() }, 500);
  }
}

/**
 * Handle POST Requests
 * Used to save new Document Formats from the React Modal.
 */
function doPost(e) {
  try {
    const postData = JSON.parse(e.postData.contents);
    const action = postData.action;

    if (action === 'saveDocument') {
      saveNewDocumentData(postData.payload);
      return createJsonResponse({ success: true, message: 'Document saved successfully.' });
    }

    return createJsonResponse({ error: 'Invalid post action.' }, 400);
  } catch (error) {
    return createJsonResponse({ error: error.toString() }, 500);
  }
}


// --- HELPER FUNCTIONS ---

/**
 * Creates standardized JSON responses with proper CORS and MimeType headers.
 */
function createJsonResponse(responseObject, statusCode = 200) {
  return ContentService.createTextOutput(JSON.stringify(responseObject))
    .setMimeType(ContentService.MimeType.JSON);
    // Note: GAS handles CORS headers natively when requested by a fetch() call.
}

/**
 * Extrapolates Google Doc ID from URL and returns a .docx export link.
 */
function generateWordDownloadLink(url) {
  // Regex to match the ID between `/d/` and `/`
  const match = url.match(/\/d\/(.*?)\//);
  if (match && match[1]) {
    const docId = match[1];
    return `https://docs.google.com/document/d/${docId}/export?format=docx`;
  }
  return null;
}

/**
 * Generic sheet fetcher: Retreives DisplayValues and maps them to an array of JSON objects.
 */
function getSheetData(sheetName) {
  const sheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName(sheetName);
  if (!sheet) throw new Error(`Sheet "${sheetName}" not found.`);
  
  const values = sheet.getRange(1, 1, sheet.getLastRow(), sheet.getLastColumn()).getValues();
  if (values.length < 2) return [];

  const headers = values[0].map(String);
  const rows = values.slice(1);
  
  // Filter out empty rows (where all essential columns are blank)
  const filteredRows = rows.filter(row => row.join('').trim() !== '');

  const jsonArray = filteredRows.map(row => {
    let obj = {};
    headers.forEach((header, index) => {
      let cellValue = row[index];
      // Convert Dates to readable strings or handle basic types to prevent JSON issues
      if (cellValue instanceof Date) {
        cellValue = cellValue.toLocaleDateString();
      }
      obj[header.trim()] = String(cellValue).trim();
    });
    return obj;
  });

  return jsonArray;
}

/**
 * Fetches Sheet Data and specifically filters it by a Category Column.
 */
function getSheetDataByFilter(sheetName, filterColumnName, filterValue) {
  const allData = getSheetData(sheetName);
  return allData.filter(item => item[filterColumnName] === filterValue);
}

/**
 * Appends a new Document entry into the Formats sheet.
 */
function saveNewDocumentData(payload) {
  const sheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName('Formats');
  if (!sheet) throw new Error('Formats sheet not found.');

  // Assuming Formats Headers: Title, Description, Category, Google Doc Link, Icon
  const newRow = [
    payload.title || '',
    payload.description || '',
    payload.category || '',
    payload.googleDocLink || '',
    payload.icon || 'FileText' // Default icon fallback
  ];

  sheet.appendRow(newRow);
}
