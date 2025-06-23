const { MongoClient, CURSOR_FLAGS} = require('mongodb')

const url = 'mongodb://localhost:27017';
const client = new MongoClient(url);
const dbName = 'node';

const users = [
    { id: 1, name: 'Janek', email: 'janek@gmail.com', },
    { id: 2, name: 'Adam', email: 'adam@gmail.com' },
    { id: 3, name: 'Tomasz', email: 'tomek@my.com' },
    { id: 4, name: 'Dawid', email: 'dawid@email.com' },
  ];

async function main() {
    await client.connect();
    console.log('Connected to MongoDB');

    //users
    const db = client.db(dbName)


    //db.collection('users')
    // .insertMany( users );

    const dupa = await db.collection('users').find({ email: 'tomek@my.com' }).toArray();
    console.log(dupa);

    //deleteMany - do usuwaniaff
}

main()
    .catch(ex => console.log('Db Error'))
    .finally(() => client.close());

module.exports = client;