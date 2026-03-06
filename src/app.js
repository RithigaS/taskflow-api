"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const compression_1 = __importDefault(require("compression"));
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const task_routes_1 = __importDefault(require("./routes/task.routes"));
const health_routes_1 = __importDefault(require("./routes/health.routes"));
const task_validators_1 = require("./validators/task.validators");
const validateRequest_1 = require("./middleware/validateRequest");
const project_routes_1 = __importDefault(require("./routes/project.routes"));
const maintenance_routes_1 = __importDefault(require("./routes/maintenance.routes"));
const logger_1 = require("./middleware/logger");
const rateLimit_1 = require("./middleware/rateLimit");
const requestId_1 = require("./middleware/requestId");
const comment_routes_1 = __importDefault(require("./routes/comment.routes"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const swagger_1 = require("./config/swagger");
const app = (0, express_1.default)();
app.use(requestId_1.requestId);
app.use(logger_1.logger);
app.use((0, compression_1.default)());
app.use(express_1.default.json());
app.use(rateLimit_1.apiLimiter);
/* ================= MAIN ROUTES ================= */
app.use("/api/auth", rateLimit_1.authLimiter, auth_routes_1.default);
app.use("/api/tasks", task_routes_1.default);
app.use("/api/health", health_routes_1.default);
app.use("/api/projects", project_routes_1.default);
app.use("/api/comments", comment_routes_1.default);
app.use("/api/maintenance", maintenance_routes_1.default);
/* ================= TEST ROUTE FOR VALIDATOR ================= */
app.post("/test", task_validators_1.createTaskValidator, validateRequest_1.validateRequest, (req, res) => {
    res.status(200).json({
        success: true,
        body: req.body,
    });
});
app.use("/api-docs", swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swagger_1.swaggerSpec));
exports.default = app;
