// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}

	type Todo = {
		id: string;
		desc: string;
		done: boolean;
		category: string | null;
		time_created: number;
		time_updated: number;
	};
	type Category = {
		id: string;
		name: string;
		time_created: number;
	};
}

export {};
