/**
 * This file contains stubs for testing purpose. They can be enabled in the /admin page.
 */
Stubs = {};

Stubs.create = function() {
  Stubs.destroy();

  // Users
  [
    {
      "_id": "FYRS68DiQo2ZzjxH9",
      "createdAt": "2014-06-06T10:24:53.166Z",
      "emails": [
        {
          "address": "ex1@example.com",
          "verified": false
        }
      ],
      "isAdmin": false,
      "pastas": [
        "OhUV",
        "0iRI",
        "fXAv",
        "zi5h",
        "ez39"
      ],
      "services": {
        "email": {
          "verificationTokens": [
            {
              "token": "G744uboEHxb3EsQ0B8HVqQWKSLfdFCgPkErGQUTvnsN",
              "address": "ex1@example.com",
              "when": "2014-06-06T10:24:53.173Z"
            }
          ]
        },
        "password": {
          "srp": {
            "identity": "PupTAxYqp54NBPTk13rqJ0xQmNLBVVsximULRoi2fG6",
            "salt": "U6fOHRjNPxVap_8byIDQXhGSAnXqR1A1WHm_ga2-PvN",
            "verifier": "891a255f81e8ed95dc1289e979f027478a08432fec0050752e556ecbf599353ca83882078ba176e9197833980fa3e3929f3ea02da3f07721df396a2bbab4f7e051821edeafd38259a798108795e600fe2bd1934fc3b8bde6ea2bff71a40ea64d337b9824d245ff318196017e5e95eb3287185970118b93d0425362873f5fde27"
          }
        },
        "resume": {
          "loginTokens": []
        }
      },
      "username": "exUser1"
    },
    {
      "_id": "xRdCqyAnQXQNWDZ4f",
      "createdAt": "2014-06-06T10:26:12.564Z",
      "emails": [
        {
          "address": "ex2@example.com",
          "verified": false
        }
      ],
      "isAdmin": false,
      "pastas": [
        "BlQS",
        "DQcI",
        "9pwI",
        "oci7"
      ],
      "services": {
        "email": {
          "verificationTokens": [
            {
              "token": "B6a9J6t2m_9d-1xBj0IhyH5vVQsd0Rc1Y0-yO1H-4K7",
              "address": "ex2@example.com",
              "when": "2014-06-06T10:26:12.569Z"
            }
          ]
        },
        "password": {
          "srp": {
            "identity": "gMaV5Bpce9PUmY53G3W5Z1N71XFb4mHFXbrOQjcXEFR",
            "salt": "_xsqvv905a9dZY52Bcc1548T9HH6dyMaqKcbAfxNbGE",
            "verifier": "1b854d131280e9d3472b53b5e451050641dc26c81d72a8ca51eb75a9264d7759c6b9311674f29b0093a12031682b6519cd100f01a4a4e09eb405c7235f73429633900f62511c3c7e1cd4c56e32c482d58854c8e3c214cd973d8e0ee0943ba981cee7b95fbcfa02f8b757632d30028e4e049ccf8f9f232154e422e4f1696316a1"
          }
        },
        "resume": {
          "loginTokens": [
            {
              "when": "2014-06-06T10:26:12.573Z",
              "hashedToken": "TIbS14ytmJj38XimEdtIZTQEDhDdf0WVFXMvS9jNuTU="
            }
          ]
        }
      },
      "username": "exUser2"
    }
  ].forEach(function(user) { Meteor.users.insert(user); });
  
  // Pastas
  [
    {
      "_id": "APo4Pwhpfs6etMwSn",
      "creationDate": "2014-06-06T10:25:26.553Z",
      "data": "Be careful when you use delete for an array. It is good for deleting attributes of objects but not so good for arrays. It is better to use splice for arrays.\n\nKeep in mind that when you use delete for an array you could get wrong results for anArray.length. In other words, delete would remove the element but not update the value of length property.\n\nYou can also expect to have holes in index numbers after using delete, e.g. you could end up with having indexes 1,3,4,8,9,11 and length as it was before using delete.",
      "lastAccessDate": "2014-06-06T10:25:26.553Z",
      "parent": "zi5h",
      "paster": "FYRS68DiQo2ZzjxH9",
      "title": "TEXT_0iRI",
      "type": "TEXT",
      "url": "0iRI"
    },
    {
      "_id": "54eNwXpnWzt4ebrqS",
      "creationDate": "2014-06-06T10:25:26.557Z",
      "data": "http://stackoverflow.com/questions/5767325/remove-specific-element-from-an-array",
      "lastAccessDate": "2014-06-06T10:25:26.557Z",
      "parent": "zi5h",
      "paster": "FYRS68DiQo2ZzjxH9",
      "title": "URL_fXAv",
      "type": "URL",
      "url": "fXAv"
    },
    {
      "_id": "xPiYWFmJNpmfWCot4",
      "creationDate": "2014-06-06T10:25:26.546Z",
      "data": {
        "type": "js",
        "content": "Object.defineProperty(Array.prototype, \"remove\", {\n    enumerable: false,\n    value: function (item) {\n        var removeCounter = 0;\n\n        for (var index = 0; index < this.length; index++) {\n            if (this[index] === item) {\n                this.splice(index, 1);\n                removeCounter++;\n                index--;\n            }\n        }\n\n        return removeCounter;\n    }\n});"
      },
      "lastAccessDate": "2014-06-06T10:25:26.546Z",
      "parent": "zi5h",
      "paster": "FYRS68DiQo2ZzjxH9",
      "title": "CODE_OhUV",
      "type": "CODE",
      "url": "OhUV"
    },
    {
      "title": "TEXT_ez39",
      "paster": "FYRS68DiQo2ZzjxH9",
      "parent": null,
      "type": "TEXT",
      "url": "ez39",
      "data": "On the client, this function logs in as the newly created user on successful completion. On the server, it returns the newly created user id.\n\nOn the client, you must pass password and at least one of username or email — enough information for the user to be able to log in again later. On the server, you do not need to specify password, but the user will not be able to log in until it has a password (eg, set with Accounts.setPassword).\n\nTo create an account without a password on the server and still let the user pick their own password, call createUser with the email option and then call Accounts.sendEnrollmentEmail. This will send the user an email with a link to set their initial password.\n\nBy default the profile option is added directly to the new user document. To override this behavior, use Accounts.onCreateUser.\n\nThis function is only used for creating users with passwords. The external service login flows do not use this function.",
      "creationDate": "2014-06-06T10:25:50.139Z",
      "lastAccessDate": "2014-06-06T10:25:50.139Z",
      "_id": "bznTkanZMAzBiueLR"
    },
    {
      "_id": "5vKsXbrT37ZBfgvLE",
      "creationDate": "2014-06-06T10:05:33.062Z",
      "data": "http://g",
      "lastAccessDate": "2014-06-06T10:05:33.062Z",
      "parent": "1A2u",
      "paster": "837EHv6BEj9rsqBM7",
      "title": "URL_HzBH",
      "type": "URL",
      "url": "HzBH"
    },
    {
      "_id": "5KDYCgM7E5dBNeNgR",
      "creationDate": "2014-06-06T10:05:33.070Z",
      "data": "g",
      "lastAccessDate": "2014-06-06T10:05:33.070Z",
      "parent": "1A2u",
      "paster": "837EHv6BEj9rsqBM7",
      "title": "TEXT_QtGS",
      "type": "TEXT",
      "url": "QtGS"
    },
    {
      "title": "MULTI_1A2u",
      "paster": "837EHv6BEj9rsqBM7",
      "parent": null,
      "type": "MULTI",
      "url": "1A2u",
      "data": [
        "HzBH",
        "QtGS",
        "zAgI"
      ],
      "creationDate": "2014-06-06T10:05:33.078Z",
      "lastAccessDate": "2014-06-06T10:05:33.078Z",
      "_id": "vK4hJkhXmSxGmxCGw"
    },
    {
      "_id": "mKTKhXk3MPWbyWEa8",
      "creationDate": "2014-06-06T10:05:33.074Z",
      "data": {
        "type": "lua",
        "content": "g"
      },
      "lastAccessDate": "2014-06-06T10:05:33.074Z",
      "parent": "1A2u",
      "paster": "837EHv6BEj9rsqBM7",
      "title": "CODE_zAgI",
      "type": "CODE",
      "url": "zAgI"
    },
    {
      "title": "MULTI_zi5h",
      "paster": "FYRS68DiQo2ZzjxH9",
      "parent": null,
      "type": "MULTI",
      "url": "zi5h",
      "data": [
        "OhUV",
        "0iRI",
        "fXAv"
      ],
      "creationDate": "2014-06-06T10:25:26.562Z",
      "lastAccessDate": "2014-06-06T10:25:26.562Z",
      "_id": "XgY38EaXqGvHi5vKq"
    },
    {
      "title": "URL_BlQS",
      "paster": "xRdCqyAnQXQNWDZ4f",
      "parent": null,
      "type": "URL",
      "url": "BlQS",
      "data": "http://docs.meteor.com/#accounts_createuser",
      "creationDate": "2014-06-06T10:26:24.400Z",
      "lastAccessDate": "2014-06-06T10:26:24.400Z",
      "_id": "HeS8kaRhK8kyKsFY2"
    },
    {
      "_id": "xHnjnueSKzpcomMKN",
      "creationDate": "2014-06-06T10:27:18.622Z",
      "data": {
        "type": "java",
        "content": "/***************************************************************************\n * Project file:    NPlugins - NCore - FilterManager.java                  *\n * Full Class name: fr.ribesg.bukkit.ncore.common.logging.FilterManager    *\n *                                                                         *\n *                Copyright (c) 2012-2014 Ribesg - www.ribesg.fr           *\n *   This file is under GPLv3 -> http://www.gnu.org/licenses/gpl-3.0.txt   *\n *    Please contact me at ribesg[at]yahoo.fr if you improve this file!    *\n ***************************************************************************/\n\npackage fr.ribesg.bukkit.ncore.common.logging;\nimport org.apache.logging.log4j.LogManager;\nimport org.apache.logging.log4j.core.LogEvent;\nimport org.apache.logging.log4j.core.LoggerContext;\nimport org.apache.logging.log4j.core.config.Configuration;\nimport org.apache.logging.log4j.core.config.LoggerConfig;\nimport org.apache.logging.log4j.core.filter.AbstractFilter;\nimport org.apache.logging.log4j.core.filter.RegexFilter;\n\n/**\n * Manages log4j2 filters\n *\n * @author Ribesg\n */\npublic class FilterManager {\n\n\t/**\n\t * Adds a new RegexFilter to log4j2.\n\t *\n\t * @param regex a regex String\n\t */\n\tpublic void addRegexFilter(final String regex) {\n\t\taddFilter(RegexFilter.createFilter(regex, \"FALSE\", \"DENY\", \"NEUTRAL\"));\n\t}\n\n\t/**\n\t * Adds a new CustomFilter to log4j2.\n\t *\n\t * @param filter the filter\n\t */\n\tpublic void addCustomFilter(final Filter filter) {\n\t\taddFilter(new CustomFilter(filter));\n\t}\n\n\t/**\n\t * Adds a new log4j Filter to log4j.\n\t *\n\t * @param log4jFilter a log4j filter\n\t */\n\tprivate void addFilter(final org.apache.logging.log4j.core.Filter log4jFilter) {\n\t\tfinal LoggerContext context = (LoggerContext) LogManager.getContext();\n\t\tfinal Configuration config = context.getConfiguration();\n\t\tfinal LoggerConfig loggerConfig = config.getLoggerConfig(LogManager.getRootLogger().getName());\n\t\tloggerConfig.addFilter(log4jFilter);\n\t\tcontext.updateLoggers();\n\t}\n\n\t/**\n\t * Represents a Custom log4j2 filter\n\t */\n\tprivate class CustomFilter extends AbstractFilter {\n\n\t\t/**\n\t\t * The actual filter\n\t\t */\n\t\tprivate final Filter filter;\n\n\t\t/**\n\t\t * Builds a CustomFilter from a Filter.\n\t\t *\n\t\t * @param filter a Filter\n\t\t */\n\t\tprivate CustomFilter(final Filter filter) {\n\t\t\tthis.filter = filter;\n\t\t}\n\n\t\t@Override\n\t\tpublic Result filter(final LogEvent event) {\n\t\t\treturn filter.denies(event.getMessage().getFormattedMessage()) ? Result.DENY : Result.NEUTRAL;\n\t\t}\n\t}\n}"
      },
      "lastAccessDate": "2014-06-06T10:27:18.622Z",
      "parent": "oci7",
      "paster": "xRdCqyAnQXQNWDZ4f",
      "title": "CODE_DQcI",
      "type": "CODE",
      "url": "DQcI"
    },
    {
      "title": "MULTI_oci7",
      "paster": "xRdCqyAnQXQNWDZ4f",
      "parent": null,
      "type": "MULTI",
      "url": "oci7",
      "data": [
        "DQcI",
        "9pwI"
      ],
      "creationDate": "2014-06-06T10:27:18.635Z",
      "lastAccessDate": "2014-06-06T10:27:18.635Z",
      "_id": "keERSvsS4578fqdJD"
    },
    {
      "_id": "CYpRezHBiYi45wDrw",
      "creationDate": "2014-06-06T10:27:18.629Z",
      "data": {
        "type": "yaml",
        "content": "#####################################################################\n##           Config file for NPermissions plugin GROUPS            ##\n## If you don't understand something, please ask on dev.bukkit.org ##\n##                                                          Ribesg ##\n#####################################################################\n\n# The following group, 'user', also defines the\n# following permissions:\n# - group.user - For members of this group AND members of subgroups\n# - maingroup.user - For players for whom this group is the main group (unique per player)\nuser:\n  extends: []\n  allow:\n  - npermissions.user\n  - nplayer.user\n  - ngeneral.user\n  - ntalk.user\n  - ntheendagain.user\n  - nenchantingegg.user\n  - nworld.user\n  - ncuboid.user\n\n\n# The following group, 'admin', also defines the\n# following permissions:\n# - group.admin - For members of this group AND members of subgroups\n# - maingroup.admin - For players for whom this group is the main group (unique per player)\nadmin:\n  extends:\n  - user\n  allow:\n  - ngeneral.admin\n  - npermissions.admin\n  - ntalk.admin\n  - ntheendagain.admin\n  - ncuboid.admin\n  - nworld.admin\n  - nenchantingegg.admin\n  - nplayer.admin\n\n\n# The following group, 'example', also defines the\n# following permissions:\n# - group.example - For members of this group AND members of subgroups\n# - maingroup.example - For players for whom this group is the main group (unique per player)\nexample:\n  extends: []\n"
      },
      "lastAccessDate": "2014-06-06T10:27:18.629Z",
      "parent": "oci7",
      "paster": "xRdCqyAnQXQNWDZ4f",
      "title": "CODE_9pwI",
      "type": "CODE",
      "url": "9pwI"
    }
  ].forEach(function(pasta) { Pastas.insert(pasta); });
};

