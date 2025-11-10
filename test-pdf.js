// Test script for PDF generation
const http = require('http');

const testData = {
  period: {
    startDate: "2024-01-01",
    endDate: "2024-06-30"
  },
  teachersByInstitution: [
    {
      institution: {
        id: "1",
        fullname: "Test Institution",
        abbreviation: "TEST"
      },
      byGrade: [
        {
          grade: "Professeur",
          teachers: [
            {
              id: "1",
              firstname: "Test",
              lastname: "Teacher",
              matricule: "123456",
              birthdate: "1980-01-01",
              hireDate: "2010-01-01",
              lastDiploma: "PhD",
              lastAdvancementDate: "2020-01-01",
              cei: "10",
              nextAdvancementDate: "2025-01-01",
              nextCei: "11"
            }
          ]
        }
      ],
      total: 1
    }
  ],
  totalTeachers: 1,
  teacherIds: [{ id: "1" }]
};

const postData = JSON.stringify(testData);

const options = {
  hostname: 'localhost',
  port: 5500,
  path: '/api/advancements/generate-pdf',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(postData)
  }
};

console.log('Testing PDF generation endpoint...');
console.log('URL:', `http://${options.hostname}:${options.port}${options.path}`);
console.log('');

const req = http.request(options, (res) => {
  console.log('Status Code:', res.statusCode);
  console.log('Headers:', JSON.stringify(res.headers, null, 2));
  console.log('');

  let data = '';
  
  res.on('data', (chunk) => {
    data += chunk;
  });

  res.on('end', () => {
    if (res.statusCode === 201 || res.statusCode === 200) {
      console.log('✅ SUCCESS: PDF generated');
      console.log('Response size:', data.length, 'bytes');
    } else {
      console.log('❌ ERROR: PDF generation failed');
      console.log('Response:', data);
    }
  });
});

req.on('error', (error) => {
  console.error('❌ Request error:', error.message);
});

req.write(postData);
req.end();
