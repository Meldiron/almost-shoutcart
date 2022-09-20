import { Client, Account, ID, Functions, Query, Databases } from 'appwrite';
import { accountStore } from './accountStore';

const client = new Client()
    .setEndpoint('https://appwrite.almost-shoutcart.matejbaco.eu/v1')
    .setProject('almostShoutcart');

const account = new Account(client);
const functions = new Functions(client);
const database = new Databases(client);

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
        const res = await functions.createExecution('createOrder', msg);

        if (res.status === 'failed') {
            throw new Error('Unexpected error.');
        }

        const data = JSON.parse(res.response);

        if (!data.success) {
            throw new Error(data.msg);
        }

        return data.url;
    }

    static async verifyOrder(orderId: string) {
        const res = await functions.createExecution('verifyPayment', orderId);

        if (res.status === 'failed') {
            throw new Error('Unexpected error.');
        }

        const data = JSON.parse(res.response);

        if (!data.success) {
            throw new Error(data.msg);
        }

        return data;
    }

    static async getOrders(cursor?: string) {
        const queries = [
            Query.orderDesc('$createdAt')
        ];

        if (cursor) {
            queries.push(Query.cursorAfter(cursor));
        }

        const res = await database.listDocuments('main', 'orders', queries);
        return res.documents;
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