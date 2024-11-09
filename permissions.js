// permissions.js

// Define your privileged users (can be bot owners or admins)
const privilegedUsers = [
  "380719896624889856", // Bot owner
  // You can add more user IDs here in the future
];

module.exports = {
  isPrivilegedUser: (userId) => privilegedUsers.includes(userId),
};
