// ############################
// ## Accounts Configuration ##
// ############################

Accounts.config({
    sendVerificationEmail: false,
    loginExpirationInDays: null
});

// ###################################
// ## Initial Administrator Account ##
// ###################################

// Change settings in the settings.json file

// Global main admin name
adminUserName = Meteor.settings.adminAccount.username;

// Create global main admin
Meteor.users.remove({"username": Meteor.settings.adminAccount.username});
Accounts.createUser({
  username: Meteor.settings.adminAccount.username,
  email: Meteor.settings.adminAccount.email,
  password: Meteor.settings.adminAccount.password,
  isAdmin: true,
  pastas: []
});

// Add our custom data to the global main admin
Meteor.users.update(
  {username: Meteor.settings.adminAccount.username},
  {$set: {
    isAdmin: true,
    pastas: []
  }}
);
