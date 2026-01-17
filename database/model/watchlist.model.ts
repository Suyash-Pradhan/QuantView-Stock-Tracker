import { type Model, Schema, model, models } from "mongoose";

export interface IWatchListIteam {
    userId: string;
    symbol: string;
    company: string;
    addedAt: Date;
}

const WatchListSchema = new Schema<IWatchListIteam>(
    {
        userId: { type: String, required: true, index: true },
        symbol: { type: String, required: true, uppercase: true, trim: true },
        company: { type: String, required: true, trim: true },
        addedAt: { type: Date, default: Date.now },
    }
)

export const WatchListModel: Model<IWatchListIteam> =
    (models?.IWatchListIteam as Model<IWatchListIteam>) || model<IWatchListIteam>('Watchlist', WatchListSchema);