var appendUser = function(user) {
  var data = {
    isAdmin: user.isAdmin,
    username: user.username,
  };
  UI.insert(UI.renderWithData(Template.oneline_user, data), $("#oneline-user-container")[0]);
};

var clearUsers = function() {
  $("#oneline-user-container").children().remove();
};

var updateUsers = function() {
  Meteor.call("getUsers", this.data, function(error, result) {
    clearUsers();
    if (result) {
      UI.insert(UI.render(Template.anonymous_user), $("#oneline-user-container")[0]);
      $("#buttons-container").children().remove();
      UI.insert(UI.render(Template.admin_buttons), $("#buttons-container")[0]);
      result.forEach(function(user) {
        appendUser(user);
      });
    } else {
      Modals.showError(error, "/");
    }
  });
};

Template.admin_content.rendered = function() {
  updateUsers();
};

Template.admin_content.events({
  "click #clear-all": function(event) {
    Modals.showConfirm({
      title: "Are you sure ?",
      text: "Do you REALLY want to clear the database?",
      onApprove: function() {

        Modals.showConfirm({
          title: "Are you really, like, really sure?",
          text: "This is an irreversible and terribly damaging operation! All pastas will be gone forever, all users will be killed, and penguins will cry.",
          onApprove: function() {
        
            Modals.showLoading("Clearing Database...");
            Meteor.call("clearAll", function(error, result) {
              Meteor.setTimeout(function() {
                if (error) {
                  Modals.showError(error);
                } else {
                  Modals.showSuccess({
                    title: "Database Cleared!",
                    text: "You've successfuly emptied the database. Congrats."
                  });
                  updateUsers();
                }
                Modals.hideLoading();
              }, 500); // timeout
            }); // call clearAll
          } // onApprove 2
        }); // showConfirm 2
      } // onApprove 1
    }); // showConfirm 1
  },

  "click #clear-pastas": function(event) {
    Modals.showConfirm({
      title: "Are you sure ?",
      text: "Do you REALLY want to remove all pastas?",
      onApprove: function() {
        Modals.showLoading("Clearing Pastas...");
        Meteor.call("clearPastas", function(error, result) {
          Meteor.setTimeout(function() {
            if (error) {
              Modals.showError(error);
            } else {
              Modals.showSuccess({
                title: "Pastas Cleared!", 
                text: "You've successfuly deleted "+result+" Pastas. Congrats."
              });
              updateUsers();
            }
            Modals.hideLoading();
          }, 500); // timeout
        }); // call clearPastas
      } // onApprove
    }); // showConfirm
  },

  "click #kill-users": function(event) {
    Modals.showConfirm({
      title: "Are you sure?",
      text: "Do you REALLY want to kill all your users?",
      onApprove: function() {
        Modals.showLoading("Clearing Users...");
        Meteor.call("clearUsers", function(error, result) {
          Meteor.setTimeout(function() {
            if (error) {
              Modals.showError(error);
            } else {
              Modals.showSuccess({
                title: "Users killed!",
                text:  "You've successfuly killed "+result+" Users. Congrats."
              });
              updateUsers();
            }
            Modals.hideLoading();
          }, 500); // timeout
        }); // call clearUsers
      } // onApprove
    }); // showConfirm
  },

  "click .kill-user": function(event) {
    var button = $(event.currentTarget);
    var username = button.parents("tr").attr("id");
    Modals.showConfirm({
      title: "Are you sure?",
      text: "Do you really want to kill " + username + "?",
      onApprove: function() {
        Modals.showLoading("Killing User " + username + "...");
        Meteor.call("killUser", username, function(error, result) {
          Meteor.setTimeout(function() {
            if (error) {
              Modals.showError(error);
            } else {
              Modals.showSuccess({
                title: "User killed!",
                text: "You successfully killed " + username +". Congrats."
              });
              updateUsers();
            }
            Modals.hideLoading();
          }, 500); // timeout
        }); // call killUser
      } // onApprove
    }); // showConfirm
  },

  "click .clear-user-pastas": function(event) {
    var button = $(event.currentTarget);
    var username = button.parents("tr").attr("id");
    Modals.showConfirm({
      title: "Are you sure?",
      text: "Do you really want to delete all of " + username + "'s pastas?",
      onApprove: function() {
        Modals.showLoading("Killing "+username+"'s pastas...");
        Meteor.call("clearUserPastas", username, function(error, result) {
          Meteor.setTimeout(function() {
            if (error) {
              Modals.showError(error);
            } else {
              Modals.showSuccess({
                title:"Pasta killed!",
                text:  "You successfully cleared " + username + "'s pastas. Congrats."
              });
              updateUsers();
            }
            Modals.hideLoading();
          }, 500);
        });
      }
    });
  },

  "click .view-user": function(event) {
    Router.go("/user/" + $(event.currentTarget).parents("tr").attr("id"));
  },
  
  "click .toggle-admin": function(event) {
    var tr = $(event.currentTarget).parents("tr");
    var username = tr.attr("id");
    if (tr.hasClass("positive")) {
      Modals.showLoading("Revoking user's admin rights...");
      Meteor.call("relegateAdmin", username, function(error, result) {
        Meteor.setTimeout(function() {
          if (error) {
            Modals.showError(error);
          } else {
            Modals.showSuccess({
              title: "User rights revoked",
              text: username + " is no longer an administrator."
            });
            updateUsers();
          }
          Modals.hideLoading();
        }, 500);
      });
    } else {
      Modals.showLoading("Promoting user to admin level...");
      Meteor.call("promoteUser", username, function(error, result) {
        Meteor.setTimeout(function() {
          if (error) {
            Modals.showError(error);
          } else {
            Modals.showSuccess({
              title: "User promoted",
              text: username + " is now an administrator."
            });
            updateUsers();
          }
          Modals.hideLoading();
        }, 500);
      });
    }
  },
  
  "click #stubs-create": function(event) {
    Modals.showLoading("Creating stubs...");
      Meteor.call("createStubs", function(error, result) {
        Meteor.setTimeout(function() {
          if (error) {
            Modals.showError(error);
          } else {
            Modals.showSuccess({
              title: "Stubs created!",
              text: "Created some users and some pastas."
            });
            updateUsers();
          }
          Modals.hideLoading();
        }, 500);
      });
  },
  
  "click #stubs-destroy": function(event) {
    Modals.showLoading("Destroying stubs...");
      Meteor.call("destroyStubs", function(error, result) {
        Meteor.setTimeout(function() {
          if (error) {
            Modals.showError(error);
          } else {
            Modals.showSuccess({
              title: "Stubs destroyed!",
              text: "Destroyed some users and some pastas."
            });
            updateUsers();
          }
          Modals.hideLoading();
        }, 500);
      });
  }
});
