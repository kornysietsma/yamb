# namespace
YAMB =
  # application
  app: $.sammy ->
     app = this
     @data =
        mode: "initial"
     @loadcount = 0
     @use Sammy.Mustache
     @element_selector = '#output'

     @get '#/', -> @redirect('#/localhost')

     @get '#/:host', ->
        app.load_host this.params['host']

     @get '#/:host/:db', ->
        app.load_db this.params['host'], this.params['db']

     @newData = (mode, payload) ->
       app.data.mode = mode
       app.data.payload = payload
       app.trigger 'data-updated'

     @errorformat = (textStatus, error) ->
       { message: textStatus }

     @load_generic = (url, newmode) ->
        app.loadStart()
        $.ajax
          url: url
          dataType: 'json'
          data: null
          success: (data) ->
            app.loadFinish()
            if data.success
              app.newData(newmode,data.payload)
            else
              app.newData("error",data.payload)
          error: (request, textStatus, error) ->
            app.loadFinish()
            app.newData("error", app.errorformat(textStatus,error))

     @load_host = (hostname) ->
       @load_generic("/#{hostname}.json","host")

     @load_db = (hostname,db) ->
       @load_generic("/#{hostname}/#{db}.json","db")

     @loadStart = ->
        @loadcount += 1
        $("#loading").show() if @loadcount == 1

     @loadFinish = ->
        @loadcount -= 1
        $("#loading").hide() if @loadcount == 0

     @bind 'data-updated', ->
       ctx = this
       ctx.log "handling mode: #{app.data.mode}"
       switch app.data.mode
         when "host"
           ctx.partial($("#host-view"),app.data.payload)
         when "db"
           ctx.partial($("#db-view"),app.data.payload)
         when "error"
           ctx.partial($("#error-view"),app.data.payload)
         else
           ctx.partial($("#error-view"),{ message: "unexpected mode: #{app.data.mode}" } )

$( ->
     window.YAMB = YAMB if window?  # expose globally for debugging
     YAMB.app.run('#/')
)
