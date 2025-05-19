// src/api/auth.js
export const mockLogin = (username, password) => {
    return new Promise((resolve, reject) => {
      if (username === 'user' && password === 'password') {
        resolve({ username });
      } else {
        reject('Invalid credentials');
      }
    });
  };
  