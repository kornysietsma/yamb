(function() {
  var App, YAMB;
  YAMB = {
    App: (function() {
      App = function() {
        var that;
        that = this;
        this.element_selector = '#output';
        this.loadcount = 0;
        console.log("binding");
        $(window).hashchange(function(event) {
          return that.hashchange(event);
        });
        this.set_hash_clicks();
        $.bbq.pushState({
          host: 'localhost'
        });
        $(window).hashchange();
        return this;
      };
      App.prototype.renderView = function(viewSel, data) {
        var view;
        view = Mustache.to_html($(viewSel).html(), data);
        return $(this.element_selector).html(view);
      };
      App.prototype.hashchange = function(event) {
        var db, host, state;
        console.log("hashchange");
        host = event.getState('host');
        console.log("host: " + (host));
        db = event.getState('db');
        console.log("db: " + (db));
        if (!(typeof host !== "undefined" && host !== null)) {
          host = 'localhost';
          state = {
            host: host
          };
          return $.bbq.pushState(state);
        } else {
          host = 'localhost';
          if (host && db) {
            this.renderView("#db-view", {
              hostname: host,
              database: db,
              loading: true
            });
            return this.load_db(host, db);
          } else {
            this.renderView("#host-view", {
              hostname: host,
              database: '',
              loading: true
            });
            return this.load_host(host);
          }
        }
      };
      App.prototype.set_hash_clicks = function() {
        return $('#output a[href^=#]').live('click', function(e) {
          var db, hostname, state;
          hostname = $(this).attr("data-hostname");
          db = $(this).attr("data-db");
          console.log("clicked host " + (hostname) + " db " + (db) + " - setting state");
          state = {
            host: hostname,
            db: db
          };
          $.bbq.pushState(state);
          return false;
        });
      };
      App.prototype.errorformat = function(textStatus, error) {
        return {
          message: textStatus
        };
      };
      App.prototype.load_generic = function(url, viewSel) {
        var that;
        that = this;
        this.loadStart();
        return $.ajax({
          url: url,
          dataType: 'json',
          data: null,
          success: function(data) {
            that.loadFinish();
            return data.success ? that.renderView(viewSel, data.payload) : that.renderView("#error-view", data.payload);
          },
          error: function(request, textStatus, error) {
            that.loadFinish();
            return that.renderView("#error-view", app.errorformat(textStatus, error));
          }
        });
      };
      App.prototype.load_host = function(hostname) {
        return this.load_generic("/" + (hostname) + ".json", "#host-view");
      };
      App.prototype.load_db = function(hostname, db) {
        return this.load_generic("/" + (hostname) + "/" + (db) + ".json", "#db-view");
      };
      App.prototype.loadStart = function() {
        this.loadcount += 1;
        if (this.loadcount === 1) {
          return $("#loading").show();
        }
      };
      App.prototype.loadFinish = function() {
        this.loadcount -= 1;
        if (this.loadcount === 0) {
          return $("#loading").hide();
        }
      };
      return App;
    })()
  };
  $(function() {
    window.YAMB = YAMB;
    return (window.YambApp = new YAMB.App());
  });
}).call(this);
