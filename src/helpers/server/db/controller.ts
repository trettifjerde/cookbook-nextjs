import { Collection, Document, MongoClient, ServerApiVersion } from 'mongodb';
import { COOKBOOK_DB } from '@/helpers/config';

let _client: MongoClient | null = null;
const uri = process.env.DB_URL || '';

type CollectionCallback<C extends Document, T> = (col: Collection<C>) => Promise<T>;
type DbResponse<T> = {ok: true, result: T} | {ok: false, result: null};


export const initDb = async <C extends Document, T>(collectionName: string, callback: CollectionCallback<C,T>) => {

    if (!_client) {

        console.log('Connecting to the DB');

        const mongoClient = new MongoClient(uri, {
            serverApi: {
                version: ServerApiVersion.v1,
                strict: true,
                deprecationErrors: true
            },
            socketTimeoutMS: 30000
        });

        await mongoClient.connect()
            .then(client => {
                console.log('Database is initialised');
                _client = client;
            })
            .catch(err => {
                console.log('Error occurred while connecting to MongoDB');
                console.log(err);
            });
    }
    return dbCol(collectionName, callback);
}

export const dbCol = async<C extends Document, T>(collectionName: string, callback: CollectionCallback<C,T>) : Promise<DbResponse<T>> => {
    if (_client) {
        console.log('Querying collection', collectionName, callback.name);
        const collection = _client.db(COOKBOOK_DB).collection<C>(collectionName);
        
        return callback(collection)
            .then(result => ({
                ok: true, 
                result
            } as DbResponse<T>))
            .catch(err => {
                console.log('Error while querying DB');
                console.log(err);
                return {
                    ok: false, 
                    result: null
                } as DbResponse<T>
            })
    }

    console.log('Database is not initialised');
    return initDb(collectionName, callback);
}