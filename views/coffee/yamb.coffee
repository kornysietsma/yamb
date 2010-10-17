# namespace
YAMB =
  # application
  App: class App
     constructor: ->
       @element_selector = '#output'
       # url-based state will include:
       #  host: current host/port (or none if none selected)
       #  db: current db (or none if none selected)
       #  more as we get there...

       debug.log "binding"
       $(window).hashchange (event) => @hashchange(event)
       @set_hash_clicks()
       $(window).hashchange()

     renderView: (viewSel,data) ->
        view = Mustache.to_html($(viewSel).html(),data)
        $(@element_selector).html(view)

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
            @load_db(host,db)
          else
            @renderView("#host-view",{hostname: host, database: '', loading:true})
            @load_host(host)

     set_hash_clicks: ->
       $('#output a[href^=#]').live 'click', (e) ->
         hostname = $(this).attr("data-hostname")
         db = $(this).attr("data-db")
         debug.log "clicked host #{hostname} db #{db} - setting state"
         state = {host:hostname, db:db}
         $.bbq.pushState(state)
         false

     errorformat: (textStatus, error) ->
       { message: textStatus }

     load_generic: (url, viewSel) ->
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
            that.renderView("#error-view", that.errorformat(textStatus,error))

     load_host: (hostname) ->
       @load_generic("/#{hostname}.json","#host-view")

     load_db: (hostname,db) ->
       @load_generic("/#{hostname}/#{db}.json","#db-view")

$( ->
     window.YAMB = YAMB
     window.YambApp = new YAMB.App # expose globally for debugging
)
