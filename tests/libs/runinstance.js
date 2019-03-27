const chai = require('chai');
const chaiSubset = require('chai-subset');
const chaiAsPromised = require("chai-as-promised");
const expect = chai.expect;
const assert = chai.assert;
const util = require('util');
const Step = require('../../step.js');
const Branch = require('../../branch.js');
const Tree = require('../../tree.js');
const Runner = require('../../runner.js');
const RunInstance = require('../../runinstance.js');

chai.use(chaiSubset);
chai.use(chaiAsPromised);

describe("RunInstance", function() {
    describe("run()", function() {
        it.skip("runs a branch it pulls from the tree", async function() {
        });

        it.skip("runs multiple branches it pulls from the tree", async function() {
        });

        it.skip("handles a step that fails but doesn't stop execution", async function() {
        });

        it.skip("handles a step that fails and ends executing the branch", async function() {
        });

        it.skip("handles a step that pauses execution", async function() {
        });

        it.skip("handles a resume from a previous pause, where the current step never ran", async function() {
            // current step is run
            // just call run() again after the pause
            // vars are still properly set, etc.
        });

        it.skip("handles a resume from a previous pause, where the current step completed", async function() {
            // next step is pulled out
            // vars are still properly set, etc.
        });

        it.skip("runs a Before Every Branch hook", async function() {
        });

        it.skip("runs multiple Before Every Branch and After Every Branch hooks", async function() {
        });

        it.skip("handles an error inside a Before Every Branch hook", async function() {
            // error goes into the Branch object, whole Branch fails and ends
        });

        it.skip("handles an error inside an After Every Branch hook", async function() {
            // error goes into the Branch object, whole Branch fails and ends
        });

        it.skip("a {var} and {{var}} declared in a branch is accessible in an After Every Branch hook", async function() {
        });

        it.skip("clears local and global variables between different branches", async function() {
        });

        it.skip("skips a step and pauses again when skipNextStep is set", async function() {
        });

        it.skip("sets branch.elapsed to how long it took the branch to execute", async function() {
            // Try two different branches, one that runs longer than the other, and assert that one > other
        });

        it.skip("sets branch.elapsed to how long it took the branch to execute when a stop ocurred", async function() {
        });

        it.skip("sets branch.elapsed to -1 when a pause occurred", async function() {
        });

        it.skip("sets branch.elapsed to -1 when a pause and resume occurred", async function() {
        });
    });

    describe("runStep()", function() {
        it("executes a textual step", async function() {
            var tree = new Tree();
            tree.parseIn(`
A -
`, "file.txt");

            tree.generateBranches();

            var runner = new Runner();
            runner.tree = tree;
            var runInstance = new RunInstance(runner);

            await runInstance.runStep(tree.branches[0].steps[0], tree.branches[0], false);
        });

        it("executes a step with a code block", async function() {
            var tree = new Tree();
            tree.parseIn(`
A - {
    runInstance.flag = true;
}
`, "file.txt");

            tree.generateBranches();

            var runner = new Runner();
            runner.tree = tree;
            var runInstance = new RunInstance(runner);

            await runInstance.runStep(tree.branches[0].steps[0], tree.branches[0], false);

            expect(runInstance.flag).to.equal(true);
        });

        it("executes a function call with no {{variables}} in its function declaration", async function() {
            var tree = new Tree();
            tree.parseIn(`
F

* F {
    runInstance.flag = true;
}
`, "file.txt");

            tree.generateBranches();

            var runner = new Runner();
            runner.tree = tree;
            var runInstance = new RunInstance(runner);

            await runInstance.runStep(tree.branches[0].steps[0], tree.branches[0], false);

            expect(runInstance.flag).to.equal(true);
        });

        it("executes a function call with {{variables}} in its function declaration, passing in 'strings'", async function() {
            var tree = new Tree();
            tree.parseIn(`
My 'foo' Function 'bar'

* My {{one}} Function {{two}} {
    runInstance.one = one;
    runInstance.two = two;
}
`, "file.txt");

            tree.generateBranches();

            var runner = new Runner();
            runner.tree = tree;
            var runInstance = new RunInstance(runner);

            await runInstance.runStep(tree.branches[0].steps[0], tree.branches[0], false);

            expect(runInstance.one).to.equal("foo");
            expect(runInstance.two).to.equal("bar");
        });

        it("executes a function call with {{variables}} in its function declaration, passing in \"strings\"", async function() {
            var tree = new Tree();
            tree.parseIn(`
"foo" My "bar"  Function 'blah'

* {{first}} My {{second}} Function {{third}} {
    runInstance.first = first;
    runInstance.second = second;
    runInstance.third = third;
}
`, "file.txt");

            tree.generateBranches();

            var runner = new Runner();
            runner.tree = tree;
            var runInstance = new RunInstance(runner);

            await runInstance.runStep(tree.branches[0].steps[0], tree.branches[0], false);

            expect(runInstance.first).to.equal("foo");
            expect(runInstance.second).to.equal("bar");
            expect(runInstance.third).to.equal("blah");
        });

        it("executes a function call with {{variables}} in its function declaration, passing in {variables}", async function() {
            var tree = new Tree();
            tree.parseIn(`
My {A} Function { b }

* My {{one}} Function {{two}} {
    runInstance.one = one;
    runInstance.two = two;
}
`, "file.txt");

            tree.generateBranches();

            var runner = new Runner();
            runner.tree = tree;
            var runInstance = new RunInstance(runner);
            runInstance.global.a = "foo";
            runInstance.global.b = "bar";

            await runInstance.runStep(tree.branches[0].steps[0], tree.branches[0], false);

            expect(runInstance.one).to.equal("foo");
            expect(runInstance.two).to.equal("bar");
        });

        it("executes a function call with {{variables}} in its function declaration, passing in {{variables}}", async function() {
            var tree = new Tree();
            tree.parseIn(`
My {{A}} Function {{ b }} { a B  c }

* My {{one}} Function {{two}} {{three}} {
    runInstance.one = one;
    runInstance.two = two;
    runInstance.three = three;
}
`, "file.txt");

            tree.generateBranches();

            var runner = new Runner();
            runner.tree = tree;
            var runInstance = new RunInstance(runner);
            runInstance.local.a = "foo";
            runInstance.local.b = "bar";
            runInstance.global["a b c"] = "blah";

            await runInstance.runStep(tree.branches[0].steps[0], tree.branches[0], false);

            expect(runInstance.one).to.equal("foo");
            expect(runInstance.two).to.equal("bar");
            expect(runInstance.three).to.equal("blah");
        });

        it("executes a function call with {{variables}} in its function declaration, passing in 'strings containing {variables}'", async function() {
            var tree = new Tree();
            tree.parseIn(`
My '{A} and { b }' Function '{B}'

* My {{one}} Function {{two}} {
    runInstance.one = one;
    runInstance.two = two;
}
`, "file.txt");

            tree.generateBranches();

            var runner = new Runner();
            runner.tree = tree;
            var runInstance = new RunInstance(runner);
            runInstance.global.a = "foo";
            runInstance.global.b = "b\"a'r";

            await runInstance.runStep(tree.branches[0].steps[0], tree.branches[0], false);

            expect(runInstance.one).to.equal("foo and b\"a'r");
            expect(runInstance.two).to.equal("b\"a'r");
        });

        it("executes a function call with {{variables}} in its function declaration, passing in \"strings containing {{variables}}\"", async function() {
            var tree = new Tree();
            tree.parseIn(`
My "{A} and { b }" Function "{B}"

* My {{one}} Function {{two}} {
    runInstance.one = one;
    runInstance.two = two;
}
`, "file.txt");

            tree.generateBranches();

            var runner = new Runner();
            runner.tree = tree;
            var runInstance = new RunInstance(runner);
            runInstance.global.a = "foo";
            runInstance.global.b = "b\"a'r";

            await runInstance.runStep(tree.branches[0].steps[0], tree.branches[0], false);

            expect(runInstance.one).to.equal("foo and b\"a'r");
            expect(runInstance.two).to.equal("b\"a'r");
        });

        it("executes a function call with {{variables}} in its function declaration, passing in [strings]", async function() {
            var tree = new Tree();
            tree.parseIn(`
My [4th 'Login' button next to 'something'] Function [ big link ]

* My {{one}} Function {{two}} {
    runInstance.one = one;
    runInstance.two = two;
}
`, "file.txt");

            tree.generateBranches();

            var runner = new Runner();
            runner.tree = tree;
            var runInstance = new RunInstance(runner);

            await runInstance.runStep(tree.branches[0].steps[0], tree.branches[0], false);

            expect(runInstance.one).to.equal("4th 'Login' button next to 'something'");
            expect(runInstance.two).to.equal(" big link ");
        });

        it("executes a function call with {{variables}} in its function declaration, passing in [strings containing {variables}]", async function() {
            var tree = new Tree();
            tree.parseIn(`
My [{{N}}th 'Login {{A}}' {b} next to '{{ C }}'] Function [ big { d d } ]

* My {{one}} Function {{two}} {
    runInstance.one = one;
    runInstance.two = two;
}
`, "file.txt");

            tree.generateBranches();

            var runner = new Runner();
            runner.tree = tree;
            var runInstance = new RunInstance(runner);
            runInstance.local.a = "sign";
            runInstance.global.b = "small button";
            runInstance.local.c = "lots of CATS!";
            runInstance.local.n = 14;
            runInstance.global["d d"] = "link";

            await runInstance.runStep(tree.branches[0].steps[0], tree.branches[0], false);

            expect(runInstance.one).to.equal("14th 'Login sign' small button next to 'lots of CATS!'");
            expect(runInstance.two).to.equal(" big link ");
        });

        it("executes a function call with {{variables}} in its function declaration, passing in 'strings', \"strings\", [strings], and {variables}", async function() {












        });

        it.skip("executes a function call where {variables} are passed in and are only set in a later step, which is in format {var}='string'", async function() {
        });

        it.skip("executes a function call where {variables} are passed in and are only set in a later step, which is a synchronous code block", async function() {
        });

        it.skip("fails step if a function call has a {variable} passed in and it is only set in a later step, which is an asynchronous code block", async function() {
        });

        it.skip("fails step if a function call has a {variable} passed in and it is never set", async function() {
        });

        it.skip("executes a function call where 'strings' containing vars are passed in and those vars are only set in a later step, which is in format {var}='string'", async function() {
        });

        it.skip("executes a function call where 'strings' containing vars are passed in and those vars are only set in a later step, which is a synchronous code block", async function() {
        });

        it.skip("fails step if a function call has a 'string' containing a var passed in and that var is only set in a later step, which is an asynchronous code block", async function() {
        });

        it.skip("fails step if a function call has a 'string' containing a var that is never set", async function() {
        });

        it.skip("executes a function call where the function has no steps inside of it", async function() {
        });

        it.skip("allows {{variables}} passed in through a function call to be accessed by steps inside the function", async function() {
        });

        it.skip("allows {{variables}} passed in through a function call to be accessed by the function's code block", async function() {
        });

        it.skip("ignores {{variables}} inside the text of a textual step", async function() {
        });

        it.skip("ignores {{variables}} inside the text of a textual step with a code block, but those {{variables}} are still accessible inside the code block nonetheless", async function() {
        });

        it.skip("executes a function call where 'string with {var}' is passed in, with another step being {var}='string with apos \' '", async function() {
        });

        it.skip("executes a function call where 'string with {var}' is passed in, with another step being {var}=\"string with apos ' \"", async function() {
        });

        it.skip("executes a function call with nothing in its body", async function() {
        });

        it.skip("executes a {var} = 'string' step", async function() {
        });

        it.skip("executes a {{var}} = 'string' step", async function() {
        });

        it.skip("executes a {var} = [string] step", async function() {
        });

        it.skip("executes a {var} = '{other var}' step", async function() {
        });

        it.skip("executes a {var1} = '{var2} {{var3}} etc.' step", async function() {
            // trim vars
        });

        it.skip("executes a {var1} = [ 'string {var2}' {{var3}} ] step", async function() {
            // trim vars
        });

        it.skip("executes a {var1} = '{var2} {{var3}} etc.' step that needs to look down the branch for the values of some variables", async function() {
            // trim vars
        });

        it.skip("executes a {var1} = 'string1', {{var2}} = 'string2', {{var3}} = [string3] etc. step", async function() {
            // trim vars
        });

        it.skip("executes a {var} = Text { code block } step", async function() {
        });

        it.skip("executes a {var} = Function step, where the function declaration has a code block that returns a value", async function() {
        });

        it.skip("executes a {var} = Function step, where the function declaration has {{variables}} and has a code block that returns a value", async function() {
        });

        it.skip("executes a {var} = Function step, where the function declaration is in {x}='value' format", async function() {
        });

        it.skip("allows a code block to get variables via the local, global, and persistent objects", async function() {
        });

        it.skip("makes a passed-in {variable} accessible as a plain js variable inside a code block", async function() {
            // verify the change reflected in the global obj after the function ran
        });

        it.skip("makes a passed-in {{variable}} accessible as a plain js variable inside a code block", async function() {
            // verify the change reflected in the local obj after the function ran
        });

        it.skip("does not make a passed-in {{variable}} accessible as a plain js variable inside a code block if it has non-whitelisted chars in its name", async function() {
            // whitelisted chars = [A-Za-z0-9\-\_\.]
        });

        it.skip("makes a {variable} accessible as a plain js variable inside a code block", async function() {
            // verify the change reflected in the global obj after the function ran
        });

        it.skip("makes a {{variable}} accessible as a plain js variable inside a code block", async function() {
            // verify the change reflected in the local obj after the function ran
        });

        it.skip("does not make a {{variable}} accessible as a plain js variable inside a code block if it has non-whitelisted chars in its name", async function() {
            // whitelisted chars = [A-Za-z0-9\-\_\.]
        });

        it.skip("runs an Execute In Browser step", async function() {
            // inject runinstance.execInBrowser(code) function first
        });

        it.skip("executes a step that logs", async function() {
        });

        it.skip("pauses when a ~ step is encountered", async function() {
        });

        it.skip("when resuming from a pause on a ~, doesn't pause on the ~ again", async function() {
        });

        it.skip("pauses when pauseOnFail is set and a step fails", async function() {
        });

        it.skip("pauses when pauseOnFail is set and a step unexpectedly passes", async function() {
        });

        it.skip("doesn't pause when pauseOnFail is not set and a step fails", async function() {
        });

        it.skip("doesn't pause when pauseOnFail is not set and a step unexpectedly passes", async function() {
        });

        it.skip("marks a step as expectedly failed when it expectedly fails", async function() {
            // also sets asExpected, error, and log in the step
        });

        it.skip("marks a step as unexpectedly failed when it unexpectedly fails", async function() {
            // also sets asExpected, error, and log in the step
        });

        it.skip("marks a step as expectedly passed when it expectedly passes", async function() {
            // also sets asExpected, error, and log in the step
        });

        it.skip("marks a step as unexpectedly passed when it unexpectedly passes", async function() {
            // also sets asExpected, error, and log in the step
        });

        it.skip("handles bad syntax in a code block step", async function() {
        });

        it.skip("doesn't finish off the branch if a step has an unexpected error and the error's continue flag is set", async function() {
        });

        it.skip("doesn't finish off the branch if a step has an unexpected error and pauseOnFail is set", async function() {
        });

        it.skip("creates a fresh local var context within a function call", async function() {
            // branchIndents increased by 1
        });

        it.skip("clears local vars and reinstates previous local var context when exiting a function call", async function() {
            // branchIndents fell by 1
        });

        it.skip("clears local vars and reinstates previous local var context when exiting multiple levels of function calls", async function() {
            // branchIndents fell by 2 or more
        });

        it.skip("a {var} is accessible in a later step", async function() {
        });

        it.skip("a {var} is accessible inside function calls", async function() {
        });

        it.skip("a {var} declared inside a function call is accessible in steps after the function call", async function() {
        });

        it.skip("a {var} declared in a branch is accessible in an After Every Step hook", async function() {
        });

        it.skip("a {{var}} is accessible in a later step", async function() {
        });

        it.skip("a {{var}} is not accessible inside function calls", async function() {
        });

        it.skip("a {{var}} declared inside a function call is not accessible in steps after the function call", async function() {
        });

        it.skip("a {{var}} declared in a branch is accessible in an After Every Step hook, so long as it didn't go out of scope", async function() {
        });

        it.skip("runs a Before Every Step hook", async function() {
        });

        it.skip("runs multiple Before Every Step and After Every Step hooks", async function() {
        });

        it.skip("handles an error inside a Before Every Step hook", async function() {
            // error goes into the normal step obj, error.filename/lineNumber point at the hook
            // normal step its associated with is immediately failed
        });

        it.skip("handles an error inside an After Every Step hook", async function() {
            // error goes into the normal step obj, error.filename/lineNumber point at the hook
            // normal step its associated with is immediately failed
        });

        it.skip("pauses when an error occurs inside a Before Every Step hook and pauseOnFail is set", async function() {
        });

        it.skip("pauses when an error occurs inside an After Every Step hook and pauseOnFail is set", async function() {
        });

        it.skip("pauses when an error occurs inside a Before Every Step hook, pauseOnFail is set, and we we're at the last step of the branch", async function() {
        });

        it.skip("pauses when an error occurs inside an After Every Step hook, pauseOnFail is set, and we we're at the last step of the branch", async function() {
        });

        it.skip("updates the report", async function() {
        });

        it.skip("sets step.elapsed to how long it took step to execute", async function() {
            // step.elapsed is set. Try two different steps, one that runs longer than the other, and assert that one > other
        });

        it.skip("sets step.elapsed to how long it took step to execute when a stop ocurred", async function() {
        });

        it.skip("sets step.elapsed to -1 when a pause occurred", async function() {
        });

        it.skip("sets step.elapsed to -1 when a pause and resume occurred", async function() {
        });
    });

    describe("runHookStep()", function() {
        it("runs a passing hook step", async function() {
            var step = new Step();
            step.codeBlock = ``;

            var tree = new Tree();
            var runner = new Runner();
            runner.tree = tree;
            var runInstance = new RunInstance(runner);

            var retVal = await runInstance.runHookStep(step);
            expect(retVal).to.equal(true);
        });

        it("runs a failing hook step with only a stepToGetError", async function() {
            var step = new Step();
            step.filename = "file1.txt";
            step.lineNumber = 10;
            step.codeBlock = `
                throw new Error("foobar");
            `;

            var stepToGetError = new Step();
            stepToGetError.filename = "file2.txt";
            stepToGetError.lineNumber = 20;

            var tree = new Tree();
            var runner = new Runner();
            runner.tree = tree;
            var runInstance = new RunInstance(runner);

            var retVal = await runInstance.runHookStep(step, stepToGetError);
            expect(retVal).to.equal(false);
            expect(stepToGetError.error.message).to.equal("foobar");
            expect(stepToGetError.error.filename).to.equal("file1.txt");
            expect(stepToGetError.error.lineNumber).to.equal(10);
        });

        it("runs a failing hook step with only a branchToGetError", async function() {
            var step = new Step();
            step.filename = "file1.txt";
            step.lineNumber = 10;
            step.codeBlock = `
                throw new Error("foobar");
            `;

            var branchToGetError = new Branch();

            var tree = new Tree();
            var runner = new Runner();
            runner.tree = tree;
            var runInstance = new RunInstance(runner);

            var retVal = await runInstance.runHookStep(step, null, branchToGetError);
            expect(retVal).to.equal(false);
            expect(branchToGetError.error.message).to.equal("foobar");
            expect(branchToGetError.error.filename).to.equal("file1.txt");
            expect(branchToGetError.error.lineNumber).to.equal(10);
        });

        it("runs a failing hook step with both a stepToGetError and a branchToGetError", async function() {
            var step = new Step();
            step.filename = "file1.txt";
            step.lineNumber = 10;
            step.codeBlock = `
                throw new Error("foobar");
            `;

            var stepToGetError = new Step();
            stepToGetError.filename = "file2.txt";
            stepToGetError.lineNumber = 20;

            var branchToGetError = new Branch();

            var tree = new Tree();
            var runner = new Runner();
            runner.tree = tree;
            var runInstance = new RunInstance(runner);

            var retVal = await runInstance.runHookStep(step, stepToGetError, branchToGetError);
            expect(retVal).to.equal(false);

            expect(stepToGetError.error.message).to.equal("foobar");
            expect(stepToGetError.error.filename).to.equal("file1.txt");
            expect(stepToGetError.error.lineNumber).to.equal(10);

            expect(branchToGetError.error.message).to.equal("foobar");
            expect(branchToGetError.error.filename).to.equal("file1.txt");
            expect(branchToGetError.error.lineNumber).to.equal(10);
        });

        it("runs a failing hook step with no stepToGetError and no branchToGetError", async function() {
            var step = new Step();
            step.filename = "file1.txt";
            step.lineNumber = 10;
            step.codeBlock = `
                throw new Error("foobar");
            `;

            var tree = new Tree();
            var runner = new Runner();
            runner.tree = tree;
            var runInstance = new RunInstance(runner);

            var retVal = await runInstance.runHookStep(step);
            expect(retVal).to.equal(false);
        });
    });

    describe("replaceVars()", function() {
        it("replaces {vars} and {{vars}} with their values", function() {
            var tree = new Tree();
            tree.parseIn(`
A -
    {var1}='value1'
        {{var2}} = 'value2'
            {var 3}= "value 3", {{var5}} ='value5',{var6}=[value6]
                {{ var 4 }}=" value 4 "
`, "file.txt");

            tree.generateBranches();

            var runner = new Runner();
            runner.tree = tree;
            var runInstance = new RunInstance(runner);
            runInstance.setGlobal("var0", "value0");

            expect(runInstance.replaceVars("{var0} {var1} - {{var2}}{var 3}-{{var 4}}  {{var5}} {var6}", tree.branches[0].steps[0], tree.branches[0])).to.equal("value0 value1 - value2value 3- value 4   value5 value6");
        });

        it("handles a branch of null", function() {
            var tree = new Tree();
            tree.parseIn(`
{var1}='value1'
`, "file.txt");

            tree.generateBranches();

            var runner = new Runner();
            runner.tree = tree;
            var runInstance = new RunInstance(runner);
            runInstance.setGlobal("var0", "value0");

            expect(runInstance.replaceVars("{var1} {var1}", tree.branches[0].steps[0], null)).to.equal("value1 value1");
        });

        it("doesn't affect a string that doesn't contain variables", function() {
            var tree = new Tree();
            tree.parseIn(`
A -
`, "file.txt");

            tree.generateBranches();

            var runner = new Runner();
            runner.tree = tree;
            var runInstance = new RunInstance(runner);

            expect(runInstance.replaceVars("foo bar", tree.branches[0].steps[0], tree.branches[0])).to.equal("foo bar");
        });

        it("throws an error when vars reference each other in an infinite loop", function() {
            var tree = new Tree();
            tree.parseIn(`
A -
    {var1}='{var1}'
`, "file.txt");

            tree.generateBranches();

            var runner = new Runner();
            runner.tree = tree;
            var runInstance = new RunInstance(runner);

            assert.throws(() => {
                runInstance.replaceVars("{var1}", tree.branches[0].steps[0], tree.branches[0]);
            }, "Infinite loop detected amongst variable references [file.txt:2]");

            tree = new Tree();
            tree.parseIn(`
A -
    {var1}='{var2} {var3}'
        {var2}='foo'
            {var3}='bar{var1}'
`, "file.txt");

            tree.generateBranches();

            var runner = new Runner();
            runner.tree = tree;
            var runInstance = new RunInstance(runner);

            assert.throws(() => {
                expect(runInstance.replaceVars("{var1}", tree.branches[0].steps[0], tree.branches[0]));
            }, "Infinite loop detected amongst variable references [file.txt:2]");
        });
    });

    describe("evalCodeBlock()", function() {
        it("evals a code and returns a value asynchonously", async function() {
            var runner = new Runner();
            var runInstance = new RunInstance(runner);

            await expect(runInstance.evalCodeBlock("return 5;")).to.eventually.equal(5);
        });

        it("evals a code and returns a value synchronously", function() {
            var runner = new Runner();
            var runInstance = new RunInstance(runner);

            expect(runInstance.evalCodeBlock("return 5;", true)).to.equal(5);
        });

        it("returns undefined when executing code that has no return value synchronously", function() {
            var runner = new Runner();
            var runInstance = new RunInstance(runner);

            expect(runInstance.evalCodeBlock("5;", true)).to.equal(undefined);
        });

        it("makes the persistent, global, and local objects available", async function() {
            var runner = new Runner();
            var runInstance = new RunInstance(runner);
            runInstance.setPersistent("a", "A");
            runInstance.setGlobal("b", "B");
            runInstance.setLocal("c", "C");

            await expect(runInstance.evalCodeBlock("return getPersistent('a');")).to.eventually.equal("A");
            await expect(runInstance.evalCodeBlock("return getGlobal('b');")).to.eventually.equal("B");
            await expect(runInstance.evalCodeBlock("return getLocal('c');")).to.eventually.equal("C");

            await runInstance.evalCodeBlock("setPersistent('a', 'AA'); setGlobal('b', 'BB'); setLocal('c', 'CC');");

            expect(runInstance.getPersistent("a")).to.equal("AA");
            expect(runInstance.getGlobal("b")).to.equal("BB");
            expect(runInstance.getLocal("c")).to.equal("CC");
        });

        it("makes persistent, global, and local variables available as js variables", async function() {
            var runner = new Runner();
            var runInstance = new RunInstance(runner);
            runInstance.setPersistent('a', "A");
            runInstance.setGlobal('b', "B");
            runInstance.setLocal('c', "C");

            await expect(runInstance.evalCodeBlock("return a;")).to.eventually.equal("A");
            await expect(runInstance.evalCodeBlock("return b;")).to.eventually.equal("B");
            await expect(runInstance.evalCodeBlock("return c;")).to.eventually.equal("C");
        });

        it("makes a local variable accessible as a js variable if both a local and global variable share the same name", async function() {
            var runner = new Runner();
            var runInstance = new RunInstance(runner);
            runInstance.setGlobal('b', "B");
            runInstance.setLocal('b', "C");

            await expect(runInstance.evalCodeBlock("return b;")).to.eventually.equal("C");
        });

        it("makes a global variable accessible as a js variable if both a global and persistent variable share the same name", async function() {
            var runner = new Runner();
            var runInstance = new RunInstance(runner);
            runInstance.setPersistent('b', "B");
            runInstance.setGlobal('b', "C");

            await expect(runInstance.evalCodeBlock("return b;")).to.eventually.equal("C");
        });

        it("makes a local variable accessible as a js variable if both a local and persistent variable share the same name", async function() {
            var runner = new Runner();
            var runInstance = new RunInstance(runner);
            runInstance.setPersistent('b', "B");
            runInstance.setLocal('b', "C");

            await expect(runInstance.evalCodeBlock("return b;")).to.eventually.equal("C");
        });

        it("does not make a variable available as js variable if its name contains non-whitelisted characters", async function() {
            var runner = new Runner();
            var runInstance = new RunInstance(runner);
            runInstance.setPersistent(" one two ", "A");
            runInstance.setGlobal("three four", "B");
            runInstance.setLocal("five>six", "C");
            runInstance.setLocal("seven", "D");

            await expect(runInstance.evalCodeBlock("return seven;")).to.eventually.equal("D");
        });

        it("allows for logging inside the code", async function() {
            var runner = new Runner();
            var runInstance = new RunInstance(runner);
            var step = new Step();

            await runInstance.evalCodeBlock("log('foobar');", false, step);

            expect(step.log).to.equal("foobar\n");
        });
    });

    describe("findVarValue()", function() {
        it("returns the value of a local variable that's already set", function() {
            var tree = new Tree();
            tree.parseIn(`
A -
`, "file.txt");

            tree.generateBranches();

            var runner = new Runner();
            runner.tree = tree;
            var runInstance = new RunInstance(runner);
            runInstance.setLocal("var0", "value0");

            expect(runInstance.findVarValue("var0", true, tree.branches[0].steps[0], tree.branches[0])).to.equal("value0");
        });

        it("returns the value of a global variable that's already set", function() {
            var tree = new Tree();
            tree.parseIn(`
A -
`, "file.txt");

            tree.generateBranches();

            var runner = new Runner();
            runner.tree = tree;
            var runInstance = new RunInstance(runner);
            runInstance.setGlobal("var0", "value0");

            expect(runInstance.findVarValue("var0", false, tree.branches[0].steps[0], tree.branches[0])).to.equal("value0");
        });

        it("returns the value of a variable that's set on the same line, and with a branch of null", function() {
            var tree = new Tree();
            tree.parseIn(`
{var1}='value1'
`, "file.txt");

            tree.generateBranches();

            var runner = new Runner();
            runner.tree = tree;
            var runInstance = new RunInstance(runner);

            expect(runInstance.findVarValue("var1", false, tree.branches[0].steps[0], null)).to.equal("value1");
        });

        it("returns the value of a variable that's not set yet and whose eventual value is a plain string", function() {
            var tree = new Tree();
            tree.parseIn(`
A -
    {var1}="value1"
`, "file.txt");

            tree.generateBranches();

            var runner = new Runner();
            runner.tree = tree;
            var runInstance = new RunInstance(runner);

            expect(runInstance.findVarValue("var1", false, tree.branches[0].steps[0], tree.branches[0])).to.equal("value1");
            expect(tree.branches[0].steps[0].log).to.equal("The value of variable {var1} is being set by a later step at file.txt:3\n");
        });

        it("returns the value of a variable given the same variable name in a different case", function() {
            var tree = new Tree();
            tree.parseIn(`
A -
    {var one}="value1"
`, "file.txt");

            tree.generateBranches();

            var runner = new Runner();
            runner.tree = tree;
            var runInstance = new RunInstance(runner);

            expect(runInstance.findVarValue("VAR ONE", false, tree.branches[0].steps[0], tree.branches[0])).to.equal("value1");
            expect(tree.branches[0].steps[0].log).to.equal("The value of variable {VAR ONE} is being set by a later step at file.txt:3\n");
        });

        it("returns the value of a variable given the same variable name but with varying amounts of whitespace", function() {
            var tree = new Tree();
            tree.parseIn(`
A -
    { var  one  }="value1"
`, "file.txt");

            tree.generateBranches();

            var runner = new Runner();
            runner.tree = tree;
            var runInstance = new RunInstance(runner);

            expect(runInstance.findVarValue("var one", false, tree.branches[0].steps[0], tree.branches[0])).to.equal("value1");
            expect(tree.branches[0].steps[0].log).to.equal("The value of variable {var one} is being set by a later step at file.txt:3\n");

            tree = new Tree();
            tree.parseIn(`
A -
    {var one}="value1"
`, "file.txt");

            tree.generateBranches();

            var runner = new Runner();
            runner.tree = tree;
            var runInstance = new RunInstance(runner);

            expect(runInstance.findVarValue("    Var     ONE     ", false, tree.branches[0].steps[0], tree.branches[0])).to.equal("value1");
            expect(tree.branches[0].steps[0].log).to.equal("The value of variable {    Var     ONE     } is being set by a later step at file.txt:3\n");
        });

        it("returns the value of a variable that's not set yet and whose eventual value contains more variables", function() {
            // If the original step is A, and its vars are defined in B, then's B's vars are defined 1) before A, 2) between A and B, and 3) after B
            var tree = new Tree();
            tree.parseIn(`
A -
    {{var2}} = 'value2'
        {var1}='{{var2}} {var 3} . {var0} {{var5}}'
            {var 3}= "-{{var 4}}-", {{var5}}='value5'
                B -
                    {{ var 4 }}=[ value 4 ]
`, "file.txt");

            tree.generateBranches();

            var runner = new Runner();
            runner.tree = tree;
            var runInstance = new RunInstance(runner);
            runInstance.setGlobal("var0", "value0");

            expect(runInstance.findVarValue("var1", false, tree.branches[0].steps[0], tree.branches[0])).to.equal("value2 - value 4 - . value0 value5");
            expect(tree.branches[0].steps[0].log).to.equal(`The value of variable {{var2}} is being set by a later step at file.txt:3
The value of variable {{var 4}} is being set by a later step at file.txt:7
The value of variable {var 3} is being set by a later step at file.txt:5
The value of variable {{var5}} is being set by a later step at file.txt:5
The value of variable {var1} is being set by a later step at file.txt:4
`);
        });

        it("returns the value of a variable that's not set yet and whose eventual value is generated from a sync code block function", function() {
            var tree = new Tree();
            tree.parseIn(`
A -
    {var1} = F {
        return "foobar";
    }

        {var2} = F2

        * F2 {
            return "blah";
        }
`, "file.txt");

            tree.generateBranches();

            var runner = new Runner();
            runner.tree = tree;
            var runInstance = new RunInstance(runner);

            expect(runInstance.findVarValue("var1", false, tree.branches[0].steps[0], tree.branches[0])).to.equal("foobar");
            expect(tree.branches[0].steps[0].log).to.equal("The value of variable {var1} is being set by a later step at file.txt:3\n");

            expect(runInstance.findVarValue("var2", false, tree.branches[0].steps[0], tree.branches[0])).to.equal("blah");
            expect(tree.branches[0].steps[0].log).to.equal(`The value of variable {var1} is being set by a later step at file.txt:3
The value of variable {var2} is being set by a later step at file.txt:7
`);
        });

        it("throws an error if the variable's value is never set", function() {
            var tree = new Tree();
            tree.parseIn(`
A -
    {var1}="value1"
`, "file.txt");

            tree.generateBranches();

            var runner = new Runner();
            runner.tree = tree;
            var runInstance = new RunInstance(runner);

            assert.throws(() => {
                runInstance.findVarValue("var2", false, tree.branches[0].steps[0], tree.branches[0]);
            }, "The variable {var2} is never set, but is needed for this step [file.txt:2]");
        });

        it("throws an error if the variable's value contains more variables, but one of those variables is never set", function() {
            var tree = new Tree();
            tree.parseIn(`
A -
    {var1}="-{{var2}}-"
        {{var3}}="-{var4}-"
`, "file.txt");

            tree.generateBranches();

            var runner = new Runner();
            runner.tree = tree;
            var runInstance = new RunInstance(runner);

            assert.throws(() => {
                runInstance.findVarValue("var1", false, tree.branches[0].steps[0], tree.branches[0]);
            }, "The variable {{var2}} is never set, but is needed for this step [file.txt:2]");

            assert.throws(() => {
                runInstance.findVarValue("var3", true, tree.branches[0].steps[0], tree.branches[0]);
            }, "The variable {var4} is never set, but is needed for this step [file.txt:2]");
        });
    });

    describe("appendToLog()", function() {
        it("logs a string to a step, where no other logs exist", function() {
            var step = new Step();
            var runner = new Runner();
            var runInstance = new RunInstance(runner);

            runInstance.appendToLog("foobar", step);

            expect(step.log).to.equal("foobar\n");
        });

        it("logs a string to a step, where other logs exist", function() {
            var step = new Step();
            var branch = new Branch();
            var runner = new Runner();
            var runInstance = new RunInstance(runner);

            step.log = "foo\n";
            runInstance.appendToLog("bar", step, branch);

            expect(step.log).to.equal("foo\nbar\n");
        });

        it("logs a string to a branch, where no other logs exist and where there is no step", function() {
            var branch = new Branch();
            var runner = new Runner();
            var runInstance = new RunInstance(runner);

            runInstance.appendToLog("foobar", null, branch);

            expect(branch.log).to.equal("foobar\n");
        });

        it("logs a string to a branch, where other logs exist and where there is no step", function() {
            var branch = new Branch();
            var runner = new Runner();
            var runInstance = new RunInstance(runner);

            branch.log = "foo\n";
            runInstance.appendToLog("bar", null, branch);

            expect(branch.log).to.equal("foo\nbar\n");
        });

        it("fails silently when there is no step or branch", function() {
            var step = new Step();
            var runner = new Runner();
            var runInstance = new RunInstance(runner);

            assert.doesNotThrow(() => {
                runInstance.appendToLog("foobar", null, null);
            });
        });
    });

    describe("stop()", function() {
        it.skip("stops the RunInstance, time elapsed for the Branch is properly measured, and no more steps are running", function() {
            // check Step.isRunning of all steps
        });

        it.skip("doesn't log or error to branches or steps once a stop is made", function() {

        });
    });

    describe("runOneStep()", async function() {
        it.skip("runs one step and pauses again", async function() {
        });

        it.skip("works when currStep is on the last step, which has not completed yet", async function() {
        });

        it.skip("works when currStep is on the last step, which has completed already", async function() {
        });
    });

    describe("skipOneStep()", async function() {
        it.skip("skips one step and pauses again", async function() {
        });

        it.skip("works when currStep is on the last step, which has not completed yet", async function() {
        });

        it.skip("works when currStep is on the last step, which has completed already", async function() {
        });
    });

    describe("injectStep()", async function() {
        it.skip("runs a step, then pauses again", async function() {
        });

        it.skip("step has access to {{vars}} and {vars} that were defined at the time of the pause", async function() {
        });

        it.skip("attaches an error to the step passed in if it fails", async function() {
            // and doesn't attach the error to this.currStep or this.currBranch
        });

        it.skip("the RunInstance can flawlessly resume from a pause, after an injected step has run", async function() {
            // make sure the right next step is executed
        });
    });
});
