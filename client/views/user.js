var domain = Meteor.absoluteUrl();
var getUserName = function() {
  return Session.get("user_content.username");
};

var appendPasta = function(pasta) {
  var data = {
    shortUrl: pasta.url,
    rootUrl: domain,
    title: pasta.title,
    type: pasta.type
  };
  UI.insert(UI.renderWithData(Template.oneline_pasta, data), $("#oneline-pasta-container")[0]);
};

var clearPastas = function() {
  $("#oneline-pasta-container").children().remove();
};

var updatePastas = function(username) {
  Meteor.call("getPastasForUser", username, function(error, result) {
    clearPastas();
    if (result) {
      if (result.length == 0) {
        Modals.showMessage({
          title: "No Pastas!",
          text: username === "anonymous" ? "There is no anonymous Pasta." : "The user '" + username + "' has no Pasta.",
          clazz: "error"
        });
      } else {
        result.forEach(function(pasta) {
          appendPasta(pasta);
        });
      }
    } else {
      Modals.showError(error, "/");
    }
  });
};

Template.user_content.rendered = function() {
  Session.set("user_content.username", this.data);
  Deps.autorun(function() {
    updatePastas(getUserName());
  });
};

Template.oneline_pasta.events({
  "click .view-button": function(event) {
    var shortUrl = $(event.currentTarget).parents("tr").get(0).id;
    Router.go("/pasta/" + shortUrl);
  },
  
  "click .edit-button": function(event) {
    var shortUrl = $(event.currentTarget).parents("tr").get(0).id;
    Router.go("/edit/" + shortUrl);
  },
  
  "click .delete-button": function(event) {
    var shortUrl = $(event.currentTarget).parents("tr").get(0).id;
    var pastaType = $(event.currentTarget).parents("tr").children("td")[1].innerText;
    var confirmMessage = "Do you really want to delete this Pasta?";
    if (pastaType === "MULTI") {
      confirmMessage += " This is a MULTI-Pasta. This will remove ALL of its sub-Pastas."
    }
    Modals.showConfirm({
      title: "Are you sure?",
      text: confirmMessage,
      onApprove: function() {
        Modals.showLoading("Killing Pasta '" + shortUrl + "'...");
        Meteor.call("killPasta", shortUrl, function(error, result) {
          Meteor.setTimeout(function() {
            if (error) {
              Modals.showError(error);
            } else {
              Modals.showSuccess({
                title: "Pasta killed!",
                text: "You successfully killed the pasta '" + shortUrl + "'. Congrats."
              });
              updatePastas(getUserName());
            }
            Modals.hideLoading();
          }, 500);
        });
      }
    });
  }
});
