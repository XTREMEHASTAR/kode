async function executeRuntimeTrace() {
  console.log('\n=======================================================');
  console.log('🔍 LIVE RUNTIME DEBUGGING TRACER FOR GOOGLE OAUTH');
  console.log('=======================================================\n');

  const baseUrl = 'http://127.0.0.1:3000/api';
  const timestamp = Date.now();

  // Test Case A: Real JWT Structure ID Token
  const validHeader = btoa(JSON.stringify({ alg: 'RS256', typ: 'JWT', kid: 'google_kid_123' }));
  const validPayload = btoa(JSON.stringify({
    iss: 'https://accounts.google.com',
    aud: '880591406455-9kiamavjl9aavikffvjd6913j77a32gh.apps.googleusercontent.com',
    sub: `google_live_user_${timestamp}`,
    email: `live_google_${timestamp}@kontagi.ai`,
    email_verified: true,
    given_name: 'Live',
    family_name: 'Tester',
    picture: 'https://lh3.googleusercontent.com/a/default-user',
    iat: Math.floor(Date.now() / 1000) - 10,
    exp: Math.floor(Date.now() / 1000) + 3600
  }));
  const mockSignature = 'SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';
  const mockGoogleIdToken = `${validHeader}.${validPayload}.${mockSignature}`;

  console.log('--- TEST CASE 1: Sending POST /api/auth/google with Google ID Token ---');
  console.log(`Token Prefix: ${mockGoogleIdToken.substring(0, 25)}`);
  console.log(`Token Length: ${mockGoogleIdToken.length}`);
  console.log(`StartsWith eyJ: ${mockGoogleIdToken.startsWith('eyJ')}\n`);

  try {
    const res = await fetch(`${baseUrl}/auth/google`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        credential: mockGoogleIdToken,
        idToken: mockGoogleIdToken
      })
    });

    const status = res.status;
    const bodyText = await res.text();
    let bodyJson: any;
    try {
      bodyJson = JSON.parse(bodyText);
    } catch {
      bodyJson = bodyText;
    }

    console.log(`HTTP Response Status: ${status}`);
    console.log('HTTP Response Body:', JSON.stringify(bodyJson, null, 2));

    if (status === 200) {
      console.log('\n✅ RUNTIME VERIFICATION SUCCESS: HTTP 200 returned!');
      console.log(`   User ID: ${bodyJson.data?.user?.id}`);
      console.log(`   User Email: ${bodyJson.data?.user?.email}`);
      console.log(`   Access Token Present: ${!!bodyJson.data?.accessToken}`);
    } else {
      console.log('\n❌ RUNTIME FAILURE: Server returned non-200 status code.');
    }
  } catch (err: any) {
    console.error('❌ Network / Fetch Exception:', err);
  }

  process.exit(0);
}

executeRuntimeTrace().catch(err => {
  console.error('Fatal Tracer Error:', err);
  process.exit(1);
});
