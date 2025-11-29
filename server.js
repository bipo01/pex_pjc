import express from "express";
import session from "express-session";
import pg from "pg";
import bodyParser from "body-parser";

import env from "dotenv";
env.config();

import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(
	session({
		secret: "pex_pjc",
		resave: false,
		saveUninitialized: false,
		cookie: { secure: false },
	})
);

const db = new pg.Client({
	connectionString: process.env.DATABASE_URL,
});
db.connect();

app.get("/login", (req, res) => {
	res.sendFile(path.join(__dirname, "public/login.html"));
});

app.post("/login", async (req, res) => {
	const { username, password } = req.body;
	const result = await db.query("SELECT * FROM users_pex_pjc WHERE username = $1 AND password = $2", [username, password]);
	const data = result.rows[0];
	if (!data) return res.sendFile(path.join(__dirname, "public/acessoNegado.html"));

	req.session.user = data;
	return res.redirect("/");
});

app.get("/", (req, res) => {
	if (!req.session.user) {
		return res.redirect("/login");
	} else {
		res.sendFile(path.join(__dirname, "public/index.html"));
	}
});

app.get("/ticket_log", (req, res) => {
	if (!req.session.user) return res.redirect("/login");
	res.sendFile(path.join(__dirname, "public/ticket_log/index.html"));
});
app.get("/checagem_os", (req, res) => {
	if (!req.session.user) return res.redirect("/login");
	res.sendFile(path.join(__dirname, "public/checagem_os/index.html"));
});
app.get("/pneus", (req, res) => {
	if (!req.session.user) return res.redirect("/login");
	res.sendFile(path.join(__dirname, "public/pneus/index.html"));
});

app.get("/logout", (req, res) => {
	req.session.destroy((err) => {
		if (err) return res.redirect("/");
		res.clearCookie("connect.sid");
		return res.redirect("/login");
	});
});

app.use(express.static("public"));

app.listen(port, () => {
	console.log(`Server running on port ${port}`);
});
