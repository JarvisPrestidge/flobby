const myComponent = require("./views/pages/home/index.marko");

myComponent.renderSync().appendTo(document.body);
