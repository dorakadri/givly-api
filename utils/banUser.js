const banUser = (user) => {
  if (user?.isBannned) {
    throw new Error(`Access Denied ${user?.firstName} is banned`);
  }
};

module.exports = banUser;
