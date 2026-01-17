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
        const user = await db.collection('user').findOne<{ _id: any; email: string }>({ email });

        if (!user) return [];

        const items = await WatchListModel.find(
            { userId: user._id },
            { symbol: 1 }
        ).lean();

        return items.map(item => String(item.symbol));
    }
    catch (e) {
        console.error('Error fetching watchlist symbols by email:', e);
        return [];
    }
}