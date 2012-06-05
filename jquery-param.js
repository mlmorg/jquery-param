$.param = function (data, traditional, noArrayKeys) {
  var s = [],
  rbracket = /\[\]$/,
  r20 = /%20/g,

  encode = function (value, encoded) {
    return encoded ? value : encodeURIComponent(value);
  },

  add = function (key, value, keyEncoded) {
    value = $.isFunction(value) ? value() : value;
    s[s.length] = encode(key, keyEncoded) + '=' + encode(value);
  },

  buildParams = function (key, data, traditional, add, keyEncoded) {
    if ($.isArray(data)) {
      $.each(data, function (i, v) {
        if (traditional || rbracket.test(key)) {
          add(key, v);

        } else {
          buildParams(encode(key, keyEncoded) + '[' + (!noArrayKeys && (typeof v === "object" || jQuery.isArray(v)) ? i : '') + ']', v, traditional, add, true);
        }
      });

    } else if (data !== null && typeof data === 'object') {
      $.each(data, function (name) {
        buildParams(encode(key, keyEncoded) + '[' + encode(name) + ']', data[name], traditional, add, true);
      });

    } else {
      add(key, data, keyEncoded);
    }
  };

  // Set traditional to true for jQuery <= 1.3.2 behavior.
  if (traditional === undefined) {
    traditional = $.ajaxSettings.traditional;
  }

  if ($.isArray(data) || (data.jquery && !$.isPlainObject(data))) {
    $.each(data, function () {
      add(this.name, this.value);
    });

  } else {
    $.each(data, function (key) {
      buildParams(key, data[key], traditional, add);
    });
  }

  return s.join('&').replace(r20, '+');
};
