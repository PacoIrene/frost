Frost.namespace("Frost.Bubble");

function Bubble(cfg) {
	this.height = cfg.height;
	this.width = cfg.width;
	this._container = cfg.container;
	this._parent = cfg.parent;
	this.data = cfg.data;
	this.colorList = cfg.colorList;
	this._seriesName = cfg.seriesName;
}
Bubble.prototype.getType = function() {
	return this.type;
};
Bubble.prototype.getHeight = function() {
	return this.height;
};

Bubble.prototype.setHeight = function(data) {
	this.height = data;
};

Bubble.prototype.getWidth = function() {
	return this.width;
};

Bubble.prototype.setWidth = function(data) {
	this.Width = data;
};
Bubble.prototype.getContainer = function() {
	return this._container;
};
Bubble.prototype.setContainer = function(data) {
	this._container = data;
};
Bubble.prototype.getParent = function() {
	return this._parent;
};
Bubble.prototype.getData = function() {
	return this.data;
};
Bubble.prototype.getColorList = function() {
	return this.colorList;
};
Bubble.prototype.getSeriesName = function() {
	return this._seriesName;
};
Bubble.prototype.render = function() {
	var width = this.getWidth();
	var height = this.getHeight();
	var colorList = Frost.Util.getColorListForBubble(this.getData(), this.getData().length);
	var legendColor = []
	var bubble = d3.layout.pack()
	    .sort(null)
	    .size([width, height])
	    .padding(1.5);
	this._groupContainer = this._container.append("g").attr("class", "frost_bubble");
	var formatData = Frost.Util.formatDataForBubble(this.getData());
	var node = this._groupContainer.selectAll(".forst_bubble_node")
      			  .data(bubble.nodes(formatData)
      			  .filter(function(d) { return !d.children; }))
    			  .enter().append("g")
      			  .attr("class", "forst_bubble_node")
      			  .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });

 	node.append("title")
      	.text(function(d) { return d.name + ": " + d.value;});

  	node.append("circle")
      	.attr("r", function(d) { return d.r; })
      	.style("fill", function(d, i) { legendColor.push(colorList[d.package]); return colorList[d.package]; });

  	node.append("text")
      	.attr("dy", ".3em")
      	.style("text-anchor", "middle")
      	.text(function(d) { return d.name.substring(0, d.r / 3);});
    this.getParent().setColorList(Frost.Util.filterSome(legendColor));
    return this;
};

Frost.Bubble = Bubble;