const API_URL = 
  window.location.hostname === 'localhost'
    ? ''
    : import.meta.env.API_URL;

export async function logout() {
  try {
    const res = await fetch(API_URL + '/api/auth/logout/')
    window.location.href = '/'
  } catch {
    console.log('failed to log out', err)
  }
}