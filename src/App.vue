<script setup>
import { ref } from "vue";
import GameView from "./views/GameView.vue";
import MenuView from "./views/MenuView.vue";
const dificulty = ref(1);
const booksSpan = ref("new");
const isMenu = ref(true);
const books = ref({});

const getAllBooks = async () => {
	const response = await fetch(
		"https://api.getbible.net/v2/valera/books.json"
	);

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
	<header>
		<nav>
			<button v-if="!isMenu" @click="changeView">Home</button>
			<button v-else>Home</button>
		</nav>
	</header>

	<MenuView
		v-if="isMenu"
		:updateDificulty="updateDificulty"
		:updateBooksSpan="updateBooksSpan"
		:dificulty="dificulty"
		:booksSpan="booksSpan"
	>
		<button @click="changeView">Comenzar juego</button>
	</MenuView>

	<GameView
		v-else
		:dificulty="dificulty"
		:booksSpan="booksSpan"
		:books="books"
	>
	</GameView>
</template>

<style scoped>
header {
	height: 42px;
	width: 100%;
	background-color: blue;
	padding: 12px;
}

nav {
	max-width: 800px;
	height: 100%;
	margin: auto;
	display: flex;
	align-items: center;
	justify-content: flex-end;
}

nav button {
	appearance: none;
	border: none;
	background: none;
	color: white;
	font-weight: bold;
	font-size: 1.4rem;
}
</style>
