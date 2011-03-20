$(function() {

  /*
   * A tally has a few properties:
   * - a title
   * - a count
   * - an order
   */
  window.Tally = Backbone.Model.extend({
    EMPTY: 'Tally',

    // Implement initialize().
    initialize: function() {
      if (!this.get('title')) {
        this.set({'title': this.EMPTY});
      }
    },

    // Add a mark to a tally.
    mark: function() {
      this.save({'count': this.get('count') + 1});
    },

    // Override clear().
    clear: function() {
      this.destroy();
      this.view.remove();
    }
  });

  // List of tallies.
  window.TallyList = Backbone.Collection.extend({
    model: Tally,

    localStorage: new Store('tally'),

    // Creates the next index.
    nextOrder: function() {
      if (!this.length) return 1;
      return this.last().get('order') + 1;
    },

    // Override comparator().
    comparator: function(tally) {
      return tally.get('order');
    }
  });
  window.Tallies = new TallyList; // Instantiate.

  // View for individual tallies.
  window.TallyView = Backbone.View.extend({
    // Override tagName.
    tagName: 'li',

    template: _.template($('#item-template').html()),

    // Implement events.
    events: {
      'click .tally-title': 'markTally',
      'swipeRight .tally-title': 'toggleDestroy',
      'click .tally-destroy': 'clear'
    },

    // Implement initialize().
    initialize: function() {
      _.bindAll(this, 'render');
      this.model.bind('change', this.render);
      this.model.view = this;
    },

    // Implement render().
    render: function() {
      $(this.el).html(this.template(this.model.toJSON()));
      // this.$('.tally-title').text(this.model.get('title'));
      // this.$('.tally-count').text(this.model.get('count'));
      return this;
    },

    markTally: function() {
      this.model.mark();
    },

    toggleDestroy: function() {
      $(this.el).find('.tally-destroy').toggleClass('hide');
    },

    clear: function() {
      this.model.clear();
    },

    // Override remove().
    remove: function() {
      $(this.el).remove();
    }
  });

  // View for the whole app.
  window.AppView = Backbone.View.extend({
    // Override el.
    el: $('#tallyapp'),

    // Implement events.
    events: {
      'keypress #new-tally': 'createOnEnter',
      'click #create': 'createTally'
    },

    // Implement initialize().
    initialize: function() {
      _.bindAll(this, 'addOne', 'addAll');

      this.input = this.$('#new-tally');

      // React to app events.
      Tallies.bind('add', this.addOne);
      Tallies.bind('refresh', this.addAll);

      // Retrieve existing tallies on load.
      Tallies.fetch();
    },

    addOne: function(tally) {
      var view = new TallyView({model: tally});
      this.$('#tally-list').append(view.render().el);
    },

    addAll: function() {
      Tallies.each(this.addOne);
    },

    newAttributes: function () {
      return {
        title: this.input.val(),
        order: Tallies.nextOrder(),
        count: 0
      };
    },

    createOnEnter: function(e) {
      if (e.keyCode != 13) return;
      this.createTally();
    },

    createTally: function() {
      Tallies.create(this.newAttributes());
      this.input.val('');
    }

  });
  window.App = new AppView; // Rock and roll.

});
