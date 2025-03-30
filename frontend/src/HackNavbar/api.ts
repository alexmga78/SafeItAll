import axios from 'axios';
const url = import.meta.env.VITE_API_URL;


export interface CreateSafeRequest {
	ownerId: string;
	text?: string;
}

export async function createSafe(data: CreateSafeRequest): Promise<void> {
	await axios.post(`${url}/safe/create`, data);
}

export interface OpenSafeRequest {
	safeId: string;
	userId: string;
}

export async function openSafe(data: OpenSafeRequest): Promise<void> {
	await axios.post(`${url}/safe/open`, data);
}

export interface ShareSafeRequest {
	safeId: string;
	userId: string;
	friendId: string;
}

export async function shareSafe(data: ShareSafeRequest): Promise<void> {
	await axios.post(`${url}/safe/share-safe`, data);
}