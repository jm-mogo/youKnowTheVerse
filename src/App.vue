<script setup>
import { Analytics } from "@vercel/analytics/vue";
import { ref } from "vue";
import GameView from "./views/GameView.vue";
import MenuView from "./views/MenuView.vue";

const dificulty = ref(1);
const booksSpan = ref("new");
const isMenu = ref(true);
const books = ref([]);

const getAllBooks = async () => {
	const response = await fetch("https://bible-api.deno.dev/api/books");
	books.value = await response.json();
};

getAllBooks();

const updateDificulty = (event) => {
	dificulty.value = Number(event.target.value);
};

const updateBooksSpan = (event) => {
	booksSpan.value = event.target.value;
};

const changeView = () => {
	isMenu.value = !isMenu.value;
};
</script>

<template>
	<div class="app-container">
		<Analytics />
		<header>
			<nav>
				<div class="logo">BibleGuessr</div>
				<button class="btn-header" @click="isMenu = true">Home</button>
			</nav>
		</header>

		<main>
			<MenuView
				v-if="isMenu"
				:updateDificulty="updateDificulty"
				:updateBooksSpan="updateBooksSpan"
				:dificulty="dificulty"
				:booksSpan="booksSpan"
			>
				<button class="btn btn-primary btn-large" @click="changeView">
					Comenzar juego
				</button>
			</MenuView>

			<GameView
				v-else
				:dificulty="dificulty"
				:booksSpan="booksSpan"
				:books="books"
				@play-again="isMenu = true"
			>
			</GameView>
		</main>

		<!-- NEW FOOTER SECTION -->
		<footer>
			<div class="footer-content">
				<div class="copyright">
					© {{ new Date().getFullYear() }} jm-mogo
				</div>
				<div class="social-links">
					<!-- IMPORTANT: Replace href="#" with your actual profile links -->
					<a
						href="https://github.com/jm-mogo"
						target="_blank"
						rel="noopener noreferrer"
						aria-label="GitHub Profile"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="24"
							height="24"
							viewBox="0 0 24 24"
							fill="currentColor"
						>
							<path
								d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.91 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"
							/>
						</svg>
					</a>
					<a
						href="https://instagram.com/j_mogo"
						target="_blank"
						rel="noopener noreferrer"
						aria-label="Instagram Profile"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="24"
							height="24"
							viewBox="0 0 24 24"
							fill="currentColor"
						>
							<path
								d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.85s-.012 3.584-.07 4.85c-.148 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.069-4.85.069s-3.584-.012-4.85-.07c-3.252-.148-4.771-1.691-4.919-4.919-.058-1.265-.069-1.645-.069-4.85s.012-3.584.07-4.85c.148-3.225 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.85-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948s.014 3.667.072 4.947c.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072s3.667-.014 4.947-.072c4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.947s-.014-3.667-.072-4.947c-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.162 6.162 6.162 6.162-2.759 6.162-6.162-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4s1.791-4 4-4 4 1.79 4 4-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.441 1.441 1.441 1.441-.645 1.441-1.441-.645-1.44-1.441-1.44z"
							/>
						</svg>
					</a>
				</div>
			</div>
		</footer>
		<!-- END OF NEW FOOTER -->
	</div>
</template>

<!-- GLOBAL STYLES (not scoped) -->
<style>
/* --- Import Google Fonts --- */
@import url("https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&family=Lora:ital,wght@0,400;0,700;1,400&display=swap");

/* --- CSS Reset and Base Styles --- */
* {
	box-sizing: border-box;
	margin: 0;
	padding: 0;
}

html,
body {
	height: 100%;
}

body {
	font-family: "Inter", sans-serif;
	background-color: #f4f7f9;
	color: #333;
}

/* Flexbox layout to push footer to the bottom */
#app {
	height: 100%;
}
.app-container {
	min-height: 100%;
	display: flex;
	flex-direction: column;
}
main {
	padding: 20px;
	flex-grow: 1; /* Allows main content to take up available space */
}

/* --- Reusable Button Styles --- */
.btn {
	font-family: "Inter", sans-serif;
	font-weight: 500;
	font-size: 1rem;
	padding: 12px 24px;
	border-radius: 8px;
	border: none;
	cursor: pointer;
	transition: background-color 0.3s, transform 0.2s;
	text-decoration: none;
	display: inline-block;
}
.btn:hover {
	transform: translateY(-2px);
}
.btn-primary {
	background-color: #3498db;
	color: white;
}
.btn-primary:hover {
	background-color: #2980b9;
}
.btn-large {
	font-size: 1.2rem;
	padding: 14px 32px;
}
</style>

<!-- SCOPED STYLES for App.vue -->
<style scoped>
header {
	height: 60px;
	width: 100%;
	background-color: #3498db;
	padding: 0 20px;
	color: white;
	display: flex;
	align-items: center;
	justify-content: center;
	box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
	flex-shrink: 0; /* Prevents header from shrinking */
}

nav {
	width: 100%;
	max-width: 800px;
	height: 100%;
	display: flex;
	align-items: center;
	justify-content: space-between;
}

.logo {
	font-weight: 700;
	font-size: 1.5rem;
}

.btn-header {
	appearance: none;
	border: 1px solid white;
	background: transparent;
	color: white;
	padding: 8px 16px;
	border-radius: 6px;
	font-weight: 500;
	font-size: 1rem;
	cursor: pointer;
	transition: background-color 0.3s, color 0.3s;
}

.btn-header:hover {
	background-color: white;
	color: #3498db;
}

/* --- NEW FOOTER STYLES --- */
footer {
	background-color: #2c3e50; /* Dark slate blue */
	color: #bdc3c7; /* Light gray text for contrast */
	padding: 20px;
	text-align: center;
	flex-shrink: 0; /* Prevents footer from shrinking */
}

.footer-content {
	max-width: 800px;
	margin: 0 auto;
	display: flex;
	justify-content: space-between;
	align-items: center;
	flex-wrap: wrap; /* Allows items to stack on small screens */
	gap: 1rem;
}

.copyright {
	font-size: 0.9rem;
}

.social-links {
	display: flex;
	gap: 1.5rem;
}

.social-links a {
	color: #bdc3c7;
	transition: color 0.3s, transform 0.3s;
	display: inline-block;
}

.social-links a:hover {
	color: #ffffff; /* Brighter on hover */
	transform: scale(1.1);
}

/* Responsive adjustment for the footer */
@media (max-width: 500px) {
	.footer-content {
		flex-direction: column;
		justify-content: center;
	}
}
</style>
