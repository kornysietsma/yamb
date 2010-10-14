# namespace
YAMB =
  # application
  app: $.sammy ->
     app = this
     @data = {}
     @use Sammy.Mustache
     @element_selector = '#output'

     @get '#/', ->
       @redirect('#/localhost')

     @get '#/:host', ->
        app.log("in :host")
        app.load_host this.params['host']

     @load_host = (hostname) ->
        app.log("load_host")
        $.getJSON "/#{hostname}.json",
                  null,
                  (hostdata) ->
                     app.data.host = hostdata
                     app.trigger 'data-updated'

     @bind 'data-updated', ->
       ctx = this
       app.log "show_host"
       if app.data.host.success
         ctx.partial($("#host-view"),app.data.host)
       else
         ctx.partial($("#host-error-view"),app.data.host)

$( ->
     window.YAMB = YAMB if window?  # expose globally for debugging
     YAMB.app.run('#/')
)
