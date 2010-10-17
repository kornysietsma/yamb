(function() {
  var App, YAMB;
  var __bind = function(func, context) {
    return function(){ return func.apply(context, arguments); };
  };
  YAMB = {
    App: (function() {
      App = function() {
        this.outputElement = '#output';
        debug.log("binding");
        $(window).hashchange(__bind(function(event) {
          return this.hashchange(event);
        }, this));
        this.bindStateLinks();
        $(window).hashchange();
        return this;
      };
      App.prototype.renderView = function(viewSel, data) {
        var view;
        view = Mustache.to_html($(viewSel).html(), data);
        return $(this.outputElement).html(view);
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
            return this.loadDb(host, db);
          } else {
            this.renderView("#host-view", {
              hostname: host,
              database: '',
              loading: true
            });
            return this.loadHost(host);
          }
        }
      };
      App.prototype.bindStateLinks = function() {
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
      App.prototype.formatErrorState = function(textStatus, error) {
        return {
          message: textStatus
        };
      };
      App.prototype.loadGeneric = function(url, viewSel) {
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
            return that.renderView("#error-view", that.formatErrorState(textStatus, error));
          }
        });
      };
      App.prototype.loadHost = function(hostname) {
        return this.loadGeneric("/" + (hostname) + ".json", "#host-view");
      };
      App.prototype.loadDb = function(hostname, db) {
        return this.loadGeneric("/" + (hostname) + "/" + (db) + ".json", "#db-view");
      };
      return App;
    })()
  };
  $(function() {
    window.YAMB = YAMB;
    return (window.YambApp = new YAMB.App());
  });
}).call(this);
