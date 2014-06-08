var getPastaId = function() {
  return Session.get("pasta_content.pid");
};

var appendPasta = function(pasta) {
  var data = {
    shortUrl: Meteor.absoluteUrl() + pasta.url,
    title: isEmpty(pasta.title) || Pasta.isDefaultTitle(pasta.title, pasta.type, pasta.url) ? '' : pasta.title
  };
  switch (pasta.type) {
    case "URL":
      data.longUrl = pasta.data;
      UI.insert(UI.renderWithData(Template.pasta_url, data), $("#pasta-container")[0]);
      break;
    case "TEXT":
      data.text = pasta.data;
      UI.insert(UI.renderWithData(Template.pasta_text, data), $("#pasta-container")[0]);
      break;
    case "CODE":
      data.type = languagesPerCode[pasta.data.type];
      data.code = pasta.data.content;
      UI.insert(UI.renderWithData(Template.pasta_code, data), $("#pasta-container")[0]);
      break;
    default:
      break;
  }
};

var currentPasta,
    canEdit,
    nb;
var currentPastaDep = new Deps.Dependency,
    canEditDep = new Deps.Dependency,
    nbDep = new Deps.Dependency;

var setCurrentPasta = function(pasta) {
  currentPasta = pasta;
  currentPastaDep.changed();
};

var setCanEdit = function(value) {
  canEdit = value;
  canEditDep.changed();
};

var setNb = function(value) {
  nb = value;
  nbDep.changed();
};

var clearPasta = function() {
  $("#pasta-container").children().remove();
  Modals.resetMessage();
};

var updatePasta = function(pid) {
  Meteor.call("getPasta", pid, function(error, result) {
    clearPasta();
    if (result) {
      setCurrentPasta(result);
      Meteor.call("canEdit", pid, function(error, result) {
        setCanEdit(result);
      });
      if (result.type == "MULTI") {
        setNb(result.data.length);
        result.data.forEach(function(pid) {
          Meteor.call("getPasta", pid, function(error, result) {
            if (result) {
              appendPasta(result);
            } else {
              console.log(error);
            }
          });
        });
      } else {
        appendPasta(result);
      }
    } else {
      console.log(error);
    }
  });
};

Template.pasta.rendered = function() {
  Session.set("pasta_content.pid", this.data);
  updatePasta(getPastaId());
  Deps.autorun(function() {
    currentPastaDep.depend();
    canEditDep.depend();
    nbDep.depend();
    if (currentPasta && typeof canEdit !== "undefined") {
      if (currentPasta.type === "MULTI") {
        if (nb) {
          Modals.showMessage({
            title: "This is a Multi-Pasta and it contains " + nb + " Pastas.",
            text: canEdit === "yes" ? "You can <a href=\"/edit/" + currentPasta.url + "\">edit</a> this Pasta." : "",
            clazz: "positive"
          });
        }
      } else if (currentPasta.parent) {
        Modals.showMessage({
          title: "This is a Sub-Pasta of type " + currentPasta.type + ".",
          text: "The parent Multi-Pasta can be found <a href=\"/pasta/" + currentPasta.parent + "\">here</a>. " + (canEdit === "yes" ? "You can <a href=\"/edit/" + currentPasta.url + "\">edit</a> this Pasta." : ""),
          clazz: "positive"
        });
      } else {
        Modals.showMessage({
          title: "This is a Simple " + currentPasta.type + " Pasta.",
          text: canEdit === "yes" ? "You can <a href=\"/edit/" + currentPasta.url + "\">edit</a> this Pasta." : "",
          clazz: "positive"
        });
      }
    }
  });
};

Template.pasta_content.multi = function() {
  currentPastaDep.depend();
  return currentPasta && currentPasta.type && currentPasta.type === "MULTI";
};

Template.pasta_content.type = function() {
  currentPastaDep.depend();
  return currentPasta ? currentPasta.type : "";
};

Template.pasta_content.pid = function() {
  currentPastaDep.depend();
  return currentPasta ? currentPasta.pid : "";
};

Template.pasta_content.canEdit = function() {
  canEditDep.depend();
  return canEdit;
};

Template.pasta_content.nb = function() {
  nbDep.depend();
  return nb;
};

// Prevent backspace navigation
// Due to a bug in chrome, hitting backspace while in a
// readonly textarea navigate to the previous page
Template.pasta_text.rendered = function() {
  $("textarea").keydown(function(event) {
    if (event.keyCode == 8) {
      event.preventDefault();
    }
  });
};

/**
 * Set of events applied to all fields.
 */
var fieldEvents = {
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
      textarea.height(textarea.get(0).scrollHeight);
      textarea.addClass("extended");
      icon.removeClass("down");
      icon.addClass("up");
    }
  }
};

// Apply events to field Templates
Template.pasta_url.events(fieldEvents);
Template.pasta_text.events(fieldEvents);
Template.pasta_code.events(fieldEvents);

