import swaggerJsdoc from "swagger-jsdoc";

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "You Book API",
      version: "1.0.0",
      description: "API documentation for You Book",
    },
    servers: [
      {
        url: `${process.env.BACKEND_URL}`, // Update this with your server URL
      },
    ],
  },
  apis: ["./src/docs/*.js", "./src/routes/*.js"], // Include the docs folder and route files
};

const swaggerSpecs = swaggerJsdoc(swaggerOptions);

export default swaggerSpecs;
