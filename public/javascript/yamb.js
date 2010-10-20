(function() {
  var YambApp;
  var __bind = function(func, context) {
    return function(){ return func.apply(context, arguments); };
  };
  YambApp = function() {
    this.outputElement = '#output';
    debug.log("binding");
    $(window).hashchange(__bind(function(event) {
      return this.hashchange(event);
    }, this));
    this.bindStateLinks();
    $(window).hashchange();
    return this;
  };
  YambApp.prototype.renderView = function(viewSel, data) {
    var view;
    view = Mustache.to_html($(viewSel).html(), data);
    return $(this.outputElement).html(view);
  };
  YambApp.prototype.hashchange = function(event) {
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
  YambApp.prototype.bindStateLinks = function() {
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
  YambApp.prototype.formatErrorState = function(textStatus, error) {
    return {
      message: ("" + (textStatus) + ": " + (error))
    };
  };
  YambApp.prototype.loadGeneric = function(url, viewSel) {
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
  YambApp.prototype.loadHost = function(hostname) {
    return this.loadGeneric("/" + (hostname) + ".json", "#host-view");
  };
  YambApp.prototype.loadDb = function(hostname, db) {
    return this.loadGeneric("/" + (hostname) + "/" + (db) + ".json", "#db-view");
  };
  $(function() {
    return (window.YAMB = {
      App: YambApp,
      the_app: new YambApp()
    });
  });
}).call(this);
