var GelatoPage = require('gelato/page');
var AdminPayments = require('collections/admin-payments');
var config = require('config');

/**
 * @class Admin
 * @extends {GelatoPage}
 */
var Admin = GelatoPage.extend({
  /**
   * @method initialize
   * @constructor
   */
  initialize: function() {
    this.payments = new AdminPayments();
    this.dateStart = moment().subtract(5, 'days');
    this.dateEnd = moment();
    this.listenTo(this.payments, 'state', this.render);
    this.loadSubscriptions();
  },
  /**
   * @property title
   * @type {String}
   */
  title: 'Admin - Skritter',
  /**
   * @property template
   * @type {Function}
   */
  template: require('./template'),
  /**
   * @method render
   * @returns {Admin}
   */
  render: function() {
    this.renderTemplate();
    this.$('#date-range-picker').daterangepicker(
      {
        startDate: this.dateStart,
        endDate: this.dateEnd,
        maxDate: moment(),
        locale: {
          format: 'YYYY-MM-DD'
        }
      },
      _.bind(this.handleChangeDate, this)
    );
    return this;
  },
  /**
   * @method remove
   * @returns {Admin}
   */
  remove: function() {
    return GelatoPage.prototype.remove.call(this);
  },
  /**
   * @method handleChangeDate
   * @params {String} start
   * @params {String} end
   */
  handleChangeDate: function(start, end) {
    this.dateEnd = end;
    this.dateStart = start;
    this.loadSubscriptions();
  },
  /**
   * @method loadSubscriptions
   * @returns {Admin}
   */
  loadSubscriptions: function() {
    this.payments.fetch({
      data: {
        dateEnd: this.dateEnd.format('YYYY-MM-DD'),
        dateStart: this.dateStart.format('YYYY-MM-DD'),
        limit: 5000
      }
    });
    return this;
  }
});

module.exports = Admin;
