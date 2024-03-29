'use server';

import { revalidatePath } from 'next/cache';
import User from '../models/user.model';
import { connectToDB } from '../mongoose';

interface Params {
	userId: string;
	username: string;
	name: string;
	image: string;
	bio: string;
	path: string;
}

export async function updateUser({
	userId,
	username,
	name,
	image,
	bio,
	path,
}: Params): Promise<void> {
	try {
		connectToDB();

		await User.findOneAndUpdate(
			{ id: userId },
			{
				username: username.toLocaleLowerCase(),
				name,
				image,
				bio,
				onboarded: true,
			},
			{ upsert: true }
		);

		if (path === '/profile/edit') {
			revalidatePath(path);
		}
	} catch (error: any) {
		throw new Error(`Failed to create/update user ${error.message}`);
	}
}

export async function fetchUser(userId: string) {
	try {
		connectToDB();

		return await User.findOne({ id: userId });
		// .populate({
		// 	path: 'communities',
		// 	model: Community,
		// });
	} catch (error: any) {
		throw new Error(`Failed to fetch user, ${error.message}`);
	}
}
