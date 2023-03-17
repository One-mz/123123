var common = {}
var cookies = {};
common.install = function (Vue, option) {
	let loggingOn = true;
	if (option && option.log) {
		loggingOn = option.log
  }
	Vue.prototype.toCamelCase = function (obj) {
		function toCamel(o) {
			var newO, origKey, newKey, value;
			if (o instanceof Array) {
				newO = [];
				for (origKey in o) {
					value = o[origKey]
					if (typeof value === "object") {
						value = toCamel(value)
					}
					newO.push(value)
				}
			} else {
				newO = {}
				for (origKey in o) {
					if (o.hasOwnProperty(origKey)) {
						newKey = _.camelCase(origKey)
						value = o[origKey];
						if (value instanceof Array || (value !== null && value.constructor === Object)) {
							value = toCamel(value)
						}
						newO[newKey] = value
					}
				}
			}
			return newO;
		}

		return toCamel(obj)
	}

	Vue.prototype.logger = function (label, object) {
		if (loggingOn) {
			console.log(label, object);
			this.passingList=object
			console.log(this.passingList)
		}
	}

	Vue.prototype.toFormdata = function (item) {
		var form_data = new FormData()
		for (var key in item) {
			form_data.append(key, item[key]);
		}
		return form_data;
	}

	Vue.prototype.createCookie = function (name, value, days) {
		var expires = "";
		if (days) {
			var date = new Date();
			date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
			expires = "; expires=" + date.toUTCString();
		}
		document.cookie = name + "=" + value + expires + "; path=/";
	}

  Vue.prototype.eraseCookie = function (name) {
    document.cookie = name+'=; Max-Age=-99999999;';
	}

	Vue.prototype.readCookie = function (a) {
		var b = document.cookie.match('(^|;)\\s*' + a + '\\s*=\\s*([^;]+)');
		return b ? b.pop() : '';
	}

}

export default common;
