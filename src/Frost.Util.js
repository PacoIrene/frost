Frost.namespace("Frost.Util");
var Util = {};

Util.getNameDomain = function(series) {
	var list = [];
	for(var i = 0; i != series.length; i++) {
		var data = series[i].data;
		for(var j = 0; j != data.length; j++) {
			if(list.indexOf(data[j].name) < 0) {
				list.push(data[j].name);
			}
		}
	}
	return list;
};

Util.getMaxValue = function(series) {
	var max = d3.max(series[0].data, function(d) { return Number(d.value); })
	for(var i = 0; i != series.length; i++) {
		var tempMax = d3.max(series[i].data, function(d) { return Number(d.value); });
		if(tempMax >= max) {
			max = tempMax;
		}
	}
	return max / 0.8;
};
Util.getSeriesName = function(series) {
	var list = [];
	for(var i = 0; i != series.length; i++) {
		list.push(series[i].name);
	}
	return list;
};

Util.getColorList = function(series, length) {
	if(series[0].color) {
		var list = [];
 		for(var i = 0; i != series.length; i++) {
			list.push(series[i].color);
 		}
 		return list;
	} else {
		return Frost.ColorConst(length);
	}
};
Util.getColorListForBubble = function(series, length) {
	var list = {};
	if(series[0].color) {
		for(var i = 0; i != series.length; i++) {
			list[series[i].name] = series[i].color;
		}
	} else {
		var colors = Frost.ColorConst(length);
		for(var i = 0; i != series.length; i++) {
			list[series[i].name] = colors[i];
		}
	}
	return list;
};
Util.getValue = function(name, data) {
	var result = 0;
	for(var k = 0; k != data.length; k++) {
		if(data[k].name == name) {
			result = data[k].value;
			return result;
		}
	}
	return result;
};
Util.formatDataForGroupBar = function(series) {
	var objList = [];
	var seriesName = this.getNameDomain(series);
	for(var i = 0; i != seriesName.length; i++) {
		var obj = {};
		obj["name"] = seriesName[i];
		obj["data"] = [];
		for(var j = 0; j != series.length; j++) {
			var tempObj = {};
			tempObj["name"] = series[j].name;
			tempObj["value"] = this.getValue(obj["name"], series[j].data);
			obj["data"].push(tempObj);
		}
		objList.push(obj);
	}
	return objList;
};

Util.formatDataForStackBar = function(series, type) {
	var objList = [];
	if(type == 1) {
		for(var i = 0; i != series.length; i++) {
			var obj = {};
			obj["name"] = series[i].name;
			if(series[i].color) {
				obj["color"] = series[i].color;
			}
			obj["data"] = [];
			var start = 0;
			for(var j = 0; j != series[i].data.length; j++) {
				var tempObj = {};
				tempObj["name"] = series[i].data[j].name;
				tempObj["y0"] = start;
				start = start + series[i].data[j].value;
				tempObj["y1"] = start;
				obj["data"].push(tempObj);
			}
			obj["total"] = start;
			objList.push(obj);
		}
	} else if(type == 2) {
		var seriesName = this.getNameDomain(series);
		for(var i = 0; i != seriesName.length; i++) {
			var obj = {};
			obj["name"] = seriesName[i];
			obj["data"] = [];
			var start = 0;
			for(var j = 0; j != series.length; j++) {
				var tempObj = {};
				var value = this.getValue(obj["name"], series[j].data);
				tempObj["name"] = series[j].name;
				tempObj["y0"] = start;
				start = start + value;
				tempObj["y1"] = start;
				obj["data"].push(tempObj);
			}
			obj["total"] = start;
			objList.push(obj);
		}
	}
	return objList;
};

Util.formatDataForStackArea = function(series) {
	var objList = [];
	for(var i = 0; i != series.length; i++) {
		for(var j = 0; j != series[i].data.length; j++) {
			var obj = {};
			obj["key"] = series[i].name;
			obj["name"] = series[i].data[j].name;
			obj["value"] = series[i].data[j].value;
			objList.push(obj);
		}
	}
	return objList;
};
Util.formatDataForBubble = function(series) {
	var objList = {children: []};
	for(var i = 0; i != series.length; i++) {
		for(var j = 0; j != series[i].data.length; j++) {
			var obj = {};
			obj["package"] = series[i].name;
			obj["name"] = series[i].data[j].name;
			obj["value"] = series[i].data[j].value;
			objList.children.push(obj);
		}
	}
	return objList;
};
Util.formatDataForForce = function(series, maxRadius) {
	var m = series.length;
	var total = this.getMaxValue(series);
	var objList = [];
	var clusters = new Array(m);
	for (var i = 0; i != series.length; i++) {
		for(var j = 0; j != series[i].data.length; j++) {
			var obj = {};
			obj["name"] = series[i].data[j].name;
			obj["value"] = series[i].data[j].value;
			obj["package"] = series[i].name;
			obj["cluster"] = i;
			obj["radius"] = obj["value"] / total * maxRadius;
			objList.push(obj);
			if (!clusters[i] || (obj["radius"] > clusters[i].radius)) clusters[i] = obj;
		}
	}
	return {data: objList, clusters: clusters};
};
Util.formatDataForScatter = function(series, maxRadius) {
	var m = series.length;
	var total = this.getMaxValue(series);
	var objList = [];
	for (var i = 0; i != series.length; i++) {
		for(var j = 0; j != series[i].data.length; j++) {
			var obj = {};
			obj["name"] = series[i].data[j].name;
			obj["value"] = series[i].data[j].value;
			obj["package"] = series[i].name;
			obj["radius"] = obj["value"] / total * maxRadius;
			objList.push(obj);
		}
	}
	return objList;
};
Util.filterSome = function(array) {
	var temp = {};
	var returnArray = [];
	for(var i = 0; i != array.length; i++) {
		if(temp[array[i]] != 1) {
			temp[array[i]] = 1;
			returnArray.push(array[i]);
		}
	}
	return returnArray;
};
Util.getTotal = function(series) {
	var number = 0;
	for(var i = 0; i != series.length; i++) {
		for(var j = 0; j != series[i].data.length; j++) {
			number = number +series[i].data[j].value;
		}
	}
	return number;
};
Util.getDateRange = function(series) {
	var parseDate = d3.time.format("%Y-%m-%d").parse;
	var min = parseDate(series[0].data[0].name);
	var max = parseDate(series[0].data[series[0].data.length - 1].name);
	for(var i = 0; i != series.length; i++) {
		for(var j = 0; j != series[i].data.length; j++) {
			if(parseDate(series[i].data[j].name) < min) {
				min = parseDate(series[i].data[j].name);
			}
			if(parseDate(series[i].data[j].name) > min) {
				max = parseDate(series[i].data[j].name);
			}
		}
	}
	return {"min": min, "max": max};
};
Util.formatDataForDate = function(series) {
	var parseDate = d3.time.format("%Y-%m-%d").parse;
	for(var i = 0; i != series.length; i++) {
		for(var j = 0; j != series[i].data.length; j++) {
			series[i].data[j].name = parseDate(series[i].data[j].name);
		}
	}
	return series;
};

Frost.Util = Util;