Stubs.destroy = function() {
  // Users
  [
    {
      "_id": "FYRS68DiQo2ZzjxH9"
    },
    {
      "_id": "xRdCqyAnQXQNWDZ4f"
    }
  ].forEach(function(user) { Meteor.users.remove({_id: user._id}); });
  
  // Pastas
  [
    {
      "_id": "APo4Pwhpfs6etMwSn"
    },
    {
      "_id": "54eNwXpnWzt4ebrqS"
    },
    {
      "_id": "xPiYWFmJNpmfWCot4"
    },
    {
      "_id": "bznTkanZMAzBiueLR"
    },
    {
      "_id": "5vKsXbrT37ZBfgvLE"
    },
    {
      "_id": "5KDYCgM7E5dBNeNgR"
    },
    {
      "_id": "vK4hJkhXmSxGmxCGw"
    },
    {
      "_id": "mKTKhXk3MPWbyWEa8"
    },
    {
      "_id": "XgY38EaXqGvHi5vKq"
    },
    {
      "_id": "HeS8kaRhK8kyKsFY2"
    },
    {
      "_id": "xHnjnueSKzpcomMKN"
    },
    {
      "_id": "keERSvsS4578fqdJD"
    },
    {
      "_id": "CYpRezHBiYi45wDrw"
    }
  ].forEach(function(pasta) { Pastas.remove({_id: pasta._id}); });
};

