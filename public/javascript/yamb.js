(function() {
  var YAMB;
  YAMB = {
    app: $.sammy(function() {
      var app;
      app = this;
      this.data = {};
      this.use(Sammy.Mustache);
      this.element_selector = '#output';
      this.get('#/', function() {
        return this.redirect('#/localhost');
      });
      this.get('#/:host', function() {
        app.log("in :host");
        return app.load_host(this.params['host']);
      });
      this.load_host = function(hostname) {
        app.log("load_host");
        return $.getJSON("/" + (hostname) + ".json", null, function(hostdata) {
          app.data.host = hostdata;
          return app.trigger('data-updated');
        });
      };
      return this.bind('data-updated', function() {
        var ctx;
        ctx = this;
        app.log("show_host");
        return app.data.host.success ? ctx.partial($("#host-view"), app.data.host) : ctx.partial($("#host-error-view"), app.data.host);
      });
    })
  };
  $(function() {
    if (typeof window !== "undefined" && window !== null) {
      window.YAMB = YAMB;
    }
    return YAMB.app.run('#/');
  });
}).call(this);
