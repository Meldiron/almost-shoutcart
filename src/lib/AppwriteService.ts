import { Client, Account, ID, Functions, Query, Databases } from 'appwrite';
import { accountStore } from './accountStore';
import { loadingStore } from './loadingStore';

const endpoint = 'https://backend.shoutcart.almostapps.eu/v1';

const client = new Client()
    .setEndpoint(endpoint)
    .setProject('almostShoutcart');

const account = new Account(client);
const functions = new Functions(client);
const database = new Databases(client);

export class AppwriteService {
    static login() {
        const redirectUrl = window.location.href;
        account.createOAuth2Session("github", redirectUrl, redirectUrl);
        loadingStore.set({ state: true, msg: "Redirecting ..." });
    }

    static async logout() {
        loadingStore.set({ state: true, msg: "Logging out ..." });

        try {
            await account.deleteSession('current');
            await AppwriteService.fetchAccount();
        } catch(err: any) {
            alert(err.message);
        } finally {
            loadingStore.set({ state: false });
        }
    }

    static async createOrder(msg: string) {
        loadingStore.set({ state: true, msg: "Creating order ..." });

        try {
            const res = await functions.createExecution('createOrder', msg);

            if (res.status === 'failed') {
                throw new Error('Unexpected error.');
            }
    
            const data = JSON.parse(res.response);
    
            if (!data.success) {
                throw new Error(data.msg);
            }
        
            return { url: data.url, id: data.orderId };
        } catch(err: any) {
            alert(err.message);
        } finally {
            loadingStore.set({ state: false });
        }
        
        return null;
    }

    static async verifyOrder(orderId: string) {
        loadingStore.set({ state: true, msg: "Verifying order ..." });

        try {
            const res = await functions.createExecution('verifyPayment', orderId);

            if (res.status === 'failed') {
                throw new Error('Unexpected error.');
            }
    
            const data = JSON.parse(res.response);
    
            if (!data.success) {
                throw new Error(data.msg);
            }
    
            return data;
        } catch(err: any) {
            alert(err.message);
        } finally {
            loadingStore.set({ state: false});
        }

        return null;
    }

    static async getOrders(cursor?: string) {
        try {
            const queries = [
                Query.orderDesc('$createdAt')
            ];
    
            if (cursor) {
                queries.push(Query.cursorAfter(cursor));
            }
    
            const res = await database.listDocuments('main', 'orders', queries);
            return res.documents;
        } catch(err: any) {
            alert(err.message);
        } finally {
        }

        return null;
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