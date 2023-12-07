const mongo = require('mongodb');

mongo.MongoClient.connect()
    .then(client => {
        return client.db('cookbook').command({collMod: 'recipes', 
            validator: {
                $jsonSchema: {
                    bsonType: "object",
                    title: "Recipe Validation",
                    required: ["title", "description", "steps", "ingredients"],
                    properties: {
                        title: {
                            bsonType: 'string',
                            description: 'must be a string'
                        },
                        description: {
                            bsonType: 'string',
                            description: 'must be a string'
                        },
                        steps: {
                            bsonType: 'array',
                            description: 'must be an array',
                            items: {
                                bsonType: 'string',
                                description: 'must be a string'
                            }
                        },
                        ingredients: {
                            bsonType: 'array',
                            description: 'must be an array',
                            items: {
                                bsonType: 'object',
                                required: ['name'],
                                properties: {
                                    name: {
                                        bsonType: 'string',
                                        description: 'must be a string'
                                    },
                                    units: {
                                        bsonType: 'string',
                                        description: 'must be a string if exists'
                                    },
                                    amount: {
                                        bsonType: 'double',
                                        description: 'must be a double if exists',
                                        minimum: 0
                                    }
                                }
                            }
                        },
                        image: {
                            bsonType: 'string',
                            description: 'must be a url string to an image'
                        }
                    }
                }
            }
        })
    })
    .then(res => {
        console.log(res);
    })