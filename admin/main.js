import App from './App.svelte';

const app = new App({
	target: document.getElementById('body'),
	data: {
		name: 'world'
	}
});

window.app = app;

export default app;