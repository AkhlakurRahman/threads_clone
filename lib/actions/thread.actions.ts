'use server';

import { revalidatePath } from 'next/cache';
import Thread from '../models/thread.model';
import User from '../models/user.model';
import { connectToDB } from '../mongoose';

interface Params {
	text: string;
	author: string;
	communityId: string | null;
	path: string;
}

export async function createThread({
	text,
	author,
	communityId,
	path,
}: Params) {
	try {
		connectToDB();

		const createThread = await Thread.create({
			text,
			author,
			community: null,
		});

		await User.findByIdAndUpdate(author, {
			$push: { threads: createThread._id },
		});

		revalidatePath(path);
	} catch (error: any) {
		throw new Error(`Error creating thread. ${error.message}`);
	}
}

export async function fetchThreads(pageNumber = 1, pageSize = 20) {
	try {
		connectToDB();

		// Calculate the number of threads needs to be escaped
		const skipAmount = (pageNumber - 1) * pageSize;

		const threadsQuery = Thread.find({
			parentId: { $in: [null, undefined] },
		})
			.sort({ createdAt: 'desc' })
			.skip(skipAmount)
			.limit(pageSize)
			.populate({ path: 'author', model: User })
			.populate({
				path: 'children',
				populate: {
					path: 'author',
					model: User,
					select: '_id name parentId image',
				},
			});

		const totalThreadsCount = await Thread.countDocuments({
			parentId: { $in: [null, undefined] },
		});

		const threads = await threadsQuery.exec();

		const isNext = totalThreadsCount > skipAmount + threads.length;

		return { threads, isNext };
	} catch (error: any) {
		throw new Error(`Error while fetching threads ${error.message}`);
	}
}

export async function fetchThreadById(id: string) {
	try {
		connectToDB();

		//!!! Populate community later
		const threadById = await Thread.findById(id)
			.populate({
				path: 'author',
				model: User,
				select: '_id id name image',
			})
			.populate({
				path: 'children',
				populate: [
					{
						path: 'author',
						model: User,
						select: '_id id name parentId imgae',
					},
					{
						path: 'children',
						model: Thread,
						populate: {
							path: 'author',
							model: User,
							select: '_id id name parentId image',
						},
					},
				],
			})
			.exec();

		return threadById;
	} catch (error: any) {
		throw new Error(`Error while fetching thread ${error.message}`);
	}
}
