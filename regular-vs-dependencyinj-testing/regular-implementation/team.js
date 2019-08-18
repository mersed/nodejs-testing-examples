const User = require('./user');

function getTeam(teamId) {
  return User.find({teamId: teamId});
}

module.exports.getTeam = getTeam;