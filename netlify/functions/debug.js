// Debug function to check if Netlify functions are working
const Airtable = require('airtable');

exports.handler = async (event, context) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json'
  };

  try {
    const debug = {
      timestamp: new Date().toISOString(),
      method: event.httpMethod,
      hasAirtableKey: !!process.env.AIRTABLE_API_KEY,
      hasAirtableBase: !!process.env.AIRTABLE_BASE_ID,
      airtableKeyPreview: process.env.AIRTABLE_API_KEY ? 
        process.env.AIRTABLE_API_KEY.substring(0, 10) + '...' : 'NOT_SET',
      airtableBaseId: process.env.AIRTABLE_BASE_ID || 'NOT_SET'
    };

    // Test Airtable connection if keys are present
    if (process.env.AIRTABLE_API_KEY && process.env.AIRTABLE_BASE_ID) {
      try {
        const base = new Airtable({ 
          apiKey: process.env.AIRTABLE_API_KEY 
        }).base(process.env.AIRTABLE_BASE_ID);

        const records = await base('Table 1').select({ maxRecords: 1 }).firstPage();
        debug.airtableConnection = 'SUCCESS';
        debug.recordCount = records.length;
        
      } catch (airtableError) {
        debug.airtableConnection = 'FAILED';
        debug.airtableError = airtableError.message;
      }
    } else {
      debug.airtableConnection = 'NO_CREDENTIALS';
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(debug, null, 2)
    };

  } catch (error) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: 'Debug function failed',
        message: error.message
      })
    };
  }
};