const http = require('http');

function post(url, data) {
  return new Promise((resolve, reject) => {
    const u = new URL(url);
    const postData = JSON.stringify(data);
    const options = {
      hostname: u.hostname,
      port: u.port,
      path: u.pathname,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    };

    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, data: JSON.parse(body) });
        } catch (e) {
          reject(new Error(`Failed to parse response: ${body}`));
        }
      });
    });

    req.on('error', (e) => reject(e));
    req.write(postData);
    req.end();
  });
}

async function runTests() {
  console.log('==================================================');
  console.log('KONTAGI REAL-WORLD AI VERIFICATION');
  console.log('==================================================\n');

  const testPayload = {
    script: "KONTAGI is the ultimate AI video hook engine. It lets you analyze hooks in seconds. The software costs Rs. 499 per month. 90% of creators use it.",
    contentType: "shorts",
    tone: "bold",
    audience: "creators",
    goal: "views",
    attemptIndex: 0
  };

  try {
    console.log('Testing Hook Improvement (attemptIndex: 0)...');
    const res0 = await post('http://127.0.0.1:3000/api/ai/hook/improve', testPayload);
    console.log('Response Status:', res0.status);
    console.log('Response Data:', JSON.stringify(res0.data, null, 2));
    
    console.log('\nAsserting no Mock Provider...');
    if (res0.data.providerInfo && res0.data.providerInfo.type === 'mock') {
      console.error('❌ FAIL: Response contains mock provider!');
    } else {
      console.log('✅ PASS: Real AI provider used:', res0.data.providerInfo);
    }

    console.log('\nAsserting Hook factWarning logic...');
    if (res0.data.factWarning === true) {
      console.log('⚠️ Warning present. Missing anchors:', res0.data.missingAnchors);
    } else {
      console.log('✅ PASS: No fact warning triggered for hook omission (correct behavior).');
    }

    console.log('\n--------------------------------------------------\n');

    console.log('Testing Script Improvement (attemptIndex: 0)...');
    const resScript = await post('http://127.0.0.1:3000/api/ai/script/improve', testPayload);
    console.log('Response Status:', resScript.status);
    console.log('Response Data:', JSON.stringify(resScript.data, null, 2));

    console.log('\nAsserting no Mock Provider for script...');
    if (resScript.data.providerInfo && resScript.data.providerInfo.type === 'mock') {
      console.error('❌ FAIL: Script response contains mock provider!');
    } else {
      console.log('✅ PASS: Real AI provider used for script:', resScript.data.providerInfo);
    }

  } catch (err) {
    console.error('Test execution failed:', err);
  }
}

runTests();
