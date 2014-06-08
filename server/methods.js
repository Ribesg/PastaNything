/**
 * This file contains every server-side methods that can be called client-side.
 */

/**
 * This function is called by the paste() method to create & save a new URL Pasta.
 */
var newUrl = function(id, url) {
  var shortUrl = getRandomAvailableShortUrl();
  var newPasta = new Pasta({
    "paster": id,
    "type": "URL",
    "url": shortUrl,
    "data": url,
    "creationDate": new Date(),
    "lastAccessDate": new Date()
  });
  Pastas.insert(newPasta);
  if (id !== "anonymous") {
    Meteor.users.update(
      {"_id": id},
      {$push: {"pastas": shortUrl}}
    );
  }
  return newPasta;
}

/**
 * This function is called by the paste() method to create & save a new TEXT Pasta.
 */
var newText = function(id, text) {
  var shortUrl = getRandomAvailableShortUrl();
  var newPasta = new Pasta({
    "paster": id,
    "type": "TEXT",
    "url": shortUrl,
    "data": text,
    "creationDate": new Date(),
    "lastAccessDate": new Date()
  });
  Pastas.insert(newPasta);
  if (id !== "anonymous") {
    Meteor.users.update(
      {"_id": id},
      {$push: {"pastas": shortUrl}}
    );
  }
  return newPasta;
}

/**
 * This function is called by the paste() method to create & save a new CODE Pasta.
 */
var newCode = function(id, code, type) {
  var shortUrl = getRandomAvailableShortUrl();
  var newPasta = new Pasta({
    "paster": id,
    "type": "CODE",
    "url": shortUrl,
    "data": {
      "type": type,
      "content": code
    },
    "creationDate": new Date(),
    "lastAccessDate": new Date()
  });
  Pastas.insert(newPasta);
  if (id !== "anonymous") {
    Meteor.users.update(
      {"_id": id},
      {$push: {"pastas": shortUrl}}
    );
  }
  return newPasta;
}

/**
 * This function is called by the paste() method to create & save a new MULTI Pasta.
 */
var newMulti = function(id, pastas) {
  var shortUrl = getRandomAvailableShortUrl();
  var newPasta = new Pasta({
    "paster": id,
    "type": "MULTI",
    "url": shortUrl,
    "data": pastas,
    "creationDate": new Date(),
    "lastAccessDate": new Date()
  });
  Pastas.insert(newPasta);
  pastas.forEach(function(pid) {
    Pastas.update(
      {"url": pid},
      {$set: {"parent": shortUrl}}
    );
  });
  if (id !== "anonymous") {
    Meteor.users.update(
      {"_id": id},
      {$push: {"pastas": shortUrl}}
    );
  }
  return newPasta;
}

/**
 * Here comes the server methods.
 */
