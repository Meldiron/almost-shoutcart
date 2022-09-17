import type { Models } from 'appwrite';
import { writable } from 'svelte/store';

export const accountStore = writable<null | Models.Account<any>>(null);