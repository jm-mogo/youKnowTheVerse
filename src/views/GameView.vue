<script setup>
import { ref, watch } from "vue";

const { dificulty, booksSpan, books } = defineProps([
	"dificulty",
	"booksSpan",
	"books",
]);

const emit = defineEmits(["play-again"]);

const booksLength = 65;
const bookId = ref(0);
const lives = ref(3);
const points = ref(0);
const isAnswer = ref(false);
const bookGuess = ref("");
const chapterGuess = ref("");
const verseGuess = ref("");
const book = ref({});
const text = ref({});
const visible = ref(false);
const isLoading = ref(true); // NEW: State to track loading status, true on init

const getRandom = (number) => Math.floor(Math.random() * number);
const changeVisible = (isVisible = !visible.value) =>
	(visible.value = isVisible);
const getBookNT = () => getRandom(booksLength - 39) + 39;
const getBookOT = () => getRandom(booksLength - 27);
const getBook = () => getRandom(booksLength);

const getRandomBook = () => {
	if (booksSpan == "new") bookId.value = getBookNT();
	else if (booksSpan == "old") bookId.value = getBookOT();
	else bookId.value = getBook();
};

const nextVerse = () => {
	getRandomBook();
	changeVisible(false);
};

const cleanInputs = () => {
	bookGuess.value = "";
	chapterGuess.value = "";
	verseGuess.value = "";
};

const checkAnswer = () => {
	let isCorrect = false;
	const correctBook = book.value.name.toLowerCase().trim();
	const guessBook = bookGuess.value.toLowerCase().trim();

	switch (dificulty) {
		case 1:
			isCorrect = correctBook === guessBook;
			break;
		case 2:
			isCorrect =
				correctBook === guessBook &&
				text.value.chapter == chapterGuess.value;
			break;
		case 3:
			isCorrect =
				correctBook === guessBook &&
				text.value.chapter == chapterGuess.value &&
				text.value.verse == verseGuess.value;
			break;
	}

	if (isCorrect) {
		isAnswer.value = true;
		points.value++;
	} else {
		isAnswer.value = false;
		lives.value--;
	}
	cleanInputs();
	changeVisible(true);
};

// MODIFIED: Watcher now handles the isLoading state
watch(bookId, async () => {
	if (bookId > 66 || bookId < 1 || books.length === 0) return;

	isLoading.value = true; // START loading spinner

	try {
		const bookData = books[bookId.value];
		const bookName = bookData.names[0];
		const randomChapter = getRandom(bookData.chapters) + 1;
		const response = await fetch(
			`https://bible-api.deno.dev/api/read/rv1960/${bookName}/${randomChapter}`
		);
		const chapter = await response.json();
		book.value.name = bookName;
		const verse = chapter.vers[getRandom(chapter.vers.length)];
		text.value = {
			verse: verse.number,
			chapter: randomChapter,
			text: verse.verse,
		};
	} catch (error) {
		console.error("Failed to fetch verse:", error);
		// Optionally, you could set an error message here
		text.value = {
			text: "No se pudo cargar el versículo. Inténtalo de nuevo.",
		};
	} finally {
		isLoading.value = false; // STOP loading spinner, always
	}
});

getRandomBook();

const playAgain = () => {
	emit("play-again");
};
</script>

