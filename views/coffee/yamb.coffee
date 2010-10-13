class Yamb
  constructor: ->
    @items = []
    @load_context()
    @load_items()

  load_items: ->
    yamb = this
    $.getJSON("/items.json",
                null,
                (data) ->
                    yamb.update_items(data)
    )

  update_items: (items) ->
    @items = items
    @context.refresh()

  load_context: ->
    yamb = this
    @context =
      $.sammy( ->
         @use Sammy.Mustache
         @element_selector = '#items'
         @get '#/', (context) ->
            yamb.show_all(context)
         @get '#/items/:index', (context) ->
            yamb.show_item(context.params['index'],context)
      )

    @context.run('#/')

  show_all: (context) ->
    # @items is a hash, mustache wants an array:
    item_list = { index: key, title:data.title, body:data.body } for key, data of @items
    context.log item_list
    context.partial($("#all-view"),{items: item_list})

  show_item: (index, context) ->
    item = @items[index]
    context.partial($("#item-view"),item)

$( ->
     yamb =  new Yamb()
     window.YAMB = yamb # really just to aid debugging
)
