class YambApp
  constructor: ->
    @outputElement = '#output'
    # url-based state will include:
    #  host: current host/port (or none if none selected)
    #  db: current db (or none if none selected)
    #  more as we get there...

    debug.log "binding"
    $(window).hashchange (event) => @hashchange(event)
    @bindStateLinks()
    $(window).hashchange()

  renderView: (viewSel,data) ->
    view = Mustache.to_html($(viewSel).html(),data)
    $(@outputElement).html(view)

  hashchange: (event) ->
    host = event.getState 'host'
    db = event.getState 'db'
    debug.log "changed hash to host #{host} db #{db}"
    # emulate old behaviour - for now - two states, one showing host, one showing db
    #  - change view twice, once to show loading, once when loaded
    unless host?
      host = 'localhost'
      state = {host:host}
      $.bbq.pushState(state)
    else
      if host && db
        @renderView("#db-view",{hostname: host, database: db, loading:true})
        @loadDb(host,db)
      else
        @renderView("#host-view",{hostname: host, database: '', loading:true})
        @loadHost(host)

  bindStateLinks: ->
    $('#output a[href^=#]').live 'click', (e) ->
      hostname = $(this).attr("data-hostname")
      db = $(this).attr("data-db")
      debug.log "clicked host #{hostname} db #{db} - setting state"
      state = {host:hostname, db:db}
      $.bbq.pushState(state)
      false

  formatErrorState: (textStatus, error) ->
    { message: "#{textStatus}: #{error}" }

  loadGeneric: (url, viewSel) ->
    that = this
    $.ajax
      url: url
      dataType: 'json'
      data: null
      success: (data) ->
        if data.success
          that.renderView(viewSel,data.payload)
        else
          that.renderView("#error-view",data.payload)
      error: (request, textStatus, error) ->
        that.renderView("#error-view", that.formatErrorState(textStatus,error))

  loadHost: (hostname) ->
    @loadGeneric("/#{hostname}.json","#host-view")

  loadDb: (hostname,db) ->
    @loadGeneric("/#{hostname}/#{db}.json","#db-view")

$( ->
  # expose a namespace for external use
  window.YAMB =
    App: YambApp
    the_app: new YambApp  # create (and kick off) the application instance
)
