Views
-----

* Use `Em.View` to link JS to a portion of HTML and provide necessary
  bindings for data and handle any events (clicks, key presses etc).

* Do not perform any business logic in the views, but call appropriate
  controllers instead.


Controllers
-----------

* Use for handling operations with data.

* Controllers don't access views, but only models. Views bind to
  controllers and observe their property changes instead.


View Templates
--------------

* If a Handlebar template has a name, it won't be rendered into the page
  upon load.

* To link a template to a certain JS view, define a view like this:

  * details_view.js

        App.MyView = Em.View.extend({
          templateName: 'details-view',
          firstName: 'Mark'
        });


  * index.html

        <div class='data'>
          {{view App.MyView}}
        </div>

        ...

        <script type="text/x-handlebars" data-template-name="details-view">
          {{firstName}}
        </script>

