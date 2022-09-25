import { writable } from 'svelte/store';

export const loadingStore = writable<{ state: boolean, msg?: string }>({ state: false });