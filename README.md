# Suppliers in Novosibirsk

The interface designer sent out drafts for the new project. The customer has already approved them, so it's time to take up work.

Let's start with the layout of the main pages, while in the form of statics.

### Where see result
1. https://velios.github.io/22_proto_markup/ - main page
2. https://velios.github.io/22_proto_markup/requests.html - requests page

### Cross-browser compatibility: IE9+

### Assembly workflow

2. Install Node Modules: npm i
3. Run the template: gulp

### Site is tested on W3C Markup Validation Service

To check this follow the [W3C Markup Validation Service link](https://validator.w3.org/nu/?doc=https%3A%2F%2Fvelios.github.io%2F22_proto_markup%2F)

### Structure
* `app/` - source folder for development reasons
  * `app/fonts` - fonts
  * `app/img` - raw images
  * `app/jinja_templates` - templates render with [nunjucks gulp plugin](https://www.npmjs.com/package/gulp-nunjucks) use jinja syntax
  * `app/js` - js source
  * `app/libs` - plugins downloaded by bower
  * `app/sass` - sass sources
* `sketches/` - page drafts in png and [balsamiq mockup](https://balsamiq.com/download/) format
* `static/` - compiled and minified result css, js, img and other resourse file
* `/` - result html and assembly system files

# Project Goals

The code is written for educational purposes. Training course for web-developers - [DEVMAN.org](https://devman.org)
