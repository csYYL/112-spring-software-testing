// const { describe, it, mock} = require('node:test');
// const assert = require('assert');
// const { Application, MailSystem } = require('./main');

// const fakenames = 'Jones\nEusden\nBattlebrian\nMartial Hebert';

// // createfakefile
// const fs = require('fs');
// const util = require('util');
// const writeFile = util.promisify(fs.writeFile);
// const readFile = util.promisify(fs.readFile); 

// describe('MailSystem', () => {
//     it('write', () => {
//         const ms = new MailSystem();
//         const context = ms.write('Bob');
//         assert.strictEqual(context , 'Congrats, Bob!');
    
//         const context2 = ms.write(null);
//         assert.strictEqual(context2, 'Congrats, null!');
    
//         const context3 = ms.write(undefined);
//         assert.strictEqual(context3, 'Congrats, undefined!');
    
//         const context4 = ms.write(123);
//         assert.strictEqual(context4, 'Congrats, 123!');

//         const context5 = ms.write({});
//         assert.strictEqual(context5, 'Congrats, [object Object]!');

//         const context6 = ms.write([]);
//         assert.strictEqual(context6, 'Congrats, !');

//         const context7 = ms.write(true);
//         assert.strictEqual(context7, 'Congrats, true!');
//     });

//     it('send', (t) => {
//         const ms = new MailSystem();
    
//         t.mock.method(Math, 'random', () => 0.6);
//         const success = ms.send('Bob', 'Congrats, Bob!');
//         assert.strictEqual(success, true);

//         t.mock.method(Math, 'random', () => 0.4);
//         const failed = ms.send('Bob', 'Congrats, Bob!');
//         assert.strictEqual(failed, false);

//         mock.reset();
//     });
// });

// describe('Application', () => {

//     it('getNames', async () => {
//         await writeFile('name_list.txt', fakenames, 'utf8');
//         const application = new Application();
//         const [people, selected] = await application.getNames();
//         assert.deepStrictEqual(people, ['Jones', 'Eusden', 'Battlebrian', 'Martial Hebert']);
//         assert.deepStrictEqual(selected, []);
//         await util.promisify(fs.unlink)('name_list.txt');
//     });
  

//     it('getRandomPerson', async () => {
//         await writeFile('name_list.txt', fakenames, 'utf8');
//         const application = new Application();
//         application.people = ['Jones', 'Eusden', 'Battlebrian', 'Martial Hebert'];
//         const person = application.getRandomPerson();
//         assert.ok(application.people.includes(person));
//         await util.promisify(fs.unlink)('name_list.txt');
//     });

//     it('selectNextPerson', async (t) => {
//         await writeFile('name_list.txt', fakenames, 'utf8');
//         const application = new Application();
//         application.people = ['Jones', 'Eusden', 'Battlebrian', 'Martial Hebert'];
//         application.selected = ['Jones', 'Eusden', 'Battlebrian', 'Martial Hebert'];
//         let person = application.selectNextPerson();
//         assert.strictEqual(person, null);
    
//         application.selected = ['Jones', 'Eusden', 'Battlebrian'];
//         let test = false;
//         application.getRandomPerson = () => {
//             if (!test) {
//                 test = true;
//                 return 'Jones';
//             }
//             else {
//                 return 'Martial Hebert';
//             }
//         }
//         person = application.selectNextPerson();
//         assert.strictEqual(person, 'Martial Hebert');
    
//         await util.promisify(fs.unlink)('name_list.txt');
//     });

//     it('constructor', async () => {
//         await writeFile('name_list.txt', fakenames, 'utf8');
//         const application = new Application();
//         assert.deepStrictEqual(application.people, []);
//         assert.deepStrictEqual(application.selected, []);
//         await util.promisify(fs.unlink)('name_list.txt');
//     });

//     it('notifySelected', async (t) => {
//         await writeFile('name_list.txt', fakenames, 'utf8');
//         const application = new Application();
//         const mailSystemSpy = { 
//             write: mock.fn(MailSystem.prototype.write),
//             send: mock.fn(MailSystem.prototype.send),
//         };
//         application.mailSystem = mailSystemSpy;
    
//         const [people, selected] = await application.getNames();
//         assert.deepStrictEqual(people, ['Jones', 'Eusden', 'Battlebrian', 'Martial Hebert']);
//         assert.deepStrictEqual(selected, []);
    
