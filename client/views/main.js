// Constants
var field = {
  "url": Template.field_url,
  "text": Template.field_text,
  "code": Template.field_code,
  "img": Template.field_image
};

// Functions
var onRemoveButton = function(event) {
  if (isButtonDisabled(event)) return;
  $(this).parents(".form").remove();
  if ($("#superform .form").length == 0) {
    $("#bottom-button-bar").remove();
    $(".clear-button").addClass("disabled");
    $(".pasta-button").addClass("disabled");
    Header.expand();
  } else {
    checkInputs();
  }
};

var onClearButton = function(event) {
  if (isButtonDisabled(event)) return;
  $(".form").remove();
  $("#bottom-button-bar").remove();
  $(".clear-button").addClass("disabled");
  $(".pasta-button").addClass("disabled");
  Header.expand();
};

var onAddButton = function(event) {
  if (isButtonDisabled(event)) return;
  if ($("#superform .form").length == 0) {
    UI.insert(UI.render(Template.bottom_button_bar), $("#superform")[0]);
    Header.collapse();
  }
  if ($(event.currentTarget).parents("#top-button-bar").length != 0) {
    UI.insert(UI.render(field[getButtonId(event)]), $("#superform")[0], $("#top-button-bar + *")[0]);
  } else {
    UI.insert(UI.render(field[getButtonId(event)]), $("#superform")[0], $("#bottom-button-bar")[0]);
  }
  $(".remove-button").off("click").on("click", onRemoveButton);
  $("input")
    .off("change").on("change", checkInputs)
    .off("keyup").on("keyup", checkInputs)
    .off("click").on("click", checkInputs);
  $("textarea")
    .off("change").on("change", checkInputs)
    .off("keyup").on("keyup", checkInputs)
    .off("click").on("click", checkInputs);
  $(".clear-button").removeClass("disabled");
  checkInputs();
};

var onPastaButton = function(event) {
  if (isButtonDisabled(event)) return;
  $(".pasta-button").addClass("disabled");
  $("#loading").addClass("active");
  var toPaste = [];
  $(".form").each(function(index, elem) {
    var jqelem = $(elem);
    var content = jqelem.find(".field-input").val();
    if (!isEmpty(content)) { // should always be
      if (jqelem.hasClass("url")) {
        toPaste.push({"type": "URL", "url": content});
      } else if (jqelem.hasClass("text")) {
        toPaste.push({"type": "TEXT", "text": content});
      } else if (jqelem.hasClass("code")) {
        var type = jqelem.find(".type-input").val();
        var typeCode = languagesPerName[type];
        if (!type || !typeCode) {
          // TODO ?
          console.log("Unknown type: " + type);
        } else {
          toPaste.push({"type": "CODE", "code": content, "code_type": typeCode});
        }
      } // TODO else if image
    }
  });
  Meteor.call("paste", toPaste, function(error, result) {
    if (result) {
      Router.go("pasta", {"pid": result});
    } else {
      // TODO No error to handle yet?
    }
  });
};

var checkInputs = function() {
  var ok = true;
  var inputs = $(".field-input");
  inputs.each(function(i, input) {
    var jqinput = $(input);
    if (isEmpty(input.value)) {
      ok = false;
      errorInput(jqinput, true);
    } else if (jqinput.parents(".form").hasClass("url")) {
      ok = checkUrlInput(jqinput);
    } else {
      errorInput(jqinput, false);
    }
  });
  $(".type-input").each(function(i, input) {
    var jqInput = $(input);
    if (jqInput.val()) {
      errorInput(jqInput, false);
    } else {
      ok = false;
      errorInput(jqInput, true);
    }
  });
  if (!ok) {
    $(".pasta-button").addClass("disabled");
  } else {
    $(".pasta-button").removeClass("disabled");
  }
};

Template.button_bar.events = {
  "click .clear-button": onClearButton,
  "click .pasta-button": onPastaButton,
  "click .add-buttons > .button": onAddButton
};

Template.button_bar.rendered = function() {
  $(".img.button").popup({
    "position": "right center",
    "content": "Soon!"
  });
};

Template.field_code.languages = function() {
  return languages;
};

Template.field_code.default_type_name = function() {
  return "Java";
};

var checkUrlInput = function(input) {
    if (isUrl(input.val())) {
        errorInput(input, false);
        return true;
    } else {
        errorInput(input, true);
        return false;
    }
}

// Tool
var getButtonId = function(clickEvent) {
  return $(clickEvent.currentTarget).attr("type");
};

var errorInput = function(input, state) {
  var parents = input.parents(".field");
  if (state) {
    parents.addClass("error");
  } else {
    parents.removeClass("error");
  }
};
