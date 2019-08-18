class Team {
  constructor(options) {
    this.options = options;
  }

  getTeam(teamId) {
    return this.options.User.find({teamId: teamId});
  }
}

module.exports = Team;