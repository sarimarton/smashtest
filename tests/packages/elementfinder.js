/*
TODO




it("parses ElementFinders", function() {
    assert.doesNotThrow(() => {
        tree.parseLine(`Click ['Login' box]`, "file.txt", 10);
        tree.parseLine(`Click ['Login']`, "file.txt", 10);
        tree.parseLine(`Click [ 4th 'Login' box  next to  "blah" ]`, "file.txt", 10);
        tree.parseLine(`Click [ 'Login' next to "blah" ]`, "file.txt", 10);
        tree.parseLine(`Click [box next to "blah"]`, "file.txt", 10);
        tree.parseLine(`Click ['Login'] and [ 4th 'Login' box  next to  "blah" ]`, "file.txt", 10);
    });
});

it("throws an error when a [bracketed string] is not a valid ElementFinder", function() {
    assert.throws(() => {
        tree.parseLine(`Something [next to 'something']`, "file.txt", 10);
    }, "Invalid [ElementFinder] [file.txt:10]");

    assert.throws(() => {
        tree.parseLine(`Something [next to '\\{var\\}']`, "file.txt", 10);
    }, "Invalid [ElementFinder] [file.txt:10]");
});













describe("parseElementFinder()", function() {
    let tree = new Tree();

    it("parses ElementFinders with text", function() {
        let elementFinder = tree.parseElementFinder(`['Login']`);
        assert.deepEqual(elementFinder, {text: 'Login'});

        elementFinder = tree.parseElementFinder(`[ 'Login' ]`);
        assert.deepEqual(elementFinder, {text: 'Login'});
    });

    it("rejects ElementFinders with nextTo", function() {
        let elementFinder = tree.parseElementFinder(`[next to 'blah']`);
        assert.equal(elementFinder, null);

        elementFinder = tree.parseElementFinder(`[   next to "blah"  ]`);
        assert.equal(elementFinder, null);
    });

    it("parses ElementFinders with ordinal and text", function() {
        let elementFinder = tree.parseElementFinder(`[235th '  blah blah2 ']`);
        assert.deepEqual(elementFinder, {ordinal: 235, text: '  blah blah2 '});

        elementFinder = tree.parseElementFinder(`[ 235th  '  blah blah2 ' ]`);
        assert.deepEqual(elementFinder, {ordinal: 235, text: '  blah blah2 '});
    });

    it("parses ElementFinders with ordinal and variable", function() {
        let elementFinder = tree.parseElementFinder(`[6422nd blah blah2]`);
        assert.deepEqual(elementFinder, {ordinal: 6422, variable: 'blah blah2'});

        elementFinder = tree.parseElementFinder(`[ 6422nd  blah  blah2 ]`);
        assert.deepEqual(elementFinder, {ordinal: 6422, variable: 'blah  blah2'});
    });

    it("rejects ElementFinders with ordinal and nextTo", function() {
        let elementFinder = tree.parseElementFinder(`[2nd next to 'blah']`);
        assert.equal(elementFinder, null);

        elementFinder = tree.parseElementFinder(`[ 2nd   next to 'blah' ]`);
        assert.equal(elementFinder, null);
    });

    it("parses ElementFinders with text and variable", function() {
        let elementFinder = tree.parseElementFinder(`['Login' box]`);
        assert.deepEqual(elementFinder, {text: 'Login', variable: 'box'});

        elementFinder = tree.parseElementFinder(`[ 'Login'  box ]`);
        assert.deepEqual(elementFinder, {text: 'Login', variable: 'box'});
    });

    it("parses ElementFinders with text and nextTo", function() {
        let elementFinder = tree.parseElementFinder(`['Login' next to "blah"]`);
        assert.deepEqual(elementFinder, {text: 'Login', nextTo: 'blah'});

        elementFinder = tree.parseElementFinder(`[ 'Login'  next  to  "blah" ]`);
        assert.deepEqual(elementFinder, {text: 'Login', nextTo: 'blah'});
    });

    it("parses ElementFinders with variable and nextTo", function() {
        let elementFinder = tree.parseElementFinder(`[box next to "blah"]`);
        assert.deepEqual(elementFinder, {variable: 'box', nextTo: 'blah'});

        elementFinder = tree.parseElementFinder(`[ box  next  to  "blah" ]`);
        assert.deepEqual(elementFinder, {variable: 'box', nextTo: 'blah'});

        elementFinder = tree.parseElementFinder(`[22foo next to "blah"]`);
        assert.deepEqual(elementFinder, {variable: '22foo', nextTo: 'blah'});
    });

    it("parses ElementFinders with ordinal, text, and variable", function() {
        let elementFinder = tree.parseElementFinder(`[1st "Login" box]`);
        assert.deepEqual(elementFinder, {ordinal: 1, text: 'Login', variable: 'box'});

        elementFinder = tree.parseElementFinder(`[  1st  "Login"  big  box  ]`);
        assert.deepEqual(elementFinder, {ordinal: 1, text: 'Login', variable: 'big  box'});
    });

    it("parses ElementFinders with ordinal, text, and nextTo", function() {
        let elementFinder = tree.parseElementFinder(`[20th " Login  thing " next to "blah"]`);
        assert.deepEqual(elementFinder, {ordinal: 20, text: ' Login  thing ', nextTo: 'blah'});

        elementFinder = tree.parseElementFinder(`[  20th " Login  thing "  next  to  "blah" ]`);
        assert.deepEqual(elementFinder, {ordinal: 20, text: ' Login  thing ', nextTo: 'blah'});
    });

    it("parses ElementFinders with ordinal, variable, and nextTo", function() {
        let elementFinder = tree.parseElementFinder(`[14th box next to "blah"]`);
        assert.deepEqual(elementFinder, {ordinal: 14, variable: 'box', nextTo: 'blah'});

        elementFinder = tree.parseElementFinder(`[ 13th  box  next  to "blah"  ]`);
        assert.deepEqual(elementFinder, {ordinal: 13, variable: 'box', nextTo: 'blah'});
    });

    it("parses ElementFinders with text, variable, and nextTo", function() {
        let elementFinder = tree.parseElementFinder(`['Login' box next to "blah"]`);
        assert.deepEqual(elementFinder, {text: 'Login', variable: 'box', nextTo: 'blah'});

        elementFinder = tree.parseElementFinder(`[ 'Login' box  next to  "blah" ]`);
        assert.deepEqual(elementFinder, {text: 'Login', variable: 'box', nextTo: 'blah'});
    });

    it("parses ElementFinders with ordinal, text, variable, and nextTo", function() {
        let elementFinder = tree.parseElementFinder(`[14th 'Login' box next to "blah"]`);
        assert.deepEqual(elementFinder, {ordinal: 14, text: 'Login', variable: 'box', nextTo: 'blah'});

        elementFinder = tree.parseElementFinder(`[ 13th 'Login'  box  next  to "blah"  ]`);
        assert.deepEqual(elementFinder, {ordinal: 13, text: 'Login', variable: 'box', nextTo: 'blah'});
    });

    it("rejects other invalid ElementFinders", function() {
        let elementFinder = tree.parseElementFinder(`[something 'not' elementfinder]`);
        assert.equal(elementFinder, null);

        let elementFinder = tree.parseElementFinder(`'text' box`);
        assert.equal(elementFinder, null);

        let elementFinder = tree.parseElementFinder(`['text' box`);
        assert.equal(elementFinder, null);

        let elementFinder = tree.parseElementFinder(`'text' box]`);
        assert.equal(elementFinder, null);

        elementFinder = tree.parseElementFinder(``);
        assert.equal(elementFinder, null);

        elementFinder = tree.parseElementFinder(`  `);
        assert.equal(elementFinder, null);
    });
});
*/