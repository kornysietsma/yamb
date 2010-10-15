# namespace
YAMB =
  # application
  app: $.sammy ->
     app = this
     @data = {}
     @use Sammy.Mustache
     @element_selector = '#output'

     @get '#/', -> @redirect('#/localhost')

     @get '#/:host', ->
        app.load_host this.params['host']

     @load_host = (hostname) ->
        $.getJSON "/#{hostname}.json",
                  null,
                  (hostdata) ->
                     app.data.host = hostdata
                     app.trigger 'data-updated'

     @bind 'data-updated', ->
       ctx = this
       if app.data.host.success
         ctx.partial($("#host-view"),app.data.host)
       else
         ctx.partial($("#host-error-view"),app.data.host)

$( ->
     window.YAMB = YAMB if window?  # expose globally for debugging
     YAMB.app.run('#/')
)
