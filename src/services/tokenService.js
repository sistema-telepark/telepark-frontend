export const TokenService = {
  getLocalRefreshToken() {
    const user = JSON.parse(localStorage.getItem('user'));
    return user?.refresh;
  },

  getLocalAccessToken() {
    const user = JSON.parse(localStorage.getItem('user'));
    return user?.access;
  },

  updateLocalAccessToken(token) {
    let user = JSON.parse(localStorage.getItem('user'));
    user.access = token;
    localStorage.setItem('user', JSON.stringify(user));
  },

  getUser() {
    return JSON.parse(localStorage.getItem('user'));
  },

  setUser(user) {
    console.log(JSON.stringify(user));
    localStorage.setItem('user', JSON.stringify(user));
  },

  removeUser() {
    localStorage.removeItem('user');
  },

  getUsername() {
    const user = JSON.parse(localStorage.getItem('user'));
    return user?.username;
  },

  getName() {
    const user = JSON.parse(localStorage.getItem('user'));
    return user?.name;
  },

  getRole() {
    const user = JSON.parse(localStorage.getItem('user'));
    return user?.is_superuser;
  },
};
