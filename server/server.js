Accounts.validateNewUser(function(user) {
  if (!user.username) {
    throw new Meteor.Error(-1, "Username required");
  } else if (user.username === "anonymous") {
    throw new Meteor.Error(-2, "Invalid username");
  }
  return true;
});

/**
 * Add our data on user creation.
 */
Accounts.onCreateUser(function(options, user) {
  user.isAdmin = false;
  user.pastas = [];
  return user;
});

/**
 * Publish the isAdmin field to client.
 */
Meteor.publish("userData", function () {
  if (this.userId) {
    return Meteor.users.find({_id: this.userId}, {fields: {'isAdmin': 1}});
  } else {
    this.ready();
  }
});
