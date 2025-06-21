<script setup>
defineProps(["updateBooksSpan", "updateDificulty", "dificulty", "booksSpan"]);
</script>

<template>
	<div class="menu-card">
		<h1 class="title">¿Conoces el versículo?</h1>
		<p class="subtitle">
			Configura tu partida y pon a prueba tu conocimiento.
		</p>

		<div class="section">
			<h2>Dificultad</h2>
			<div class="options-group">
				<label class="radio-label">
					<input
						@change="updateDificulty"
						type="radio"
						name="difficulty"
						value="1"
						:checked="dificulty == 1"
					/>
					<span class="radio-custom"></span>
					Solo el libro
				</label>
				<label class="radio-label">
					<input
						@change="updateDificulty"
						type="radio"
						name="difficulty"
						value="2"
						:checked="dificulty == 2"
					/>
					<span class="radio-custom"></span>
					Libro y capítulo
				</label>
				<label class="radio-label">
					<input
						@change="updateDificulty"
						type="radio"
						name="difficulty"
						value="3"
						:checked="dificulty == 3"
					/>
					<span class="radio-custom"></span>
					Libro, capítulo y verso
				</label>
			</div>
		</div>
		<div class="section">
			<h2>Libros</h2>
			<div class="options-group">
				<label class="radio-label">
					<input
						@change="updateBooksSpan"
						type="radio"
						name="books"
						value="new"
						:checked="booksSpan == 'new'"
					/>
					<span class="radio-custom"></span>
					Nuevo Testamento
				</label>
				<label class="radio-label">
					<input
						@change="updateBooksSpan"
						type="radio"
						name="books"
						value="old"
						:checked="booksSpan == 'old'"
					/>
					<span class="radio-custom"></span>
					Antiguo Testamento
				</label>
				<label class="radio-label">
					<input
						@change="updateBooksSpan"
						type="radio"
						name="books"
						value="both"
						:checked="booksSpan == 'both'"
					/>
					<span class="radio-custom"></span>
					Ambos Testamentos
				</label>
			</div>
		</div>

		<div class="start-button-container">
			<slot></slot>
		</div>
	</div>
</template>

<style scoped>
.menu-card {
	background: #ffffff;
	max-width: 600px;
	margin: 20px auto;
	padding: 40px;
	border-radius: 12px;
	box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
	display: flex;
	flex-direction: column;
	gap: 2rem;
}

.title {
	font-family: "Lora", serif;
	font-size: 2.5rem;
	font-weight: 700;
	text-align: center;
	color: #2c3e50;
}

.subtitle {
	text-align: center;
	font-size: 1.1rem;
	color: #7f8c8d;
	margin-top: -1.5rem; /* Pull it closer to the title */
}

.section h2 {
	font-size: 1.3rem;
	font-weight: 700;
	margin-bottom: 1rem;
	border-bottom: 2px solid #ecf0f1;
	padding-bottom: 0.5rem;
}

.options-group {
	display: flex;
	flex-direction: column;
	gap: 0.75rem;
}

/* --- Custom Radio Button Styles --- */
.radio-label {
	display: flex;
	align-items: center;
	cursor: pointer;
	padding: 12px;
	border-radius: 8px;
	transition: background-color 0.2s;
}

.radio-label:hover {
	background-color: #f9f9f9;
}

.radio-label input[type="radio"] {
	display: none; /* Hide the default radio button */
}

.radio-custom {
	width: 20px;
	height: 20px;
	border: 2px solid #bdc3c7;
	border-radius: 50%;
	margin-right: 12px;
	display: inline-block;
	position: relative;
	transition: border-color 0.3s;
}

/* The inner dot for the selected state */
.radio-custom::after {
	content: "";
	position: absolute;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%) scale(0);
	width: 10px;
	height: 10px;
	border-radius: 50%;
	background-color: #3498db;
	transition: transform 0.2s ease-in-out;
}

/* Style the custom radio when its input is checked */
.radio-label input[type="radio"]:checked + .radio-custom {
	border-color: #3498db;
}

.radio-label input[type="radio"]:checked + .radio-custom::after {
	transform: translate(-50%, -50%) scale(1);
}

.start-button-container {
	margin-top: 1rem;
	display: flex;
	justify-content: center;
}
</style>
