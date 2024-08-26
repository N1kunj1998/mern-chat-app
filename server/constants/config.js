const corsOptions = {
    origin: ["http://localhost:5173", "http://localhost:4173", process.env.CLIENT_URL],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
};

const CHAT_APP_TOKEN = "chat-app-token";
const CHAT_ADMIN_TOKEN = "chat-admin-token";

export { corsOptions, CHAT_APP_TOKEN, CHAT_ADMIN_TOKEN };