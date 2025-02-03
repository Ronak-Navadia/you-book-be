import path from "path";

// Configure Handlebars options
const handlebarOptions = {
    viewEngine: {
        extname: ".hbs",
        partialsDir: path.resolve("src/templates"),
        defaultLayout: false,
    },
    viewPath: path.resolve("src/templates"),
    extName: ".hbs",
};

export default handlebarOptions;
