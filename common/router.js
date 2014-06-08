/**
 * This file contains all the routes for the application.
 */
Router.map(function() {
  
  // ################## //
  // ## Client pages ## //
  // ################## //
  
  /**
   * Main page.
   * Where users paste things.
   */
  this.route("main", {path: "/"});

  /**
   * /edit/:pid page.
   * Where an user can edit its own pastas and an admin can edit any user's pastas.
   */
  this.route("edit", {
    path: "/edit/:pid",
    data: function() { return this.params.pid; }
  });

  /**
   * /pasta/:pid page.
   * Where users see pastas' descriptions.
   */
  this.route("pasta", {
    path: "/pasta/:pid",
    data: function() { return this.params.pid; },
    onData: function() {
      Session.set("pasta_content.pid", this.params.pid);
    }
  });

  /**
   * /debug page.
   * Where everybody can see the content of the database (!).
   */
  this.route("debug", {path: "/debug"});

  /**
   * /user/:username page.
   * Where an user can see its own pastas and an admin can see any user's pastas.
   */
  this.route("user", {
    path: "/user/:username",
    data: function() { return this.params.username; },
    onData: function() {
      Session.set("user_content.username", this.params.username);
    }
  });

  /**
   * /admin page.
   * Where an admin can list, view and edit users.
   */
  this.route("admin", {path: "/admin"});
  
  // #################### //
  // ## Other requests ## //
  // #################### //

  /**
   * Entry point for shortUrl GETs.
   * Redirects to the correct place:
   *   - the shortened URL for URL type Pastas ;
   *   - the /pasta/:pid page for other types of Pastas.
   */
  this.route("getAll", {
    path: "/:pid",
    where: "server",
    action: function() {
      var pid = this.params.pid;
      var pasta = Pastas.findOne({url: pid});
      if (isDefined(pasta)) {
        if (pasta.type == "URL") {
          this.response.writeHead(301, {"Location": pasta.data});
          this.response.end();
        } else {
          this.response.writeHead(301, {"Location": "/pasta/" + pid});
          this.response.end();
        }
        Pasta.updateLastAccessDate(pid);
      } else {
        this.response.writeHead(404, {"Content-Type": "text/html"});
        this.response.end("Not Found!");
      }
    }
  });

  /**
   * Used to access a Pasta without the need of JavaScript.
   * Note: doesn't work for MULTI Pastas.
   */
  this.route("getRaw", {
    path: "/raw/:pid",
    where: "server",
    action: function() {
      var pid = this.params.pid;
      var pasta = Pastas.findOne({url: pid});
      if (isDefined(pasta)) {
        Pasta.updateLastAccessDate(pid);
        pasta.sendRaw(this.reponse);
      } else {
        this.response.writeHead(404, {"Content-Type": "text/html"});
        this.response.end("Not found: " + pid);
      }
    }
  });

  /**
   * One of the methods of the future REST API.
   * Returns a Pasta as a Json string.
   */
  this.route("getRawJson", {
    path: "/api/:pid",
    where: "server",
    action: function() {
      var pid = this.params.pid;
      var pasta = Pastas.findOne({url: pid});
      if (isDefined(pasta)) {
        Pasta.updateLastAccessDate(pasta.url);
        this.response.writeHead(200, {"Content-Type": "application/json"});
        this.response.end(JSON.stringify(pasta));
      } else {
        this.response.writeHead(404, {"Content-Type": "application/json"});
        this.response.end(JSON.stringify({"result": "Not found!", "pid": pid}));
      }
    }
  });
});
