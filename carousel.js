//configurable constants
const step = 1;
const showBlocks = 4;
const blocksUrl = '/blocksCollection';


//block model
const Block = Backbone.Model.extend({
  defaults: {
    title: 'Block',
    images: [
      "https://farm5.staticflickr.com/4495/38070576341_4cf23feed5_o.jpg"
      ]
    }
  });

//blocks collection
const BlocksCollection = Backbone.Collection.extend({
  model: Block,
  url: blocksUrl,
});

//carousel view
const CarouselView = Backbone.View.extend({
  tagName: 'div',
  events: {
    'click #carousel-prev': 'prev',
    'click #carousel-next': 'next'
  },

  initialize: function() {
    _.bindAll(this, 'prev', 'next', 'render', 'initDefine');
    this.listenTo(this.collection, 'reset', this.initDefine);

},

  initDefine: function(){
    this.current = 0;
    $("#carousel-prev").attr("disabled", true);
    if (this.collection.length) {
    if (this.collection.length <= this.current + showBlocks) {
      $("#carousel-next").attr("disabled", true);
    }
    Object.keys(this.collection.models).forEach(function(key){
      const block = this.collection.models[key];
      const blockView = new BlockView({ model: block });
      this.$el.append(blockView.render().el);
      }, this);
    this.carouselBlocks = _.map(this.$('.carousel-item').hide(), function(i) { return i; });
  };
    this.render();
  },

  render: function(){
    if (this.carouselBlocks) {
      this.carouselBlocks.forEach(function(block){
        const blockIndex = this.carouselBlocks.indexOf(block);
        if (blockIndex >= this.current && blockIndex <= this.current + showBlocks - 1){
          $(block).show();
        }
        else {
          $(block).hide();
        }
          }, this);
        };
    return this;
    },

    prev: function() {
      this.current = this.current - step;
      $("#carousel-next").removeAttr("disabled");
      if (this.current <= 0) {
        $("#carousel-prev").attr("disabled", true);
      }
      this.render();
    },

    next: function() {
      $("#carousel-prev").removeAttr("disabled");
      this.current = this.current + step;
      if (this.current >= this.collection.length - showBlocks) {
        $("#carousel-next").attr("disabled", true);
        }
      this.render();
    }
});

//one block view
const BlockView = Backbone.View.extend({
  tagName: 'div',

  template: _.template($('#blockTemplate').html() ),

  render: function(){
    const randomIndex = Math.floor(Math.random() * this.model.attributes.images.length);
    this.model.attributes.image = this.model.attributes.images[randomIndex],
    this.$el.html( this.template(this.model.toJSON()) );
    return this;
  }

});

const blocksCollection = new BlocksCollection();
blocksCollection.fetch({
  reset:true,
  error: function(error){
    console.log(error);
  }
});

const carouselView = new CarouselView({ el: '#my-carousel', collection: blocksCollection }).render();
