
import { API_URL } from '../config/config.js';


export async function logout() {
  try {
    const res = await fetch(API_URL + '/api/auth/logout/', { credentials: 'include' });
    if (res.ok) {
      window.location.href = '/'; 
    } else {
      console.error('Logout failed:', await res.text());
    }
  } catch {
    console.log('failed to log out', err);
  }
}