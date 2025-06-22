<script setup>
import { ref, watch, onUnmounted, computed } from "vue";

const props = defineProps(["dificulty", "booksSpan", "books"]);
const emit = defineEmits(["play-again"]);

// --- Constants ---
const TIME_LIMIT = 30;
const BOOKS_IN_OT = 39;
const BOOKS_TOTAL = 66;
const STREAK_GOAL = 2;

// NEW: Helper map to display the book span name
const booksSpanMap = {
	new: "Nuevo Testamento",
	old: "Antiguo Testamento",
	both: "Ambos Testamentos",
};

// --- State and other logic... (remains the same) ---
const bookId = ref(0);
const lives = ref(3);
const points = ref(0);
const streak = ref(0);
const extraLifeMessage = ref("");
const isAnswer = ref(false);
const bookGuess = ref("");
const chapterGuess = ref("");
const verseGuess = ref("");
const book = ref({});
const text = ref({});
const visible = ref(false);
const isLoading = ref(true);
const timerId = ref(null);
const timeRemaining = ref(TIME_LIMIT);

const filteredBooks = computed(() => {
	if (!props.books || props.books.length === 0) return [];
	switch (props.booksSpan) {
		case "new":
			return props.books.slice(BOOKS_IN_OT);
		case "old":
			return props.books.slice(0, BOOKS_IN_OT);
		default:
			return props.books;
	}
});

const stopTimer = () => {
	clearInterval(timerId.value);
	timerId.value = null;
};
const handleTimeUp = () => {
	stopTimer();
	streak.value = 0;
	extraLifeMessage.value = "";
	isAnswer.value = false;
	lives.value--;
	cleanInputs();
	changeVisible(true);
};
const startTimer = () => {
	stopTimer();
	timeRemaining.value = TIME_LIMIT;
	timerId.value = setInterval(() => {
		if (timeRemaining.value > 0) timeRemaining.value--;
		else handleTimeUp();
	}, 1000);
};

const getRandom = (number) => Math.floor(Math.random() * number);
const changeVisible = (isVisible = !visible.value) =>
	(visible.value = isVisible);
const getBookNT = () => getRandom(BOOKS_TOTAL - BOOKS_IN_OT) + BOOKS_IN_OT;
const getBookOT = () => getRandom(BOOKS_IN_OT);
const getBook = () => getRandom(BOOKS_TOTAL);
const getRandomBook = () => {
	if (props.booksSpan == "new") bookId.value = getBookNT();
	else if (props.booksSpan == "old") bookId.value = getBookOT();
	else bookId.value = getBook();
};
const nextVerse = () => {
	stopTimer();
	getRandomBook();
	changeVisible(false);
	extraLifeMessage.value = "";
};
const cleanInputs = () => {
	bookGuess.value = "";
	chapterGuess.value = "";
	verseGuess.value = "";
};
const checkAnswer = () => {
	stopTimer();
	extraLifeMessage.value = "";
	const scoreMap = { 1: 1, 2: 2, 3: 4 };
	let isCorrect = false;
	const correctBook = book.value.name.toLowerCase().trim();
	const guessBook = bookGuess.value.toLowerCase().trim();
	switch (props.dificulty) {
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
		points.value += scoreMap[props.dificulty];
		streak.value++;
		if (streak.value === STREAK_GOAL) {
			lives.value++;
			extraLifeMessage.value = `¡Racha de ${STREAK_GOAL}! +1 Vida ❤️`;
			streak.value = 0;
		}
	} else {
		isAnswer.value = false;
		streak.value = 0;
		if (timeRemaining.value > 0) lives.value--;
	}
	cleanInputs();
	changeVisible(true);
};
const checkAndSaveHighScore = () => {
	const currentHighScore =
		Number(localStorage.getItem("bibleGuessrHighScore")) || 0;
	if (points.value > currentHighScore) {
		localStorage.setItem("bibleGuessrHighScore", points.value);
	}
};
watch(lives, (newLives) => {
	if (newLives < 0) checkAndSaveHighScore();
});
watch(bookId, async () => {
	if (
		bookId.value > BOOKS_TOTAL ||
		bookId.value < 0 ||
		props.books.length === 0
	)
		return;
	isLoading.value = true;
	stopTimer();
	try {
		const bookData = props.books[bookId.value];
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
		text.value = {
			text: "No se pudo cargar el versículo. Inténtalo de nuevo.",
		};
	} finally {
		isLoading.value = false;
		startTimer();
	}
});
getRandomBook();
const playAgain = () => {
	emit("play-again");
};
onUnmounted(() => {
	stopTimer();
});
</script>

