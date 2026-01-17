'use server';

import { WatchListModel } from "@/database/model/watchlist.model";
import { connectToDatabase } from "@/database/mongose";


export async function getWatchlistSymbolsByEmail(email: string): Promise<string[]> {
    if (!email) return [];

    try {
        const mongoose = await connectToDatabase();
        const db = mongoose.connection.db;
        if (!db) {
            throw new Error('Mongoose connection not found');
        }
        const userid = await db.collection('user')
            .findOne<{ _id?: unknown, id?: string, email: string }>({ email })

        if (!userid) {
            return [];
        }

        const iteams = await WatchListModel.find({ userid }, { symbol: 1 }).lean();

        return iteams.map((i) => String(i.symbol));

    }
    catch (e) {
        console.error('Error fetching watchlist symbols by email:', e);
        return [];
    }
}