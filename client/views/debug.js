Meteor.call("debug_get_users", function(err, res) {
  Session.set("debug_get_users_result", res);
});

Template.debug_content.users = function() {
  return Session.get("debug_get_users_result");
};

Meteor.call("debug_get_pastas", function(err, res) {
  Session.set("debug_get_pastas_result", res);
});

Template.debug_content.pastas = function() {
  return Session.get("debug_get_pastas_result");
};

Template.debug_content.events({
  "click #wipe-button": function(event) {
    Meteor.call("wipe");
  }
});