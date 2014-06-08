Header = {};

Header.isCollapsed = function() {
  return $("#header").hasClass("collapsed");
}

Header.collapse = function() {
  if (!Header.isCollapsed()) {
    $("#header").addClass("collapsed");
    return true;
  } else {
    return false;
  }
}

Header.expand = function() {
  if (Header.isCollapsed()) {
    $("#header").removeClass("collapsed");
    return true;
  } else {
    return false;
  }
}

Header.toggle = function() {
  if (Header.isCollapsed()) {
    return Header.expand();
  } else {
    return Header.collapse();
  }
}

var myAccountButtonEvent = {
  "click #home-button": function(event) {
    var name = Meteor.user().username;
    Router.go("/user/" + name, {username: name});
  },

  "click #admin-button": function(event) {
    Router.go("/admin");
  }
};
Template.header.events(myAccountButtonEvent);
Template.smallHeader.events(myAccountButtonEvent);

Template.smallHeader.isAdmin = Template.header.isAdmin = function() {
  return Meteor.user() && Meteor.user().isAdmin;
};

Template.smallHeader.rendered = Template.header.rendered = function() {
  Deps.autorun(function() {
    if (Meteor.user()) {
      $("#header-buttons").show();
    } else {
      $("#header-buttons").hide();
    }
  });
}