Meteor.methods({

  // ############################### //
  // ## Global / All pages method ## //
  // ############################### //
  
  amIAdmin: function() {
    return this.userId && Meteor.users.findOne({_id: this.userId}).isAdmin;
  },

  // ########################### //
  // ## "/admin" page methods ## //
  // ########################### //

  getUsers: function() {
    var user = Meteor.users.findOne({"_id": this.userId});
    var result = [];
    if (user && user.isAdmin) {
      Meteor.users.find().forEach(function(user) {
        result.push(user);
      });
    } else {
      throw new Meteor.Error(403, "Forbidden", "You need admin rights to access this.");
    }
    return result;
  },
  
  clearAll: function() {
    var user = Meteor.users.findOne({"_id": this.userId});
    if (user && user.isAdmin) {
      Meteor.call("clearUsers", true);
      Meteor.call("clearPastas", true);
    } else if (user && !ignoreErrors) {
      throw new Meteor.Error(403, "Forbidden", "You need admin rights to kill all users.");
    } else if (!ignoreErrors) {
      throw new Meteor.Error(403, "Forbidden", "You need to be logged in to access this ressource.");
    }
  },
 
  /**
   * Removes all users from DB. 
   * @returns : number of users removed
   */
  clearUsers: function(ignoreErrors) {
    var user = Meteor.users.findOne({"_id": this.userId});
    var result = 0;
    if (user && user.isAdmin) {
      Meteor.users.find().forEach(function(userToDel) {
        if (!userToDel.isAdmin) {
          Meteor.call("killUser", userToDel.username, true);
          result++;
        }
      });
    } else if (user && !ignoreErrors) {
      throw new Meteor.Error(403, "Forbidden", "You need admin rights to kill all users.");
    } else if (!ignoreErrors) {
      throw new Meteor.Error(403, "Forbidden", "You need to be logged in to access this ressource.");
    }
    return result;
  },
  
  /**
  * Removes all pastas from DB. 
  * @returns : number of pastas removed
  */
  clearPastas: function(ignoreErrors) {
    var user = Meteor.users.findOne({"_id": this.userId});
    var result = 0;
    if (user && user.isAdmin) {
      Pastas.find().forEach(function(pasta) {
        Meteor.call("killPasta", pasta.url, true);
        result++;
      });
    } else if (user && !ignoreErrors) {
      throw new Meteor.Error(403, "Forbidden", "You need admin rights to clear all pastas.");
    } else if (!ignoreErrors) {
      throw new Meteor.Error(403, "Forbidden", "You need to be logged in to access this ressource.");
    }
    return result;
  },

  killUser: function(username, ignoreErrors) {
    var user = Meteor.users.findOne({"_id": this.userId});
    if (user && user.isAdmin) {
        var userToDel = Meteor.users.findOne({"username": username});
        if (userToDel && !userToDel.isAdmin) {
          Meteor.call("clearUserPastas", username, ignoreErrors);
          Meteor.users.remove({"_id": userToDel._id});
        } else if (userToDel && !ignoreErrors) {
          throw new Meteor.Error(403, "Forbidden", "It is not allowed to kill an admin.");
        } else if (!ignoreErrors) {
          throw new Meteor.Error(404, "Not found", "No user with username '" + username + "' could be found.");
        }
    } else if (user && !ignoreErrors) {
        throw new Meteor.Error(403, "Forbidden", "You need admin rights to kill an user.");
    } else if (!ignoreErrors) {
        throw new Meteor.Error(403, "Forbidden", "You need to be logged in to access this ressource.");
    }
  },

  /**
   * clears all pasta from user username 
   */
  clearUserPastas: function(username, ignoreErrors) {
    var user = Meteor.users.findOne({"_id": this.userId});
    var result = 0;
    if (user && user.isAdmin) {
      if (username === "anonymous") {
        Pastas.find({paster: "anonymous"}).forEach(function(pasta) {
          Meteor.call("killPasta", pasta.url, true);
          result++;
        });
      } else {
        var userToDelete = Meteor.users.findOne({"username": username});
        if (userToDelete) {
          userToDelete.pastas.forEach(function(pid) {
            Meteor.call("killPasta", pid, true);
            result++;
          });          
        } else if (!ignoreErrors) {
          throw new Meteor.Error(404, "Not found", "No user " + username + " could be found.");
        }
      }
    } else if (user && !ignoreErrors) {
        throw new Meteor.Error(403, "Forbidden", "You need admin rights to clear an user's pastas.");
    } else if (!ignoreErrors) {
        throw new Meteor.Error(403, "Forbidden", "You need to be logged in to access this ressource.");
    }
    return result;
  },
  
  createStubs: function() {
    var user = Meteor.users.findOne({"_id": this.userId});
    if (!user) {
      throw new Meteor.Error(403, "Forbidden", "Sorry, anonymous users are not allowed to access this.");
    } else if (user.isAdmin) {
      Stubs.create();
    } else {
      throw new Meteor.Error(403, "Forbidden", "Sorry, only admins can do that.");
    }
  },
  
  destroyStubs: function() {
    var user = Meteor.users.findOne({"_id": this.userId});
    if (!user) {
      throw new Meteor.Error(403, "Forbidden", "Sorry, anonymous users are not allowed to access this.");
    } else if (user.isAdmin) {
      Stubs.destroy();
    } else {
      throw new Meteor.Error(403, "Forbidden", "Sorry, only admins can do that.");
    }
  },
  
  relegateAdmin: function(username) {
    var user = Meteor.users.findOne({"_id": this.userId});
    if (!user) {
      throw new Meteor.Error(403, "Forbidden", "Sorry, anonymous users are not allowed to access this.");
    } else if (user.isAdmin) {
      var adminUser = Meteor.users.findOne({"username": username});
      if (adminUser && adminUser.isAdmin) {
        Meteor.users.update(
          {"username": username},
          {$set: {"isAdmin": false}}
        );
      } else {
        throw new Meteor.Error(404, "Not Found", "There is no admin named " + username + ".");
      }
    } else {
      throw new Meteor.Error(403, "Forbidden", "Sorry, only admins can do that.");
    }
  },
  
  promoteUser: function(username) {
    var user = Meteor.users.findOne({"_id": this.userId});
    if (!user) {
      throw new Meteor.Error(403, "Forbidden", "Sorry, anonymous users are not allowed to access this.");
    } else if (user.isAdmin) {
      var regularUser = Meteor.users.findOne({"username": username});
      if (regularUser && !regularUser.isAdmin) {
        Meteor.users.update(
          {"username": username},
          {$set: {"isAdmin": true}}
        );
      } else {
        throw new Meteor.Error(404, "Not Found", "There is no regular user named " + username + ".");
      }
    } else {
      throw new Meteor.Error(403, "Forbidden", "Sorry, only admins can do that.");
    }
  },
  
  // #################################### //
  // ## "/user/:username" page methods ## //
  // #################################### //
  
  getPastasForUser: function(username) {
    var user = Meteor.users.findOne({"_id": this.userId});
    var forUser;
    if (!user) {
      throw new Meteor.Error(403, "Forbidden", "Sorry, anonymous users are not allowed to access this.");
    } else if (user.isAdmin && username === "anonymous") {
      var result = [];
      Pastas.find({paster: "anonymous"}).forEach(function(pasta) {
        result.push(pasta);
      });
      return result;
    } else if (isEmpty(username) || user.username === username) {
      forUser = user;
    } else if (user.isAdmin) {
      var result = Meteor.users.findOne({"username": username});
      if (result) {
        forUser = result;
      } else {
        throw new Meteor.Error(404, "Not Found", "Sorry, there is no user named '" + username + "'.");
      }
    } else {
      throw new Meteor.Error(403, "Forbidden", "Sorry, only admins can see other users pastas.");
    }
    var pastas = [];
    forUser.pastas.forEach(function(pid) {
      pastas.push(Pastas.findOne({url: pid}));
    });
    return pastas;
  },

  killPasta: function(pid, ignoreErrors) { 
    var user = Meteor.users.findOne({"_id": this.userId});
    var pasta = Pastas.findOne({"url": pid});
    if (pasta) {
      if (user && (user.isAdmin || pasta.paster == user._id)) {
        Pastas.remove({"_id": pasta._id});
        if (pasta.type == "MULTI") {
          pasta.data.forEach(function(subPid) {
            Meteor.call("killPasta", subPid, ignoreErrors);
          });
        } else if (pasta.parent) {
          var parentPasta = Pastas.findOne({"url": pasta.parent});
          if (parentPasta) {
            var newData = parentPasta.data;
            newData.splice(newData.indexOf(pid), 1);
            Pastas.update(
              {"url": pasta.parent},
              {$set: {"data": newData}}
            );
          } else {
            Pastas.update(
              {"url": pasta.url},
              {$set: {"parent": null}}
            );
          }
        }
        if (pasta.paster) {
          var paster = Meteor.users.findOne({"_id": pasta.paster});
          if (paster) {
            var newPastas = paster.pastas;
            newPastas.splice(newPastas.indexOf(pid), 1);
            Meteor.users.update(
              {"_id": paster._id},
              {$set: {"pastas": newPastas}}
            );
          }
        }
      } else if (user && !ignoreErrors) {
        throw new Meteor.Error(403, "Forbidden", "You are not allowed to remove this pasta.");
      } else if (!ignoreErrors) {
        throw new Meteor.Error(403, "Forbidden", "You need to be logged in to access this ressource.");
      }
    } else if (!ignoreErrors) {
      throw new Meteor.Error(404, "Not Found", "No pasta with id " + pid + " could be found");
    }
  },
  
  // ############################# //
  // ## "/" (main) page methods ## //
  // ############################# //
  
  paste: function(pastas) {
    var uid = this.userId || "anonymous";
    var result = [];
    pastas.forEach(function(pasta) {
      switch (pasta.type) {
        case "URL":
          var pasta = newUrl(uid, pasta.url);
          result.push(pasta.url);
          break;
        case "TEXT":
          var pasta = newText(uid, pasta.text);
          result.push(pasta.url);
          break;
        case "CODE":
          var pasta = newCode(uid, pasta.code, pasta.code_type);
          result.push(pasta.url);
          break;
        // case "IMG":
        default:
          throw new Meteor.Error(400, "Bad Request", "Warning: unknown type '" + pasta.type + "'");
          break;
      }
    });
    if (result.length > 1) {
      var pasta = newMulti(uid, result);
      return pasta.url;
    } else {
      return result[0];
    }
  },

  // ################################################## //
  // ## "/edit/:pid" and "/pasta/:pid" pages methods ## //
  // ################################################## //
  
  getPasta: function(shortUrl, checkRights) {
    var user = Meteor.users.findOne({"_id": this.userId});
    if (!checkRights || Pasta.canEdit(user, shortUrl)) {
      var pasta = Pastas.findOne({"url": shortUrl});
      if (pasta) {
        return pasta;
      } else {
        throw new Meteor.Error(404, "Not found", "There is no pasta with shortUrl '" + shortUrl + "'.");
      }
    } else {
      throw new Meteor.Error(403, "Forbidden", "You can't edit the pasta with shortUrl '" + shortUrl + "'.");
    }
  },
  
  canEdit: function(pid) {
    var user = Meteor.users.findOne({"_id": this.userId});
    return Pasta.canEdit(user, pid) ? "yes" : "no"; // Boolean does not really work here
  },
  
  checkAvailability: function(shortUrl) {
    return !isObject(Pastas.findOne({"url": shortUrl}));
  },
  
  save: function(oldShortUrl, newShortUrl, newTitle, newData) {
    var pasta = Pastas.findOne({"url": oldShortUrl});
    var user = Meteor.users.findOne({"_id": this.userId});
    if (!isObject(pasta)) {
      throw new Meteor.Error(404, "Not found", "No Pasta with short URL " + oldShortUrl);
    } else if (!Pasta.canEdit(user, oldShortUrl)) {
      throw new Meteor.Error(403, "Forbidden", "You can\'t edit the Pasta with short URL " + oldShortUrl);
    } else if (!isValidShortUrl(newShortUrl) || oldShortUrl !== newShortUrl && !Meteor.call("checkAvailability", newShortUrl)) {
      throw new Meteor.Error(403, "Forbidden", "The short URL " + newShortUrl + " is invalid or already taken");
    } else {
      switch(pasta.type) {
        case "URL":
          if (!newData || !isUrl(newData)) {
            throw new Meteor.Error(403, "Forbidden", "URL is invalid");
          }
          break;
        case "TEXT":
          if (!newData || !isEmpty(newData)) {
            throw new Meteor.Error(403, "Forbidden", "Text can\'t be empty");
          }
          break;
        case "CODE":
          if (isEmpty(newData) || !isObject(newData)) {
            throw new Meteor.Error(403, "Forbidden", "Empty data");
          } else if (isEmpty(newData.type) || !isLanguageCode(newData.type)) {
            throw new Meteor.Error(403, "Forbidden", "Invalid type");
          } else if (isEmpty(newData.content)) {
            throw new Meteor.Error(403, "Forbidden", "Code can\'t be empty");
          }
          break;
        // case "IM":
        default:
          throw new Meteor.Error(500, "Internal Server Error", "Unknown Pasta type " + pasta.type + " found in the database");
          break;
      }
      if (pasta.url !== newShortUrl) {
        var user = Meteor.users.findOne({"_id": pasta.paster});
        var i = user.pastas.indexOf(pasta.url);
        var newPastas = user.pastas;
        newPastas[i] = newShortUrl;
        Meteor.users.update(
          {_id: user._id},
          {$set: {"pastas": newPastas} }
        );
      }
      pasta.url = newShortUrl;
      pasta.title = isEmpty(newTitle) ? pasta.type + "_" + newShortUrl : newTitle;
      pasta.data = newData;
      Pastas.remove({"url": oldShortUrl});
      Pastas.insert(pasta);
      return pasta;
    } 
  },
  
  // ########################### //
  // ## "/debug" page methods ## //
  // ########################### //
  
  debug_get_users: function() {
    var result = [];
    Meteor.users.find().forEach(function(user) {
      result.push(user);
    });
    return toJson(result);
  },
  
  debug_get_pastas: function() {
    var result = [];
    Pastas.find().forEach(function(pasta) {
      result.push(pasta);
    });
    return toJson(result);
  },
  
  wipe: function() {
    Pastas.find().forEach(function(pasta) {
      Pastas.remove({_id: pasta._id});
    });
    Meteor.users.find().forEach(function(user) {
      if (user.username !== adminUserName) {
        Meteor.users.remove({_id: user._id});
      }
    });
    Meteor.users.update({username: adminUserName}, {$set: {pastas: []}});
  }

});
