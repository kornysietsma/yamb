(function() {
  var Yamb;
  Yamb = function() {
    this.hostdata = {};
    this.load_context();
    return this;
  };
  Yamb.prototype.load_host = function(hostname) {
    var yamb;
    yamb = this;
    return $.getJSON("/" + (hostname) + ".json", null, function(data) {
      return yamb.update_host(hostname, data);
    });
  };
  Yamb.prototype.update_host = function(hostname, data) {
    this.hostdata = data;
    return this.context.trigger('show_host');
  };
  Yamb.prototype.show_host = function(context) {
    return this.hostdata.success ? context.partial($("#host-view"), this.hostdata) : context.partial($("#host-error-view"), this.hostdata);
  };
  Yamb.prototype.load_context = function() {
    var yamb;
    yamb = this;
    this.context = $.sammy(function() {
      this.use(Sammy.Mustache);
      this.element_selector = '#output';
      this.get('#/', function(context) {
        return context.redirect('#/localhost');
      });
      this.get('#/:host', function(context) {
        return yamb.load_host(context.params['host']);
      });
      return this.bind('show_host', function() {
        return yamb.show_host(this);
      });
    });
    return this.context.run('#/localhost');
  };
  $(function() {
    var yamb;
    yamb = new Yamb();
    return (window.YAMB = yamb);
  });
}).call(this);
