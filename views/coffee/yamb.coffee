class Yamb
  constructor: ->
    @hostdata = {}
    @load_context()

  load_host: (hostname) ->
    yamb = this
    $.getJSON("/#{hostname}.json",
                null,
                (data) ->
                    yamb.update_host(hostname,data)
                # TODO: handle no response!!!
    )

  update_host: (hostname, data) ->
    @hostdata = data
    @context.trigger 'show_host'

  show_host: (context) ->
    if @hostdata.success
      context.partial($("#host-view"),@hostdata)
    else
      context.partial($("#host-error-view"),@hostdata)

  load_context: ->
    yamb = this
    @context =
      $.sammy( ->
         @use Sammy.Mustache
         @element_selector = '#output'
         @get '#/', (context) ->
           context.redirect('#/localhost')
         @get '#/:host', (context) ->
            yamb.load_host(context.params['host'])
         @bind 'show_host', ->
           yamb.show_host(this)
      )
    @context.run('#/localhost')


$( ->
     yamb =  new Yamb()
     window.YAMB = yamb # really just to aid debugging
)
