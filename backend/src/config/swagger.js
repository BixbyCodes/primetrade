const swaggerJsdoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Primetrade API",
      version: "1.0.0",
      description: "REST API with JWT Authentication & Role-Based Access Control",
      contact: { name: "API Support", email: "support@primetrade.ai" },
    },
    servers: [{ url: "http://localhost:5000/api/v1", description: "Development Server" }],
    components: {
      securitySchemes: {
        BearerAuth: { type: "http", scheme: "bearer", bearerFormat: "JWT" },
      },
    },
  },
  apis: ["./src/routes/v1/*.js"],
};

module.exports = swaggerJsdoc(options);
