import mongoose from 'mongoose';
import config from '../../config.json' with { type: 'json' };
interface prefix {
    guildId: string,
    prefix: string
}
const Options = new mongoose.Schema<prefix>({
    guildId: { type: String, required: true },
    prefix: { type: String, required: true, default: config.prefix }
})

export default mongoose.model('Prefix', Options)