// Using built-in fetch (available in Node.js 18+)

async function testProfilePersistence() {
  const API_BASE_URL = 'http://localhost:3001/api';

  try {
    console.log('Testing profile persistence fix...\n');

    // Step 1: Register a test user
    console.log('1. Registering test user...');
    const registerResponse = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: 'testuser_' + Date.now(),
        email: 'test' + Date.now() + '@example.com',
        password: 'password123',
        firstName: 'Test',
        lastName: 'User',
        location: 'Test City',
        region: 'Test Region',
        bio: 'Test bio for profile persistence'
      }),
    });

    const registerData = await registerResponse.json();
    console.log('Registration response:', registerData);

    if (!registerResponse.ok) {
      console.log('Registration failed, trying to login with existing user...');
      // Try to login instead
      const loginResponse = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: 'test@example.com',
          password: 'password123',
        }),
      });

      const loginData = await loginResponse.json();
      console.log('Login response:', loginData);

      if (!loginResponse.ok) {
        console.log('Login also failed. Please ensure you have a test user in the database.');
        return;
      }

      console.log('\n2. Checking login response fields...');
      const user = loginData.user;
      console.log('User fields returned by login:', Object.keys(user));

      // Check if profile fields are present
      const expectedFields = ['profile_picture_url', 'bio', 'location', 'region', 'phone'];
      const missingFields = expectedFields.filter(field => !(field in user));

      if (missingFields.length === 0) {
        console.log('✅ SUCCESS: All profile fields are present in login response!');
      } else {
        console.log('❌ FAILURE: Missing profile fields:', missingFields);
      }

      return;
    }

    const { user: registeredUser, token } = registerData;

    console.log('\n2. Checking registration response fields...');
    console.log('User fields returned by registration:', Object.keys(registeredUser));

    // Step 2: Update profile with additional data
    console.log('\n3. Updating profile...');
    const updateResponse = await fetch(`${API_BASE_URL}/auth/profile`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        firstName: 'Updated',
        lastName: 'Name',
        bio: 'Updated bio for testing',
        location: 'Updated City',
        region: 'Updated Region',
        profilePictureUrl: 'https://example.com/photo.jpg',
        phone: '+1234567890'
      }),
    });

    const updateData = await updateResponse.json();
    console.log('Profile update response:', updateData);

    // Step 3: Login again to check if updates persist
    console.log('\n4. Logging in again to check persistence...');
    const loginResponse = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: registeredUser.email,
        password: 'password123',
      }),
    });

    const loginData = await loginResponse.json();
    console.log('Login response after profile update:', loginData);

    if (!loginResponse.ok) {
      console.log('❌ FAILURE: Login failed after profile update');
      return;
    }

    const loggedInUser = loginData.user;
    console.log('\n5. Checking if profile updates persisted...');

    // Check if updated fields are present
    const checks = [
      { field: 'first_name', expected: 'Updated', actual: loggedInUser.first_name },
      { field: 'last_name', expected: 'Name', actual: loggedInUser.last_name },
      { field: 'bio', expected: 'Updated bio for testing', actual: loggedInUser.bio },
      { field: 'location', expected: 'Updated City', actual: loggedInUser.location },
      { field: 'region', expected: 'Updated Region', actual: loggedInUser.region },
      { field: 'profile_picture_url', expected: 'https://example.com/photo.jpg', actual: loggedInUser.profile_picture_url },
      { field: 'phone', expected: '+1234567890', actual: loggedInUser.phone },
    ];

    let allPassed = true;
    checks.forEach(check => {
      if (check.actual === check.expected) {
        console.log(`✅ ${check.field}: "${check.actual}"`);
      } else {
        console.log(`❌ ${check.field}: expected "${check.expected}", got "${check.actual}"`);
        allPassed = false;
      }
    });

    if (allPassed) {
      console.log('\n🎉 SUCCESS: Profile persistence fix is working! All profile updates are maintained after logout/login.');
    } else {
      console.log('\n❌ FAILURE: Some profile updates did not persist.');
    }

  } catch (error) {
    console.error('Test failed with error:', error);
  }
}

testProfilePersistence();
