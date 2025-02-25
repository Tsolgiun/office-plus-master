const http = require('http');

const options = {
  hostname: 'localhost',
  port: 5000,
  path: '/api/properties',
  method: 'GET'
};

const req = http.request(options, res => {
  console.log(`Status Code: ${res.statusCode}`);
  
  let data = '';
  
  res.on('data', chunk => {
    data += chunk;
  });
  
  res.on('end', () => {
    console.log('Response received');
    try {
      const properties = JSON.parse(data);
      console.log(`Number of properties: ${properties.length}`);
      console.log('First property:', JSON.stringify(properties[0], null, 2));
    } catch (error) {
      console.error('Error parsing response:', error);
      console.log('Raw response:', data);
    }
  });
});

req.on('error', error => {
  console.error('Error making request:', error);
});

req.end();
