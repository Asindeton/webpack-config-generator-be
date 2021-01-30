import * as mongoose from 'mongoose';

const url = 'mongodb+srv://dev-mongo-db:mongo-12-db@cluster0.psk17.mongodb.net/webpack-mongo-db?retryWrites=true&w=majority';

const connect = async () => {
    await mongoose.connect(url, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true
    });
};

export default { connect };

