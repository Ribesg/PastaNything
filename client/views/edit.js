/**
 * Store domain name for further usage.
 */
var domain = Meteor.absoluteUrl();

/**
 * Function to add a form for a single Pasta
 */
var appendPasta = function(pasta) {
  var data = {
    rootUrl: domain,
    shortUrl: pasta.url,
    type: pasta.type,
    title: pasta.title
  };
  switch (pasta.type) {
    case "URL":
      data.longUrl = pasta.data;
      UI.insert(UI.renderWithData(Template.edit_url, data), $("#edit-container")[0]);
      break;
    case "TEXT":
      data.text = pasta.data;
      UI.insert(UI.renderWithData(Template.edit_text, data), $("#edit-container")[0]);
      break;
    case "CODE":
      data.type_name = languagesPerCode[pasta.data.type];
      data.code = pasta.data.content;
      UI.insert(UI.renderWithData(Template.edit_code, data), $("#edit-container")[0]);
      break;
    default:
      break;
  }
};

/**
 * Checks that the shortUrl input content is valid.
 */
var checkShortUrl = function(input) {
  var result = input;
  if (input.indexOf(domain) !== 0) {
    if (input.indexOf(domain.substring(0, domain.length - 1)) !== 0) {
      var lastSlashIndex = input.lastIndexOf("/");
      if (lastSlashIndex !== -1 && input.charAt(lastSlashIndex - 1) !== "/" && input.charAt(lastSlashIndex - 1) !== ":") {
        result = domain + input.substring(lastSlashIndex + 1, input.length);
      } else {
        result = "placeholder";
      }
    } else {
      result = input.substring(0, domain.length - 1) + "/" + input.substring(domain.length - 1, input.length);
    }
  }
  return result;
};

/**
 * Set of events applied to all fields.
 */
var fieldEvents = {
  // Select the "code" part of the shortUrl on focus and add a loading icon
  "focus .shorturl-input": function(event) {
    var input = $(event.currentTarget);
    var value = input.val();
    if (value.length > domain.length) {
      Meteor.setTimeout(function(){
        input.get(0).selectionStart = domain.length;
        input.get(0).selectionEnd = value.length;
      }, 2);
    }
    var icon = input.parent().children("i");
    icon.removeClass("green checkmark red ban circle");
    icon.addClass("loading");
  },

  // Check the shortUrl's syntax when modified
  "keyup .shorturl-input": function(event) {
    var input = $(event.currentTarget);
    var current = input.val();
    var checked = checkShortUrl(current);
    if (current !== checked) {
      if (checked === "placeholder") {
        input.val($(input).attr("placeholder"));
      } else {
        input.val(checked);
      }
    }
    var value = input.val();
    if (value.length >= domain.length + 4 && isValidShortUrl(value.substring(domain.length, value.length))) {
      input.parents(".field").removeClass("error");
      input.parents(".form").find(".save-button").removeClass("disabled");
    } else {
      input.parents(".field").addClass("error");
      input.parents(".form").find(".save-button").addClass("disabled");
    }
  },

  // Check the shortUrl's availability on focus loss
  "blur .shorturl-input": function(event) {
    var input = $(event.currentTarget);
    var newShortUrl = input.val().substring(domain.length, input.val().length);
    var icon = input.parent().children("i");
    if (this.shortUrl !== newShortUrl && !input.parents(".field").hasClass("error")) {
      Meteor.call("checkAvailability", newShortUrl, function(error, result) {
        icon.removeClass("loading");
        if (result) {
          icon.addClass("green checkmark");
          input.parents(".field").removeClass("error");
          input.parents(".form").find(".save-button").removeClass("disabled");
        } else {
          icon.addClass("red ban circle");
          input.parents(".field").addClass("error");
          input.parents(".form").find(".save-button").addClass("disabled");
        }
      });
    } else if (input.parents(".field").hasClass("error")) {
      icon.removeClass("loading");
      icon.addClass("red ban circle");
    } else {
      icon.removeClass("loading");
      icon.addClass("green checkmark");
      input.parents(".field").removeClass("error");
      input.parents(".form").find(".save-button").removeClass("disabled");
    }
  },

  // Save the modifications on click on the save button
  "click .save-button": function(event) {
    if (isButtonDisabled(event)) return;
    Modals.showLoading("Saving...");
    var form = $(event.currentTarget).parents(".form");
    var oldShortUrl = this.shortUrl;
    var newShortUrl = form.find(".shorturl-input").val().substring(domain.length);
    var newTitle = form.find(".title-input").val();
    var newData;
    switch(this.type) {
      case "URL":
      case "TEXT":
        newData = form.find(".content-input").val();
        break;
      case "CODE":
        newData = {
          "type": languagesPerName[form.find(".type-input").val()],
          "content": form.find(".content-input").val()
        };
        break;
      // case "IMG"
      default:
        break;
    }
    Meteor.call("save", oldShortUrl, newShortUrl, newTitle, newData, function(error, result) {
      Meteor.setTimeout(function() {
        if (error) {
          Modals.showError(error);
        } else {
          Modals.showSuccess({
            title: "Success!",
            text: "Changes saved successfully."
          });
        }
        Modals.hideLoading();
      }, 300);
    });
  },

  // Extend/collapse textareas when clicking on label
  "click .clickable-label": function(event) {
    var clicked = $(event.currentTarget);
    var textarea = clicked.next();
    var icon = clicked.children("i");
    if (textarea.hasClass("extended")) {
      textarea.css("height", "12em");
      textarea.removeClass("extended");
      icon.removeClass("up");
      icon.addClass("down");
    } else {
      console.log(textarea.get(0).scrollHeight);
      textarea.height(textarea.get(0).scrollHeight);
      textarea.addClass("extended");
      icon.removeClass("down");
      icon.addClass("up");
    }
  }
};

// Apply events to field Templates
Template.edit_url.events(fieldEvents);
Template.edit_text.events(fieldEvents);
Template.edit_code.events(fieldEvents);

Template.edit.rendered = function() {
  var id = this.data;
  Meteor.call("getPasta", id, true, function(error, result) {
    if (result) {
      if (result.type == "MULTI") {
        result.data.forEach(function(pid) {
          Meteor.call("getPasta", pid, true, function(error, result) {
            if (result) {
              appendPasta(result);
            } else {
              Modals.showError(error);
            }
          });
        });
      } else {
        appendPasta(result);
      }
    } else {
      Modals.showError(error, "/");
    }
  });
};

Template.edit_code.languages = function() {
  return languages;
};

Template.edit_code.typeName = function() {
  return languagesPerCode[this.type];
};
