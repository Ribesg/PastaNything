/**
 * Characters used in getRandomAvailableShortUrl(size) below.
 */
var chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
var charsRegex = /^[a-z0-9]+$/i;
var minLength = 4;

/**
 * Get a random unused set of characters of at least min(size, minLength) characters.
 */
getRandomAvailableShortUrl = function(size) {
  if (!isDefined(size) || size < minLength) {
    size = minLength;
  }
  var loopCount = 0, res;
  do {
    res = "";
    for (var i = 0; i < size; i++) {
      res += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    if (++loopCount > 15) {
      size++;
      loopCount = 0;
    }
  } while (isDefined(Pastas.findOne({name: res})));
  return res;
};

/**
 * Checks if a short URL is long enough.
 */
isValidShortUrl = function(shortUrl) {
  return isString(shortUrl) && shortUrl.length >= minLength && charsRegex.test(shortUrl);
};

// Define the available languages list and tools
languages = [
  {name: "Apollo", code: "apollo"},
  {name: "Bash", code: "bsh"},
  {name: "C", code: "c"},
  {name: "C++", code: "cpp"},
  {name: "C#", code: "cs"},
  {name: "C-Shell", code: "csh"},
  {name: "CSS", code: "css"},
  {name: "Dart", code: "dart"},
  {name: "Go", code: "go"},
  {name: "HTML", code: "html"},
  {name: "Java", code: "java"},
  {name: "Javascript", code: "js"},
  {name: "Lua", code: "lua"},
  {name: "Perl", code: "perl"},
  {name: "PHP", code: "php"},
  {name: "Python", code: "py"},
  {name: "Ruby", code: "rb"},
  {name: "Scala", code: "scala"},
  {name: "SQL", code: "sql"},
  {name: "Xml", code: "xml"},
  {name: "YAML", code: "yaml"},
  {name: "Wiki", code: "wiki"},
  {name: "Other", code: "text"}
];

languagesPerName = {};
languagesPerCode = {};
languages.forEach(function(language) {
  languagesPerName[language.name] = language.code;
  languagesPerCode[language.code] = language.name;
});

/**
 * Checks if a button is disabled on a click event.
 */
isButtonDisabled = function(clickEvent) {
  return clickEvent.currentTarget.classList.contains("disabled");
};

/**
 * Javascript object to JSON String
 */
toJson = function(x) {
  return JSON.stringify(x, null, 2);
}

/**
 * Following functions are type check functions.
 */

isDefined = function(x) {
  return typeof(x) !== "undefined" && x !== null;
}

isEmpty = function(x) {
  return !isDefined(x) || x === {} || x === [] || x === "";
}

isBoolean = function(x) {
  return isDefined(x) && (x instanceof Boolean || x.contructor === Boolean);
}

isNumber = function(x) {
  return isDefined(x) && (x instanceof Number || x.constructor === Number);
}

isString = function(x) {
  return isDefined(x) && (x instanceof String || x.constructor === String);
}

var urlRegex = /^(?:https?|ftp):\/\/.+$/i; // TODO Use a better regex
isUrl = function(x) {
  return isString(x) && urlRegex.test(x);
}

isLanguageCode = function(x) {
  return isString(x) && isString(languagesPerCode[x]);
}

isObject = function(x) {
  return isDefined(x) && x instanceof Object;
}

isDate = function(x) {
  return isDefined(x) && x instanceof Date;
}

isArray = function(x) {
  return isDefined(x) && x instanceof Array;
}

isBooleanArray = function(x) {
  if (isArray(x)) {
    for (var i = 0; i < x.length; i++) {
      if (!isBoolean(x[i])) {
        return false;
      }
    }
    return true;
  } else {
    return false;
  }
}

isNumberArray = function(x) {
  if (isArray(x)) {
    for (var i = 0; i < x.length; i++) {
      if (!isNumber(x[i])) {
        return false;
      }
    }
    return true;
  } else {
    return false;
  }
}

isStringArray = function(x) {
  if (isArray(x)) {
    for (var i = 0; i < x.length; i++) {
      if (!isString(x[i])) {
        return false;
      }
    }
    return true;
  } else {
    return false;
  }
}
