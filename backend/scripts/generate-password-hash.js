const bcrypt = require('bcryptjs');

const tempPassword = 'TempPass123!';

// Generate salt and hash
bcrypt.genSalt(10)
  .then(salt => bcrypt.hash(tempPassword, salt))
  .then(hash => {
    console.log('Temporary password:', tempPassword);
    console.log('Hashed password:', hash);
  })
  .catch(console.error); 