import fetch from 'node-fetch'; // Requires Node 18+ for native fetch

const API_URL = 'http://localhost:4000/api';

async function runE2ETest() {
  console.log('--- Start E2E Booking Test ---');
  try {
    console.log('1. Register...');
    const regRes = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'testcustomer@motowash.com',
        password: 'Password@123',
        fullName: 'Test Customer',
        phone: '0812345678'
      })
    });
    console.log('Register:', regRes.status);

    console.log('2. Login...');
    const loginRes = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'testcustomer@motowash.com',
        password: 'Password@123'
      })
    });
    const cookie = loginRes.headers.get('set-cookie') || '';
    console.log('Login:', loginRes.status);

    console.log('3. Fetch Services...');
    const svcRes = await fetch(`${API_URL}/services`);
    const svcs = await svcRes.json();
    console.log('Services:', svcs?.data?.length || 0);

    console.log('--- Setup complete. Requires DB for full run. ---');
  } catch (error) {
    console.error('Failed:', error);
  }
}

runE2ETest();
