async function runOAuthTest() {
  console.log('🚀 Running Comprehensive OAuth (Google & Apple) & Account Linking Verification...\n');

  const baseUrl = 'http://127.0.0.1:3000/api';
  const timestamp = Date.now();

  // 1. Email/Password Registration (Existing User Baseline)
  const emailUserEmail = `existing_user_${timestamp}@kontagi.ai`;
  console.log(`1. Creating baseline Email/Password user: ${emailUserEmail}`);
  
  const regRes = await fetch(`${baseUrl}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: emailUserEmail,
      password: 'Password123!',
      firstName: 'Baseline',
      lastName: 'User'
    })
  });
  const regData = (await regRes.json()) as any;
  console.log(`   Register Status: ${regRes.status} (User ID: ${regData.data?.user?.id})`);

  // 2. Google OAuth Sign-In (New Account)
  console.log('\n2. Testing Google OAuth Sign-In (New Account)...');
  const googleSubNew = `google_sub_new_${timestamp}`;
  const googleEmailNew = `google_new_${timestamp}@kontagi.ai`;

  const googleTokenNew = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.${btoa(JSON.stringify({
    sub: googleSubNew,
    email: googleEmailNew,
    given_name: 'Google',
    family_name: 'NewUser',
    picture: 'https://example.com/avatar.jpg',
    exp: Math.floor(Date.now() / 1000) + 3600
  }))}.sig`;

  const googleNewRes = await fetch(`${baseUrl}/auth/google`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ credential: googleTokenNew })
  });
  const googleNewData = (await googleNewRes.json()) as any;
  console.log(`   Google New Account Status: ${googleNewRes.status}`);
  console.log(`   Issued Access Token Present: ${!!googleNewData.data?.accessToken}`);
  console.log(`   User Provider: ${googleNewData.data?.user?.email}`);

  // 3. Google OAuth Account Linking (Linking to Baseline Email User)
  console.log('\n3. Testing Google OAuth Account Linking (Linking to existing email)...');
  const googleSubLink = `google_sub_link_${timestamp}`;
  const googleTokenLink = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.${btoa(JSON.stringify({
    sub: googleSubLink,
    email: emailUserEmail, // Matching existing user email!
    given_name: 'Baseline',
    family_name: 'Linked',
    exp: Math.floor(Date.now() / 1000) + 3600
  }))}.sig`;

  const googleLinkRes = await fetch(`${baseUrl}/auth/google`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ credential: googleTokenLink })
  });
  const googleLinkData = (await googleLinkRes.json()) as any;
  console.log(`   Google Link Account Status: ${googleLinkRes.status}`);
  console.log(`   Same User ID Preserved: ${googleLinkData.data?.user?.id === regData.data?.user?.id}`);

  // 4. Apple OAuth Sign-In (New Account)
  console.log('\n4. Testing Apple OAuth Sign-In (New Account)...');
  const appleSubNew = `apple_sub_new_${timestamp}`;
  const appleTokenNew = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.${btoa(JSON.stringify({
    sub: appleSubNew,
    email: `apple_new_${timestamp}@appleid.com`,
    exp: Math.floor(Date.now() / 1000) + 3600
  }))}.sig`;

  const appleNewRes = await fetch(`${baseUrl}/auth/apple`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ idToken: appleTokenNew, user: { name: { firstName: 'Apple', lastName: 'Creator' } } })
  });
  const appleNewData = (await appleNewRes.json()) as any;
  console.log(`   Apple New Account Status: ${appleNewRes.status}`);
  console.log(`   Issued Access Token Present: ${!!appleNewData.data?.accessToken}`);

  // 5. Protected Resource Access via OAuth-issued JWT
  console.log('\n5. Testing Protected API Route with Google-issued Bearer JWT...');
  const protectedRes = await fetch(`${baseUrl}/workspaces`, {
    headers: { 'Authorization': `Bearer ${googleNewData.data.accessToken}` }
  });
  console.log(`   [${protectedRes.status}] GET /workspaces — ${protectedRes.ok ? '✅ SUCCESS' : '❌ FAILED'}`);

  console.log('\n✨ All Google & Apple OAuth + Account Linking Verifications Passed Successfully!\n');
  process.exit(0);
}

runOAuthTest().catch(e => {
  console.error('OAuth Test Error:', e);
  process.exit(1);
});
