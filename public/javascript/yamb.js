(function() {
  var App, YAMB;
  var __bind = function(func, context) {
    return function(){ return func.apply(context, arguments); };
  };
  YAMB = {
    App: (function() {
      App = function() {
        this.element_selector = '#output';
        debug.log("binding");
        $(window).hashchange(__bind(function(event) {
          return this.hashchange(event);
        }, this));
        this.set_hash_clicks();
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
        host = event.getState('host');
        db = event.getState('db');
        debug.log("changed hash to host " + (host) + " db " + (db));
        if (!(typeof host !== "undefined" && host !== null)) {
          host = 'localhost';
          state = {
            host: host
          };
          return $.bbq.pushState(state);
        } else {
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
          debug.log("clicked host " + (hostname) + " db " + (db) + " - setting state");
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
        return $.ajax({
          url: url,
          dataType: 'json',
          data: null,
          success: function(data) {
            return data.success ? that.renderView(viewSel, data.payload) : that.renderView("#error-view", data.payload);
          },
          error: function(request, textStatus, error) {
            return that.renderView("#error-view", that.errorformat(textStatus, error));
          }
        });
      };
      App.prototype.load_host = function(hostname) {
        return this.load_generic("/" + (hostname) + ".json", "#host-view");
      };
      App.prototype.load_db = function(hostname, db) {
        return this.load_generic("/" + (hostname) + "/" + (db) + ".json", "#db-view");
      };
      return App;
    })()
  };
  $(function() {
    window.YAMB = YAMB;
    return (window.YambApp = new YAMB.App());
  });
}).call(this);
