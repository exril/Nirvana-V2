import mongoose from 'mongoose';
interface guild {
    guildId: string,
    ignorechannels: any,
    dj: {
        isEnabled: boolean,
        roleId: string
    },
    _247: {
        voice_id: string,
        text_id: string,
        isEnabled: boolean
    }
    isPremium: boolean,
    premium: {
        isActive: boolean,
        activatedBy: string,
        endDate: string
    }
    isBlacklisted: boolean

}
const Options = new mongoose.Schema<guild>({
    guildId: { type: String, required: true },
    ignorechannels: { type: Array, default: [] },
    dj: {
        isEnabled: { type: Boolean, default: false },
        roleId: { type: String, default: "" }
    },
    _247: {
        voice_id: { type: String, default: "" },
        text_id: { type: String, default: "" },
        isEnabled: { type: Boolean, default: false }
    },
    premium: {
        isActive: { type: Boolean, default: false },
        activatedBy: { type: String, default: "" },
        endDate: { type: String, default: "" }
    },
    isBlacklisted: { type: Boolean, default: false }
});

export default mongoose.model('Guild', Options);