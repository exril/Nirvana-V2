import mongoose from 'mongoose';
interface user {
    userId: string,
    hasNoPrefix: boolean,
    premium: {
        premiumTier: 'silver' | 'gold' | 'platinum' | 'none';
        upgradedGuild: [],
        endDate: string,
    },
    isBlacklisted: boolean

}
const Options = new mongoose.Schema<user>({
    userId: { type: String, required: true },
    hasNoPrefix: { type: Boolean, default: false },
    premium:{
        premiumTier: { type: String, default: "none" },
        upgradedGuild: { type: Array, default: [] },
        endDate: { type:String, default: ""}
    },
    isBlacklisted:{ type: Boolean, default:false}
});

export default mongoose.model('User', Options);