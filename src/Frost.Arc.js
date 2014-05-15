Frost.namespace("Frost.Arc");

function Arc(cfg) {
	this.height = cfg.height;
	this.width = cfg.width;
	this._container = cfg.container;
	this._parent = cfg.parent;
	this.data = cfg.data;
	this.colorList = cfg.colorList;
	this._seriesName = cfg.seriesName;
	this.detail = cfg.detail;
}
Arc.prototype.getType = function() {
	return this.type;
};
Arc.prototype.getHeight = function() {
	return this.height;
};

Arc.prototype.setHeight = function(data) {
	this.height = data;
};

Arc.prototype.getWidth = function() {
	return this.width;
};

Arc.prototype.setWidth = function(data) {
	this.Width = data;
};
Arc.prototype.getContainer = function() {
	return this._container;
};
Arc.prototype.setContainer = function(data) {
	this._container = data;
};
Arc.prototype.getParent = function() {
	return this._parent;
};
Arc.prototype.getData = function() {
	return this.data;
};
Arc.prototype.getColorList = function() {
	return this.colorList;
};
Arc.prototype.getSeriesName = function() {
	return this._seriesName;
};

Arc.prototype.render = function() {
	var width = this.getWidth();
	var height = this.getHeight();
	var radius = Math.min(width, height) / 2;
	var colorList = this.getColorList();
	this._groupContainer = this._container.append("g")
										  .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");
	var arc = d3.svg.arc()
				    .outerRadius(radius - 100)
				    .innerRadius(radius - 20);

	var pie = d3.layout.pie()
			    .sort(null)
			    .value(function(d) { return d.value; });
	var g = this._groupContainer.selectAll(".frost_pie")
			      				.data(pie(this.getData()))
			    				.enter().append("g")
			      				.attr("class", "frost_pie");

	g.append("path").attr("d", arc)
	      			.style("fill", function(d, i) { return colorList[i]; });

	g.append("text")
	 .attr("transform", function(d) { return "translate(" + arc.centroid(d) + ")"; })
	 .attr("dy", ".35em")
	 .style("text-anchor", "middle")
	 .text(function(d) { 
	 	return d.data.name + ": " +d.data.value; 
	 });
};

Frost.Arc = Arc;