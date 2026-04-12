const bcrypt = require('bcryptjs');
const hash = '$2b$10$7QJ8kV4l9Yx5Gv3X8vH0WuC6pZ1zZrY0jV8c5hY8xWlR3Yx7qF6aW';
const passwords = ['admin123', 'admin', 'password', '123456', 'wvssagaon'];

passwords.forEach(pw => {
  if (bcrypt.compareSync(pw, hash)) {
    console.log(`Match found: ${pw}`);
  }
});
