import "./assets/reset.css";
import "./assets/main.css";
import { createApp } from "vue";
import App from "./App.vue";
import { createMemoryHistory, createRouter } from "vue-router";

const routes = [{ path: "/", component: App }];

const router = createRouter({
	history: createMemoryHistory(),
	routes,
});

createApp(App).use(router).mount("#app");
