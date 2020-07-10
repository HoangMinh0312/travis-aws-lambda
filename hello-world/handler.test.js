const { createAuction, getAuction, getAuctions, placeBird,
    uploadAuctionPicture,
    processStream,
    testErrorMessage,
    testErrorMessageAsync } = require('./handler');
const AWS = require("aws-sdk");
const dao = require('./lib/dynamodb-lib');
jest.mock('./lib/uploadPictureToS3');
const { uploadPictureToS3,
    setAuctionPictureUrl } = require('./lib/uploadPictureToS3');
// jest.mock('aws-sdk');
describe('test handler', () => {
    beforeEach(() => {
        const sendPromise = jest.fn().mockReturnValue({
            promise: jest.fn().mockResolvedValue({
            })
        });

        AWS.SQS = jest.fn().mockImplementation(() => ({
            sendMessage: sendPromise
        }));

        dao.put = jest.fn().mockResolvedValue({});

        dao.get = jest.fn().mockResolvedValue({
            Item: {
                id: 1,
                name: 'hoang'
            }
        });

        dao.scan = jest.fn().mockResolvedValue({
            Items: [{
                id: 1,
                name: 'hoang'
            },
            {
                id: 2,
                name: 'hoang'
            }]
        });

    });


    test('test createAuction', async () => {
        expect.assertions(1);
        const event = {
            body: {
                title: "tets"
            },
            requestContext: {
                authorizer: {
                    email: "test"
                }
            }
        }

        const result = await createAuction(event, null);
        console.log('tao day');
        expect(result.statusCode).toBe(201);
    });

    test('test getAuction', async () => {

        const event = {
            body: {
                title: "test"
            },
            requestContext: {
                authorizer: {
                    email: "test"
                }
            },
            pathParameters: {
                id: 1
            }
        }


        const result = await getAuction(event, null);
        console.log(result);
        expect(JSON.parse(result.body).name).toBe('hoang');
    });

    test('test getAuctions', async () => {

        const event = {
            body: {
                title: "test"
            },
            requestContext: {
                authorizer: {
                    email: "test"
                }
            },
            pathParameters: {
                id: 1
            }
        }


        const result = await getAuctions(event, null);
        console.log(result);
        expect(JSON.parse(result.body).length).toBe(2);
    });

    test('process Stream', async () => {
        const event = {
            body: {
                title: "test"
            },
            requestContext: {
                authorizer: {
                    email: "test"
                }
            },
            pathParameters: {
                id: 1
            },
            Records: [{
                dynamodb: {
                    NewImage: ""
                }
            }]
        }

        const result = expect(() => processStream(event, null, () => console.log("callback"))).not.toThrow(Error)
            ;
    })
})


describe('test handler 2', () => {

    beforeEach(() => {

        dao.update = jest.fn().mockResolvedValue({
            Attributes: [{
                id: 1
            }]
        });

        dao.get = jest.fn().mockResolvedValue({
            Item: {
                id: 1
            }
        });
        uploadPictureToS3.mockImplementation(() => 42);
        setAuctionPictureUrl.mockImplementation(() => 42);
    });

    test('test place of bird', async () => {
        const event = {
            body: {
                title: "test"
            },
            requestContext: {
                authorizer: {
                    email: "test"
                }
            },
            pathParameters: {
                id: 1
            }
        }

        const result = await placeBird(event, null);
        console.log(result);
        expect(JSON.parse(result.body).length).toBe(1);
    });

    test('test uploadAuctionPicture', async () => {
        const event = {
            body: "aaaaaa",
            requestContext: {
                authorizer: {
                    email: "test"
                }
            },
            pathParameters: {
                id: 1
            }
        }

        const result = await uploadAuctionPicture(event, null);
        console.log(result);
        expect(JSON.parse(result.body)).toBeTruthy();
    });
})

describe('test handler 2', () => {
    beforeEach(() => {
        dao.put = jest.fn().mockImplementation(() => {
            throw new Error();
        });

        dao.get = jest.fn().mockImplementation(() => {
            throw new Error();
        });

        dao.scan = jest.fn().mockImplementation(() => {
            throw new Error();
        });
    })

    test('test createAuction error', async () => {
        expect.assertions(1);
        const event = {
            body: {
                title: "tets"
            },
            requestContext: {
                authorizer: {
                    email: "test"
                }
            }
        }

        await expect(placeBird(event, null)).rejects.toThrow(Error);
    });

    test('test getAuction error', async () => {
        expect.assertions(1);

        const event = {
            body: {
                title: "test"
            },
            requestContext: {
                authorizer: {
                    email: "test"
                }
            },
            pathParameters: {
                id: 1
            }
        }
        await expect(() => getAuction(event, null)).rejects.toThrow(Error);

    });

    test('test getAuctions error', async () => {
        expect.assertions(1);

        const event = {
            body: {
                title: "test"
            },
            requestContext: {
                authorizer: {
                    email: "test"
                }
            },
            pathParameters: {
                id: 1
            }
        }

        await expect(() => getAuctions(event, null)).rejects.toThrow();
    });

    test('aaaaaaaaaaaaaaaaaaaaaaaaa', async () => {
        console.log('aaaaaaaaaaaaaaaaaaaaaaaaa');
        expect(() => testErrorMessage()).toThrow('some message');
    });

    test('bbbbbbbbbbb', async () => {
        console.log('aaaaaaaaabaaaaaaaaaaaaaaaa');
        await expect(() => testErrorMessageAsync()).rejects.toThrow('some message 2');
    });
});