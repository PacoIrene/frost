Frost.namespace("Frost.Scatter");

function Scatter(cfg) {
	this.height = cfg.height;
	this.width = cfg.width;
	this._container = cfg.container;
	this._parent = cfg.parent;
	this.data = cfg.data;
	this.colorList = cfg.colorList;
	this._seriesName = cfg.seriesName;
	this.maxRadius = Math.min(this.width, this.height) * 0.25 /2;
	this.detail = cfg.detail;
	this.hasDetail = cfg.hasDetail || false;
}
Scatter.prototype.getType = function() {
	return this.type;
};
Scatter.prototype.getHeight = function() {
	return this.height;
};

Scatter.prototype.setHeight = function(data) {
	this.height = data;
};

Scatter.prototype.getWidth = function() {
	return this.width;
};

Scatter.prototype.setWidth = function(data) {
	this.Width = data;
};
Scatter.prototype.getContainer = function() {
	return this._container;
};
Scatter.prototype.setContainer = function(data) {
	this._container = data;
};
Scatter.prototype.getParent = function() {
	return this._parent;
};
Scatter.prototype.getData = function() {
	return this.data;
};
Scatter.prototype.getColorList = function() {
	return this.colorList;
};
Scatter.prototype.getSeriesName = function() {
	return this._seriesName;
};

Scatter.prototype.render = function() {
	var that = this;
	function mousemove(d) {
		var x0 = d3.mouse(this)[0] +  (that.getWidth() / 500 -1) * 50;
		var y0 = d3.mouse(this)[1] + (that.getHeight() / 300 -1) * 10;
		that.detail.setContent({position: {x: x0, y:y0},contentValue: d.package + ": "+d.value});
		// d.style("stroke", "#123456");
	}
	var x = this.getParent().getXScale();
	var y = this.getParent().getYScale();
	y.domain([0, this.getParent().getYScaleMaxValue() * 1.2]);
	var width = this.getWidth();
	var height = this.getHeight();
	var colorList = Frost.Util.getColorListForBubble(this.getData(), this.getData().length);
	this._formatData = Frost.Util.formatDataForScatter(this.getData(), this.maxRadius);
	this._groupContainer = this._container.append("g").attr("class", "frost_scatter");
	this._node = this._groupContainer.selectAll(".frost_scatter_dot")
					      			 .data(this._formatData)
					    			 .enter().append("circle")
					      			 .attr("class", "frost_scatter_dot")
							         .attr("r", function(d) {return d.radius;})
							         .attr("cx", function(d) { return x(d.name) + x.rangeBand() / 2; })
							         .attr("cy", function(d) { return y(d.value); })
							         .style("fill", function(d) { return colorList[d.package]; });
	if(this.hasDetail) {
		this._node.on("mouseover", function() {that.detail.show(); })
		        .on("mouseout", function() { that.detail.hide();})
		        .on("mousemove", mousemove);
	}
	return this;
};

Frost.Scatter = Scatter;