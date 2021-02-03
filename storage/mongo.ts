import * as mongoose from 'mongoose';
import * as config from 'config';

const connect = async () => {
    await mongoose.connect(config.get('mongoUri'), {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true
    });
};

export default { connect };

