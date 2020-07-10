
const axios = require('axios');
const {all} = require('./http');
const mockCallback = jest.fn(x => 42 + x);
jest.mock('axios');

function forEach(items, callback) {
    for (let index = 0; index < items.length; index++) {
        callback(items[index]);
    }
}



test('mock ne', () => {
    const mockCallback = jest.fn(x => 42 + x);
    forEach([0, 1], mockCallback);

    // The mock function is called twice
    expect(mockCallback.mock.calls.length).toBe(2);
});

test('bound', () => {
    const myMock = jest.fn();

    const a = new myMock();
    const b = { a: 1 };
    const bound = myMock.bind(b);
    bound();
    console.log(myMock.mock.instances);
});


test('mock', () => {
    const myMock = jest.fn();
    myMock.mockReturnValueOnce(10);
    console.log(myMock());
});

test('mockBool', () => {
    const filterTestFn = jest.fn();

    // Make the mock return `true` for the first call,
    // and `false` for the second call
    filterTestFn.mockReturnValueOnce(true).mockReturnValueOnce(false);

    const result = [11, 12].filter(num => filterTestFn(num));

    console.log(result);

});

test('mock lib',() => {
    const users = [{name: 'Bob'}];
    const resp = {data: users};
    axios.get.mockResolvedValue(resp);
  
    // or you could use the following depending on your use case:
    // axios.get.mockImplementation(() => Promise.resolve(resp))
  
    return all().then(data => expect(data).toEqual(users));
  });