<template>
	<!-- Game Over View -->
	<div class="game-card" v-if="lives < 0">
		<h2 class="game-over-title">Juego Terminado</h2>
		<p class="final-score">Puntaje final: {{ points }}</p>
		<p class="final-info">
			Dificultad:
			{{
				dificulty == 1
					? "Solo libro"
					: dificulty == 2
					? "Libro y capítulo"
					: "Libro, capítulo y versículo"
			}}
		</p>
		<button class="btn btn-primary" @click="playAgain">
			Volver al Menú
		</button>
	</div>

	<!-- Main Game View -->
	<div class="game-card" v-else>
		<div class="info-bar">
			<p>
				Vidas: <span class="info-value">{{ lives }} ❤️</span>
			</p>
			<p>
				Puntos: <span class="info-value">{{ points }} ⭐</span>
			</p>
		</div>

		<!-- MODIFIED: Container to hold either the spinner or the verse -->
		<div class="verse-container">
			<div v-if="isLoading" class="spinner"></div>
			<p v-else class="verse">“{{ text.text }}”</p>
		</div>

		<!-- The rest of the template remains the same... -->
		<div class="result-container" v-show="visible">
			<div
				class="result"
				:class="{ correct: isAnswer, incorrect: !isAnswer }"
			>
				<strong>{{ isAnswer ? "¡Correcto!" : "¡Incorrecto!" }}</strong>
				<span
					>La cita era: {{ book.name }} {{ text.chapter }}:{{
						text.verse
					}}</span
				>
			</div>
			<button class="btn btn-primary" @click="nextVerse">
				Siguiente Versículo
			</button>
		</div>

		<form
			class="form"
			v-show="!visible && !isLoading"
			@submit.prevent="checkAnswer"
		>
			<div class="inputs-grid">
				<label for="name-guess">Libro</label>
				<input
					v-model="bookGuess"
					list="verse-quote"
					id="name-guess"
					name="name-guess"
					required
				/>

				<template v-if="dificulty >= 2">
					<label for="chapter-guess">Capítulo</label>
					<input
						v-model.number="chapterGuess"
						type="number"
						id="chapter-guess"
						name="chapter-guess"
						required
					/>
				</template>

				<template v-if="dificulty === 3">
					<label for="verse-guess">Versículo</label>
					<input
						v-model.number="verseGuess"
						type="number"
						id="verse-guess"
						name="verse-guess"
						required
					/>
				</template>
			</div>

			<datalist id="verse-quote">
				<option
					v-for="book in books"
					:key="book.id"
					:value="book.names[0]"
				></option>
			</datalist>
			<button class="btn btn-primary" type="submit">Comprobar</button>
		</form>
	</div>
</template>

<style scoped>
.game-card {
	background: #ffffff;
	max-width: 700px;
	margin: 20px auto;
	padding: 30px 40px;
	border-radius: 12px;
	box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 1.5rem;
}

/* --- Info Bar --- */
.info-bar {
	width: 100%;
	display: flex;
	justify-content: space-between;
	font-size: 1.1rem;
	font-weight: 500;
	color: #7f8c8d;
	padding-bottom: 1rem;
	border-bottom: 1px solid #ecf0f1;
}
.info-value {
	font-weight: 700;
	color: #2c3e50;
}

/* --- NEW: Verse container and Spinner Styles --- */
.verse-container {
	min-height: 120px; /* Give it a fixed height to prevent layout shifts */
	display: flex;
	align-items: center;
	justify-content: center;
	width: 100%;
}

.spinner {
	width: 50px;
	height: 50px;
	border: 5px solid #ecf0f1; /* Light grey */
	border-top-color: #3498db; /* Primary blue */
	border-radius: 50%;
	animation: spin 1s linear infinite;
}

@keyframes spin {
	to {
		transform: rotate(360deg);
	}
}

/* --- The Verse --- */
.verse {
	font-family: "Lora", serif;
	font-style: italic;
	font-size: 1.7rem;
	line-height: 1.6;
	text-align: center;
	color: #34495e;
	max-width: 90%;
}

/* --- Form and Inputs --- */
.form {
	width: 100%;
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 1.5rem;
}
.inputs-grid {
	display: grid;
	grid-template-columns: 100px 1fr;
	gap: 1rem;
	width: 100%;
	max-width: 450px;
	align-items: center;
}
.inputs-grid label {
	font-weight: 500;
	text-align: right;
}
.inputs-grid input {
	width: 100%;
	padding: 12px 15px;
	border: 1px solid #bdc3c7;
	border-radius: 6px;
	font-size: 1rem;
	transition: border-color 0.3s, box-shadow 0.3s;
}
.inputs-grid input:focus {
	outline: none;
	border-color: #3498db;
	box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.2);
}

/* --- Result Feedback --- */
.result-container {
	width: 100%;
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 1.5rem;
}
.result {
	width: 100%;
	padding: 16px;
	border-radius: 8px;
	font-size: 1.1rem;
	text-align: center;
	line-height: 1.5;
	border: 1px solid;
}
.result strong {
	font-size: 1.5rem;
	display: block;
	margin-bottom: 8px;
}
.result.correct {
	background-color: #eafaf1;
	border-color: #2ecc71;
	color: #27ae60;
}
.result.incorrect {
	background-color: #fbeae9;
	border-color: #e74c3c;
	color: #c0392b;
}

/* --- Game Over Screen --- */
.game-over-title {
	font-family: "Lora", serif;
	font-size: 2.2rem;
	color: #c0392b;
}
.final-score {
	font-size: 1.5rem;
	font-weight: 700;
}
.final-info {
	color: #7f8c8d;
}
</style>
