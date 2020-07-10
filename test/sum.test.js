const sum = require('./sum');

test('adds 1 + 2 to equal 3', () => {
  expect(sum(1, 2)).toBe(3);
});

test('object assignment', () => {
    const data = {one: 1};
    data['two'] = 2;
    expect(data).toEqual({one: 1, two: 2});
});

test('null', () => {
    const n = null;
    expect(n).toBeNull();
    expect(n).toBeDefined();
    expect(n).not.toBeUndefined();
    expect(n).not.toBeTruthy();
    expect(n).toBeFalsy();
  });

  function compileAndroidCode() {
    throw new Error('you are using the wrong JDK');
  }
  
  test('test exception', () => {
    expect(compileAndroidCode).toThrow();
    expect(compileAndroidCode).toThrow(Error);
  
    // You can also use the exact error message or a regexp
  });

  function fetchData(){
      return new Promise((resolve, reject)=>{
          resolve('peanut butter');
      });
  } 

  function fetchDataError(){
    return new Promise((resolve, reject)=>{
        reject('error');
    });
  }

  test('the data is peanut butter', () => {
    return fetchData().then(data => {
      expect(data).toBe('peanut butter');
    });
  });

  test('the fetch fails with an error', () => {
    expect.assertions(1);
    return fetchDataError().catch(e => 
        {
            console.log(e);
            expect(e).toMatch('error');
        });
  });

  test('test case with resolves', () => {
    return expect(fetchData()).resolves.toBe('peanut butter');
  });

  beforeEach(() => {
    return console.log("before");
  });

  afterEach(() => {
    return console.log("after");
  })

  describe('matching cities to foods', ()=>{
      beforeEach(() => {
        return console.log("describe");
      });

      test('chan vl', () => {
        console.log('aaa');
        const n = null;
        expect(n).toBeNull();
        expect(n).toBeDefined();
        expect(n).not.toBeUndefined();
        expect(n).not.toBeTruthy();
        expect(n).toBeFalsy();
      });
  });