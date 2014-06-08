Modals = {};

// Settings
var resetSettings = function() {
  $("#loading-modal").modal("setting", {
    "closable": false,
    "duration": 250
  });
  $("#confirm-modal").modal("setting", {
    "transition": "scale",
    "closable": false,
    "duration": 300
  });
  $("#success-modal").modal("setting", {
    "transition": "scale",
    "closable": true,
    "duration": 300
  });
  $("#error-modal").modal("setting", {
    "transition": "scale",
    "closable": true,
    "duration": 300
  });
};
Template.modals.rendered = function() {
  resetSettings();
};


// Static methods to show and hide various Modals

/**
 * Show loading modal.
 *
 * @param text the text to show under the loading icon
 */
Modals.showLoading = function(text) {
  resetSettings();
  $("#loading-modal-text").text(text);
  $("#loading-modal").modal("show");
};

/**
 * Hide loading modal.
 */
Modals.hideLoading = function() {
  $("#loading-modal").modal("hide");
};

/**
 * Show success modal.
 *
 * @param args the arguments:
 *   @param title the title
 *   @param text the text
 *   @param redirect the local path to redirect to (optional)
 */
Modals.showSuccess = function(args) {
  resetSettings();
  $("#success-modal-title").text(args.title);
  $("#success-modal-text").text(args.text);
  if (args.redirect) {
    $("#success-modal").modal("setting", "onHidden", function() {
      Router.go(args.redirect);
    });
  }
  $("#success-modal").modal("show");
};

/**
 * Hide success modal.
 */
Modals.hideSuccess = function() {
  $("#success-modal").modal("hide");
};

/**
 * Show confirm modal.
 *
 * @param args the arguments:
 *   @param title the title
 *   @param text the text
 *   @param redirect the local path to redirect to (optional)
 *   @param onApprove callback for the "Yes" button (optional)
 *   @param onDeny callback for the "No" button (optional)
 */
Modals.showConfirm = function(args) {
  resetSettings();
  $("#confirm-modal-title").text(args.title);
  $("#confirm-modal-text").text(args.text);
  if (args.redirect) {
    $("#confirm-modal").modal("setting", "onHidden", function() {
      Router.go(args.redirect);
    });
  }
  if (args.onApprove) {
    $("#confirm-modal").modal("setting", "onApprove", function() {
      Meteor.setTimeout(function() {
        args.onApprove();
      }, 500);
    });
  }
  if (args.onDeny) {
    Modals.hideConfirm();
    $("#confirm-modal").modal("setting", "onDeny", function() {
      Meteor.setTimeout(function() {
        args.onDeny();
      }, 500);
    });
  }
  $("#confirm-modal").modal("show");
};

/**
 * Hide confirm modal.
 */
Modals.hideConfirm = function() {
  $("#confirm-modal").modal("hide");
};

/**
 * Show error modal.
 *
 * @param error the Meteor.Error object (or an object like:
                {
                  code: 404,
                  reason: "Not Found",
                  details: "The requested resources was not found"
                }
 * @param redirect the local path to redirect to (optional)
 */
Modals.showError = function(error, redirect) {
  resetSettings();
  $("#error-modal-title").text("Error " + error.error + ": " + error.reason);
  $("#error-modal-text").text(error.details);
  if (redirect) {
    $("#error-modal").modal("setting", "onHidden", function() {
      Router.go(redirect);
    });
  }
  $("#error-modal").modal("show");
};

/**
 * Hide error modal.
 */
Modals.hideError = function() {
  $("#error-modal").modal("hide");
};

/**
 * Show message.
 *
 * @param args the arguments:
 *   @param title the title
 *   @param text the text
 *   @param clazz a/some class(es) to apply to the message (optional)
 */
Modals.showMessage = function(args) {
  Modals.resetMessage();
  $("#message-title").html(args.title);
  $("#message-text").html(args.text);
  if (args.clazz) {
    $("#message").addClass(args.clazz);
  }
  $("#message").addClass("visible");
};

/**
 * Hide message and reset content
 */
Modals.resetMessage = function() {
  $("#message").attr("class", "ui message");
  $("#message-title").text("");
  $("#message-text").text("");
};
