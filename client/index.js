// Require new users to provide both an username and an email
Accounts.ui.config({
  passwordSignupFields: "USERNAME_AND_EMAIL"
});

Meteor.startup(function(){
  Hooks.init();
});

Hooks.onLoggedOut = function() {
  Router.go("/");
};

Meteor.subscribe("userData");