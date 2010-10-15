(function() {
  var YAMB;
  YAMB = {
    app: $.sammy(function() {
      var app;
      app = this;
      this.use(Sammy.Mustache);
      this.element_selector = '#output';
      this.data = {
        mode: "initial"
      };
      this.loadcount = 0;
      this.get('#/', function() {
        return this.redirect('#/localhost');
      });
      this.get('#/:host', function() {
        return app.load_host(this.params['host']);
      });
      this.get('#/:host/:db', function() {
        return app.load_db(this.params['host'], this.params['db']);
      });
      this.bind('data-updated', function() {
        var ctx;
        ctx = this;
        ctx.log("handling mode: " + (app.data.mode));
        switch (app.data.mode) {
          case "host":
            return ctx.partial($("#host-view"), app.data.payload);
          case "db":
            return ctx.partial($("#db-view"), app.data.payload);
          case "error":
            return ctx.partial($("#error-view"), app.data.payload);
          default:
            return ctx.partial($("#error-view"), {
              message: ("unexpected mode: " + (app.data.mode))
            });
        }
      });
      this.newData = function(mode, payload) {
        app.data.mode = mode;
        app.data.payload = payload;
        return app.trigger('data-updated');
      };
      this.errorformat = function(textStatus, error) {
        return {
          message: textStatus
        };
      };
      this.load_generic = function(url, newmode) {
        app.loadStart();
        return $.ajax({
          url: url,
          dataType: 'json',
          data: null,
          success: function(data) {
            app.loadFinish();
            return data.success ? app.newData(newmode, data.payload) : app.newData("error", data.payload);
          },
          error: function(request, textStatus, error) {
            app.loadFinish();
            return app.newData("error", app.errorformat(textStatus, error));
          }
        });
      };
      this.load_host = function(hostname) {
        return this.load_generic("/" + (hostname) + ".json", "host");
      };
      this.load_db = function(hostname, db) {
        return this.load_generic("/" + (hostname) + "/" + (db) + ".json", "db");
      };
      this.loadStart = function() {
        this.loadcount += 1;
        if (this.loadcount === 1) {
          return $("#loading").show();
        }
      };
      return (this.loadFinish = function() {
        this.loadcount -= 1;
        if (this.loadcount === 0) {
          return $("#loading").hide();
        }
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
