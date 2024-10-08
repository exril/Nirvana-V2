import mongoose from 'mongoose';
interface prefix{
    guildId:string,
    tire:string,
    startTime:string,
    endTime:string
}
const Options = new mongoose.Schema<prefix>({
    guildId: { type: String, required: true },
    tire: { type: String, required: true },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true }
});

export default mongoose.model('Premium', Options);