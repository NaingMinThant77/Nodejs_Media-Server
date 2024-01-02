const { MongoClient } = require('mongodb');
const url = "mongodb://localhost:27017/ourdb";

const makeCollection = async (coleName) => {
    try {
        const inst = await MongoClient.connect(url);
        console.log("Connected to the database");

        const dbo = inst.db('ourdb');
        await dbo.createCollection(coleName);
        console.log(`Collection '${coleName}' created`);

        return inst; // Return the inst variable
    } catch (err) {
        errorChecker(err);
        throw err; // Rethrow the error to handle it outside of the function
    }
};

// makeCollection('users');

const insertData = async (objects) => {
    try {
        console.log("Connecting to the database");
        const inst = await makeCollection('users');
        console.log("Connected to the database");
        const dbo = inst.db('ourdb');

        //one person
        // const result =  await dbo.collection('users').insertOne(obj);
        //Many people
        // const result = await dbo.collection('users').insertMany(objects);
        // console.log("Documents inserted:", result); //.insertedCount

        //Existing collections: [ 'orders', 'users' ]
        const existingCollections = await dbo.listCollections().toArray();
        console.log("Existing collections:", existingCollections.map(col => col.name));

        const users = await dbo.collection('users').find({}).toArray();

        if (users && users.length > 0) {
            for (let i = 0; i < objects.length; i++) {
                objects[i]['userId'] = users[i]._id;
                await dbo.collection('orders').insertOne(objects[i]);
            }

            console.log("Documents inserted in 'orders' collection:", objects.length);
            console.log("Documents inserted in 'orders' collection:", objects);
        } else {
            console.log("No users found.");
        }

        inst.close(); // Close the connection after inserting the documents
        console.log("Connection closed");
    } catch (err) {
        console.error("Error:", err);
    }
};

// insertData([
//     { userId: 'user_id', name: 'computer', price: 120000, count: 2 },
//     { userId: 'user_id', name: 'keyboard', price: 120000, count: 3 },
//     { userId: 'user_id', name: 'mouse', price: 120000, count: 3 },
//     { userId: 'user_id', name: 'printer', price: 120000, count: 4 },
//     { userId: 'user_id', name: 'router', price: 120000, count: 1 },
// ]);

// insertData ([
//     { name: 'Aung Aung', email: 'aung@gmail.com', password: '123', age: 21 },
//     { name: 'Mi Mi', email: 'mimi@gmail.com', password: '123' },
//     { name: 'Su Su', email: 'susu@gmail.com', password: '123', age: 22 },
//     { name: 'Hla Hla', email: 'hla@gmail.com', password: '123' , age: 24},
//     { name: 'Mg Mg', email: 'mg@gmail.com', password: '123', age: 21 },
//     { name: 'Mya Mya', email: 'mya@gmail.com', password: '123' },
//     { name: 'Suzy', email: 'suzy@gmail.com', password: '123', age: 22 },
//     { name: 'Rose', email: 'rose@gmail.com', password: '123' , age: 23}
// ]);

const findUser = async () => {
    try {
        const inst = await makeCollection('users');
        const dbo = inst.db('ourdb');
        //Find One
        // const result = await dbo.collection('users').findOne();
        //Find Many
        // const result = await dbo.collection('users').find({}).toArray();
        //find By Query
        // let query = {age: 21}
        // const result = await dbo.collection('users').find(query).toArray();
        // const result = await dbo.collection('users').find({}, { projection: { _id: 0, name: 1 } }).toArray();

        const result = await dbo.collection('users').find({}).limit(3).toArray();
        console.log("Read successfully:", result);

    } catch (err) {
        errorChecker(err);
    }
};

// findUser();

const getUserWithSort = async () => {
    try {
        const inst = await makeCollection('users');
        const dbo = inst.db('ourdb');

        let mySort = { name: 1 }; //-1
        const result = await dbo.collection('users').find({}).sort(mySort).toArray();
        console.log("Read successfully:", result);

    } catch (err) {
        errorChecker(err);
    }
};

// getUserWithSort();

const deleteUser = async () => {
    try {
        const inst = await makeCollection('users');
        const dbo = inst.db('ourdb');

        // delete one
        // let query = { age: /^\d/}; //name: 'Aung Aung'
        // const result = await dbo.collection('users').deleteOne(query);
        // delete all
        // const result = await dbo.collection('users').deleteMany();

        //delete-collection
        // const result = await dbo.collection('users').drop(); 
        // const result = await dbo.dropCollection('users'); 

        console.log("Delete successfully:", result);

    } catch (err) {
        errorChecker(err);
    }
};

// deleteUser();

const updateData = async () => {
    try {
        const inst = await makeCollection('users');
        const dbo = inst.db('ourdb');

        let query = { password: '123' };
        // const result = await dbo.collection('users').updateOne(query, {$set: { password: '456'}});
        const result = await dbo.collection('users').updateMany(query, { $set: { password: '456' } });

        console.log("Update successfully:", result);

    } catch (err) {
        errorChecker(err);
    }
};

// updateData();

const joinTable = async () => {
    try {
        const inst = await makeCollection('users');
        const dbo = inst.db('ourdb');

        const result = await dbo.collection('users').aggregate([
            {
                $lookup: {
                    from: 'orders',
                    localField: "_id",
                    foreignField: "userId",
                    as: "user_orders"
                }
            }
        ]).toArray();

        console.log("join table successfully:", result);

    } catch (err) {
        errorChecker(err);
    }
};

// joinTable();

const errorChecker = (err) => {
    console.log("Something wrong ", err);
};

