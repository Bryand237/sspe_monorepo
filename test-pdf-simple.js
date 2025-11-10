// Test le nouvel endpoint /test-pdf (sans DB)
const http = require('http');

const testData = {
  period: {
    startDate: "2024-01-01",
    endDate: "2024-06-30"
  },
  teachersByInstitution: [],
  totalTeachers: 0
};

const postData = JSON.stringify(testData);

const options = {
  hostname: 'localhost',
  port: 5500,
  path: '/api/advancements/test-pdf',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(postData)
  }
};

console.log('Testing /test-pdf endpoint (NO DATABASE)...');

const req = http.request(options, (res) => {
  console.log('Status Code:', res.statusCode);
  
  if (res.statusCode === 201 || res.statusCode === 200) {
    console.log('✅ SUCCESS! PDF endpoint works WITHOUT database');
  } else {
    console.log('❌ FAILED');
  }
});

req.on('error', (error) => {
  console.error('❌ Request error:', error.message);
});

req.write(postData);
req.end();
