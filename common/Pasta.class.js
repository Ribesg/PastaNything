/**
 * This array represents the Enum of Pasta types.
 */
var TYPES = [
  "TEXT",
  "CODE",
  "URL",
  "IMG",
  "MULTI"
];

/**
 * Class Pasta
 *
 * Arguments:
 * - String title  - The Pasta's title/name
 * - String paster - The Paster's id
 * - String parent - The Pasta's parent MULTI-type pasta, if any
 * - Enum   type   - The Pasta's type, one of TYPES
 * - String url    - The Pasta's short URL code
 * - String data   - The Pasta's data, defined as follow:
 *
 *     TEXT  -> data         - the plain text
 *     CODE  -> data.type    - the code's language
 *              data.content - the code as plain text
 *     URL   -> data         - the shorten URL
 *     IMG   -> data.type    - the image's type (jpg, png, ...)
 *              data.content - the image data
 *     MULTI -> data         - an array of Pasta
 */
Pasta = function(args) {
  if (!isObject(args)) {
    throw new Error("args should be defined");
  };
  
  var title = args.title,
      paster = args.paster,
      parent = args.parent,
      type = args.type,
      url = args.url,
      data = args.data,
      creationDate = args.creationDate,
      lastAccessDate = args.lastAccessDate;

  if (!isString(paster)) {
    throw new Error("Pasta.paster has to be a String");
  } else if (!isString(type)) {
    throw new Error("Pasta.type has to be a String");
  } else if (TYPES.indexOf(type) < 0) {
    throw new Error("Pasta.type has to be one of TYPES");
  } else if (!isString(url)) {
    throw new Error("Pasta.url has to be a String");
  } else if (isEmpty(data)) {
    throw new Error("Pasta.data can't be undefined / null / empty");
  } else if (!isDate(creationDate)) {
    throw new Error("creationDate should be provided");
  } else if (!isDate(lastAccessDate)) {
    throw new Error("lastAccessDate should be provided");
  };
  this.title = title || type + "_" + url;
  this.paster = paster;
  this.parent = parent;
  this.type = type;
  this.url = url;
  this.data = data;
  this.creationDate = creationDate;
  this.lastAccessDate = lastAccessDate;
};

/**
 * Generate a default title for a Pasta.
 */
Pasta.generateDefaultTitle = function(type, shortUrl) {
  return type + "_" + shortUrl;
};

/**
 * Checks if a String is the default title of a Pasta.
 */
Pasta.isDefaultTitle = function(title, type, shortUrl) {
  return title === Pasta.generateDefaultTitle(type, shortUrl);
};

if (Meteor.isServer) {
  // Following methods are defined only on the Server.

  /**
   * Sends a HTTP response with raw Pasta content.
   */
  Pasta.prototype.sendRaw = function(response) {
    this.lastAccessDate = new Date();
    switch (this.type) {
      case "TEXT":
      case "CODE":
        response.writeHead(200, {"Content-Type": "text/plain"});
        response.end(this.data.content);
        break;
      case "URL":
        response.writeHead(301, {"Location": this.data});
        response.end();
        break;
      /*
      case "IMG":
        response.writeHead(200, {"Content-Type": "image/" + this.data.type});
        response.end(this.data.content);
        break;
      */
      case "MULTI":
        response.writeHead(400, {"Content-Type": "text/plain"});
        response.end("Bad Request - You can't get raw MULTI Pastas");
        break;
      default:
        response.writeHead(400, {"Content-Type": "text/plain"});
        response.end("Bad Request - Unknown type '" + this.type + "'");
        break;
    };
  };

  /**
   * Checks if a Meteor User can modify a Pasta, given its shortUrl.
   */
  Pasta.canEdit = function(user, shortUrl) {
    return user && (user.isAdmin || user.pastas.indexOf(shortUrl) > -1);
  };

  /**
   * Update lastAccessDate of a Pasta
   */
  Pasta.updateLastAccessDate = function(id) {
    Pastas.update({url: id}, {$set: {lastAccessDate: new Date()}});
  };

}