<template>
	<!-- MODIFIED: Game Over View -->
	<div class="game-card" v-if="lives < 0">
		<h2 class="game-over-title">Juego Terminado</h2>
		<p class="final-score">Puntaje final: {{ points }}</p>

		<!-- Game settings summary -->
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
		<p class="final-info">
			Testamento: {{ booksSpanMap[props.booksSpan] }}
		</p>

		<!-- NEW: Last verse display section -->
		<div class="last-verse-section">
			<h4>La cita final fue:</h4>
			<p class="last-verse-citation">
				{{ book.name }} {{ text.chapter }}:{{ text.verse }}
			</p>
			<blockquote class="last-verse-text">“{{ text.text }}”</blockquote>
		</div>

		<button class="btn btn-primary" @click="playAgain">
			Volver al Menú
		</button>
	</div>

	<!-- Main Game View (No changes here) -->
	<div class="game-card" v-else>
		<div class="info-bar">
			<p>
				Vidas: <span class="info-value">{{ lives }} ❤️</span>
			</p>
			<p>
				Puntos: <span class="info-value">{{ points }} ⭐</span>
			</p>
		</div>
		<div v-if="!visible && !isLoading" class="timer-bar-container">
			<div
				class="timer-bar-progress"
				:class="{ 'is-low': timeRemaining <= 5 }"
				:style="{ width: (timeRemaining / TIME_LIMIT) * 100 + '%' }"
			></div>
		</div>
		<div class="verse-container">
			<div v-if="isLoading" class="spinner"></div>
			<p v-else class="verse">“{{ text.text }}”</p>
		</div>
		<div class="result-container" v-show="visible">
			<div
				class="result"
				:class="{ correct: isAnswer, incorrect: !isAnswer }"
			>
				<strong v-if="timeRemaining > 0">{{
					isAnswer ? "¡Correcto!" : "¡Incorrecto!"
				}}</strong
				><strong v-else>¡Se acabó el tiempo!</strong>
				<div v-if="extraLifeMessage" class="extra-life-msg">
					{{ extraLifeMessage }}
				</div>
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
				<label for="name-guess">Libro</label
				><select v-model="bookGuess" id="name-guess" required>
					<option value="" disabled>-- Selecciona un libro --</option>
					<option
						v-for="book in filteredBooks"
						:key="book.id"
						:value="book.names[0]"
					>
						{{ book.names[0] }}
					</option></select
				><template v-if="dificulty >= 2"
					><label for="chapter-guess">Capítulo</label
					><input
						v-model.number="chapterGuess"
						type="number"
						id="chapter-guess"
						name="chapter-guess"
						required /></template
				><template v-if="dificulty === 3"
					><label for="verse-guess">Versículo</label
					><input
						v-model.number="verseGuess"
						type="number"
						id="verse-guess"
						name="verse-guess"
						required
				/></template>
			</div>
			<button class="btn btn-primary" type="submit">Comprobar</button>
		</form>
	</div>
</template>

<style scoped>
/* Most styles are the same, just adding new rules at the end */
.game-card {
	background: #fff;
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
.timer-bar-container {
	width: 100%;
	height: 10px;
	background-color: #ecf0f1;
	border-radius: 5px;
	overflow: hidden;
}
.timer-bar-progress {
	height: 100%;
	background-color: #3498db;
	border-radius: 5px;
	transition: width 1s linear, background-color 0.5s;
}
.timer-bar-progress.is-low {
	background-color: #e74c3c;
}
.verse-container {
	min-height: 120px;
	display: flex;
	align-items: center;
	justify-content: center;
	width: 100%;
}
.spinner {
	width: 50px;
	height: 50px;
	border: 5px solid #ecf0f1;
	border-top-color: #3498db;
	border-radius: 50%;
	animation: spin 1s linear infinite;
}
@keyframes spin {
	to {
		transform: rotate(360deg);
	}
}
.verse {
	font-family: "Lora", serif;
	font-style: italic;
	font-size: 1.7rem;
	line-height: 1.6;
	text-align: center;
	color: #34495e;
	max-width: 90%;
}
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
.inputs-grid input,
.inputs-grid select {
	width: 100%;
	padding: 12px 15px;
	border: 1px solid #bdc3c7;
	border-radius: 6px;
	font-size: 1rem;
	font-family: "Inter", sans-serif;
	background-color: #fff;
	transition: border-color 0.3s, box-shadow 0.3s;
}
.inputs-grid input:focus,
.inputs-grid select:focus {
	outline: 0;
	border-color: #3498db;
	box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.2);
}
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
.extra-life-msg {
	font-weight: 700;
	color: #16a085;
	background-color: #d1f2eb;
	padding: 8px 12px;
	border-radius: 6px;
	margin-top: 12px;
	margin-bottom: 8px;
	animation: fadeIn 0.5s ease-in-out;
}
@keyframes fadeIn {
	from {
		opacity: 0;
		transform: translateY(-10px);
	}
	to {
		opacity: 1;
		transform: translateY(0);
	}
}
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
	margin-top: -1.2rem;
}
.final-info:first-of-type {
	margin-top: 0;
}

/* NEW: Styles for the last verse section on the Game Over screen */
.last-verse-section {
	width: 100%;
	border-top: 1px solid #ecf0f1;
	padding-top: 1.5rem;
	margin-top: 0.5rem;
	text-align: center;
}

.last-verse-section h4 {
	font-weight: 700;
	font-size: 1.1rem;
	color: #2c3e50;
	margin-bottom: 0.5rem;
}

.last-verse-citation {
	font-weight: 500;
	color: #34495e;
	margin-bottom: 1rem;
}

.last-verse-text {
	font-family: "Lora", serif;
	font-style: italic;
	font-size: 1.2rem;
	line-height: 1.6;
	color: #7f8c8d;
	background-color: #f8f9f9;
	padding: 1rem;
	border-left: 4px solid #bdc3c7;
	margin: 0;
	text-align: left;
}
</style>
