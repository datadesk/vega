vg.canvas.Renderer = (function() {  
  var renderer = function() {
    this._ctx = null;
    this._el = null;
  };
  
  var prototype = renderer.prototype;
  
  prototype.initialize = function(el, width, height, pad) {
    this._el = el;
    this._width = width;
    this._height = height;
    this._padding = pad;

    // select canvas element
    var canvas = d3.select(el)
      .selectAll("canvas")
      .data([1]);
    
    // create new canvas element if needed
    canvas.enter()
      .append("canvas");
    
    // initialize canvas attributes
    canvas
      .attr("width", width + pad.left + pad.right)
      .attr("height", height + pad.top + pad.bottom);
    
    // get the canvas graphics context
    this._ctx = canvas.node().getContext("2d");
    this._ctx.setTransform(1, 0, 0, 1, pad.left, pad.top);
    
    return this;
  };
  
  prototype.context = function() {
    return this._ctx;
  };
  
  prototype.element = function() {
    return this._el;
  };
  
  prototype.render = function(scene, bounds) {
    var t0 = Date.now();
    var g = this._ctx,
        pad = this._padding,
        w = this._width + pad.left + pad.right,
        h = this._width + pad.top + pad.bottom;
        
    // setup
    this._scene = scene;
    g.save();
    if (bounds) {
      g.beginPath();
      g.rect(bounds.x1, bounds.y1, bounds.width(), bounds.height());
      g.clip();
    }
    g.clearRect(-pad.left, -pad.top, w, h);
    
    // render
    this.draw(g, scene, bounds);
    
    // takedown
    g.restore();
    this._scene = null;
    
    var t1 = Date.now();
    vg.log("RENDER TIME: " + (t1-t0));
  };
  
  prototype.draw = function(ctx, scene, bounds) {
    var marktype = scene.marktype,
        renderer = vg.canvas.marks.draw[marktype];
    renderer.call(this, ctx, scene, bounds);
  };
  
  prototype.renderAsync = function(scene) {
    // TODO make safe for multiple scene rendering?
    var renderer = this;
    if (renderer._async_id) {
      clearTimeout(renderer._async_id);
    }
    renderer._async_id = setTimeout(function() {
      renderer.render(scene);
      delete renderer._async_id;
    }, 50);
  };
  
  prototype.loadImage = function(uri) {
    var renderer = this,
        scene = this._scene;
    
    var image = new Image();
    image.onload = function() {
      vg.log("LOAD IMAGE: "+this.src);
      renderer.renderAsync(scene);
    };
    image.src = uri;
    return image;
  };
  
  return renderer;
})();