//         application.selected = ['Jones', 'Eusden', 'Battlebrian', 'Martial Hebert'];
    
//         application.notifySelected();
//         assert.strictEqual(mailSystemSpy.write.mock.calls.length, 4);
//         assert.strictEqual(mailSystemSpy.send.mock.calls.length, 4);
    
//         for (const x of [0, 1, 2, 3]) {
//             assert.strictEqual(mailSystemSpy.write.mock.calls[x].arguments[0], application.selected[x]);
//             assert.strictEqual(mailSystemSpy.send.mock.calls[x].arguments[0], application.selected[x]);
//         }
    
//         // Reset the globally tracked mocks.
//         mock.reset();
//         await util.promisify(fs.unlink)('name_list.txt');
//     });
// });
const test = require('node:test');
const assert = require('assert');

const fs = require('fs');
const { promisify } = require('util');
const writeFile = promisify(fs.writeFile);

const { Application, MailSystem } = require('./main');


test("Test MailSystem's write function", () => {
    const mailSystem = new MailSystem();
    const context = mailSystem.write('Jack')
    assert.strictEqual(context, 'Congrats, Jack!');
});

test("Test MailSystem's send function", () => {
    const keepRandom = Math.random;
    const mailSystem = new MailSystem();
    
    Math.random = () => 0.51;
    const result = mailSystem.send('Jack', 'Hello World!');
    assert.ok(result);

    Math.random = () => 0.49;
    const result1 = mailSystem.send('Jack', 'Hello World!');
    assert.strictEqual(result1, false);

    Math.random = keepRandom;
});



test("Test Application's getNames", async () => {
    const mockDate = 'Ada\nBob\nCindy';
    const mockFile = 'name_list.txt';
    await writeFile(mockFile, mockDate, 'utf8');

    const app = new Application();
    const [people, selected] = await app.getNames();
    assert.deepStrictEqual(people, ['Ada', 'Bob', 'Cindy']);
    assert.deepStrictEqual(selected, []);

    fs.unlinkSync(mockFile);
});

test("Test Application's getRandomPerson", async () => {
    await writeFile('name_list.txt', 'Ada\nBob\nCindy', 'utf8');
    const app = new Application();
    const [people, selected] = await app.getNames();
    const person = app.getRandomPerson();
    assert.ok(app.people.includes(person));
    fs.unlinkSync('name_list.txt');
});


test("Test Application's selectNextPerson", async () => {
    await writeFile('name_list.txt', 'Ada\nBob\nCindy', 'utf8');
    const app = new Application();
    const [people, selected] = await app.getNames();

    
    for (let i = 0; i < 3; i++) {
        const person = app.selectNextPerson();
        assert.ok(app.people.includes(person));
    }

    const person = app.selectNextPerson();
    assert.strictEqual(person, null);
    fs.unlinkSync('name_list.txt');
});



test("Test Application's notifySelected", async () => {
    const fakeData = `Gawr_Gura\nTAT\nOuO`;
    const fakeFile = 'name_list.txt';
    await writeFile(fakeFile, fakeData, 'utf8');

    const application = new Application();
    const [people, selected] = await application.getNames();

    assert.deepStrictEqual(people, ['Gawr_Gura', 'TAT', 'OuO']);
    assert.deepStrictEqual(selected, []);

    // Create a spy for the MailSystem's write and send methods
    const mailSystemSpy = {
        write: test.mock.fn(MailSystem.prototype.write),
        send: test.mock.fn(MailSystem.prototype.send)
    };
    application.mailSystem = mailSystemSpy;
    application.selected = ['Gawr_Gura', 'TAT'];

    application.notifySelected();

    // Check the number of calls and the arguments of the calls
    assert.strictEqual(mailSystemSpy.write.mock.callCount(), 2);
    assert.strictEqual(mailSystemSpy.send.mock.callCount(), 2);

    // Check the arguments of the calls
    assert.deepStrictEqual(
        mailSystemSpy.write.mock.calls.map(
            call => call.arguments[0]
        ), ['Gawr_Gura', 'TAT']
    );
    assert.deepStrictEqual(
        mailSystemSpy.send.mock.calls.map(
            call => call.arguments[0]
        ), ['Gawr_Gura', 'TAT']
    );

    // Remove the fake file
    fs.unlinkSync(fakeFile);
});
