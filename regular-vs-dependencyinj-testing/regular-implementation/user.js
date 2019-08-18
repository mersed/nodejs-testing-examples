class User {

  // Simulating database call
  static find(teamId) {
    return Promise.resolve([511, 25]);
  }
}

module.exports = User;