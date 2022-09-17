import { Client, Account, ID, Functions } from 'appwrite';
import { accountStore } from './accountStore';

const client = new Client()
    .setEndpoint('https://demo.appwrite.io/v1')
    .setProject('almostShoutcart');

const account = new Account(client);
const functions = new Functions(client);

export class AppwriteService {
    static login() {
        const redirectUrl = window.location.href;
        account.createOAuth2Session("github", redirectUrl, redirectUrl);
    }

    static async logout() {
        await account.deleteSession('current');
        await AppwriteService.fetchAccount();
    }

    static async createOrder(msg: string) {
        const res = await functions.createExecution('createOrder', msg, true);
        console.log(res);
    }

    static async fetchAccount() {
        try {
            const acc = await account.get();
            accountStore.set(acc);
            return acc;
        } catch (err) {
            console.warn(err);
            accountStore.set(null);
            return null;
        }
    }
}