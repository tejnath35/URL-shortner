export function readStoredUser() {
  try {
    const rawUser = localStorage.getItem('user');
    if (!rawUser) return {};

    const parsed = JSON.parse(rawUser);
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch {
    console.warn('Invalid stored user data, clearing it.');
    localStorage.removeItem('user');
    return {};
  }
}
