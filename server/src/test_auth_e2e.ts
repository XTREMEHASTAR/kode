import fetch from 'node-fetch';

const BASE_URL = 'http://127.0.0.1:3000/api';

async function testAuthFlow() {
  console.log('🚀 Running E2E Authentication & JWT Telemetry Verification...');

  const timestamp = Date.now();
  const testEmail = `admin_test_${timestamp}@kontagi.ai`;
  const testPassword = 'Password123!';

  // 1. Register Admin User
  console.log(`\n1. Registering user: ${testEmail}`);
  const regRes = await fetch(`${BASE_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: testEmail,
      password: testPassword,
      firstName: 'Admin',
      lastName: 'Tester',
    }),
  });

  const regData = (await regRes.json()) as any;
  console.log(`   Register Status: ${regRes.status} (User ID: ${regData.data?.user?.id})`);

  // Promote test user to ADMIN role in database
  const { getPrisma } = await import('./config/database.js');
  await getPrisma().user.update({
    where: { id: regData.data?.user?.id },
    data: { role: 'ADMIN' },
  });
  console.log('   User role promoted to ADMIN in database');

  // 2. Login
  console.log('\n2. Logging in to acquire JWT...');
  const loginRes = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: testEmail, password: testPassword }),
  });

  const loginData = (await loginRes.json()) as any;
  console.log(`   Login Status: ${loginRes.status}`);
  const accessToken = loginData.data?.accessToken;
  console.log(`   Issued Access Token Present: ${!!accessToken}`);
  console.log(`   Token Format Valid (eyJ...): ${accessToken?.startsWith('eyJ')}`);

  if (!accessToken) {
    console.error('❌ Login failed to issue access token');
    process.exit(1);
  }

  // 3. Test Protected Admin & User Endpoints
  const endpoints = [
    '/admin/overview',
    '/admin/system',
    '/admin/users',
    '/admin/ai',
    '/workspaces',
  ];

  console.log('\n3. Testing Protected Endpoints with Bearer JWT:');
  for (const ep of endpoints) {
    const res = await fetch(`${BASE_URL}${ep}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    console.log(`   [${res.status}] GET ${ep} — ${res.status === 200 ? '✅ SUCCESS' : '❌ FAILED'}`);
  }

  console.log('\n✨ E2E Verification Complete!');
}

testAuthFlow().catch((err) => {
  console.error('❌ E2E Auth test error:', err);
  process.exit(1);
});
