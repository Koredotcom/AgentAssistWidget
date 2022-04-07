String.prototype.isNotAllowedHTMLTags = function () {
    var wrapper = document.createElement('div');
    wrapper.innerHTML = this;

    var setFlags = {
        isValid: true,
        key: ''
    };
    if ($(wrapper).find('script').length || $(wrapper).find('video').length || $(wrapper).find('audio').length) {
        setFlags.isValid = false;
    }
    if ($(wrapper).find('link').length && $(wrapper).find('link').attr('href').indexOf('script') !== -1) {
        if (detectScriptTag.test($(wrapper).find('link').attr('href'))) {
            setFlags.isValid = false;
        } else {
            setFlags.isValid = true;
        }
    }
    if ($(wrapper).find('a').length && $(wrapper).find('a').attr('href').indexOf('script') !== -1) {
        if (detectScriptTag.test($(wrapper).find('a').attr('href'))) {
            setFlags.isValid = false;
        } else {
            setFlags.isValid = true;
        }
    }
    if ($(wrapper).find('img').length && $(wrapper).find('img').attr('src').indexOf('script') !== -1) {
        if (detectScriptTag.test($(wrapper).find('img').attr('href'))) {
            setFlags.isValid = false;
        } else {
            setFlags.isValid = true;
        }
    }
    if ($(wrapper).find('object').length) {
        setFlags.isValid = false;
    }

    return setFlags;
  };

  String.prototype.escapeHTML = function () {
      //'&': '&amp;',
      var escapeTokens = {
          '<': '&lt;',
          '>': '&gt;',
          '"': '&quot;',
          "'": '&#x27;'
      };
      var htmlTags = /[<>"']/g;
      return ('' + this).replace(htmlTags, function (match) {
          return escapeTokens[match];
      });
  };