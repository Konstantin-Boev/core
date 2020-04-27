// tslint:disable:no-unused-expression
import { getMethodName } from "./helpers";
import { createGlue, doneAllGlues } from "../initializer";
import { Glue42Core } from "../../glue";
import { expect } from "chai";

describe("methods", () => {

    let glue: Glue42Core.GlueCore;

    beforeEach(async function () {
        this.timeout(5000);
        [glue] = await Promise.all([
            createGlue()
        ]);
    });

    afterEach(async () => {
        await doneAllGlues();
    });

    it("getMethods() should return the same count of method like .methodsForInstance.", async () => {
        await glue.agm.register(getMethodName(), () => {
            // DO NOTHING
        });

        await glue.agm.register(getMethodName(), () => {
            // DO NOTHING
        });

        await glue.agm.createStream(getMethodName());

        const getMethodResult = glue.agm.instance.getMethods!();
        const methodResult = glue.agm.methodsForInstance(glue.agm.instance);

        expect(getMethodResult.length).to.equal(methodResult.length);
    });

    it("method should contain all the object types of the method", (done) => {
        const name = getMethodName();
        glue.agm.register({
            name,
            objectTypes: ["woah", "rainbow", "random"]
        }, () => {
            // DO NOTHING
        }).then(() => {
            const meth = glue.agm.methods().find((m) => m.name === name);
            try {
                expect(meth?.objectTypes).to.eql(["woah", "rainbow", "random"]);
                done();
            } catch (err) {
                done(err);
            }
        });
    });

    it("method should have the correct name", (done) => {
        const name = getMethodName();
        glue.agm.register({
            name
        }, () => {
            // DO NOTHING
        }).then(() => {
            const meth = glue.agm.methods().find((m) => m.name === name);
            try {
                expect(meth?.name).to.eql(name);
                done();
            } catch (err) {
                done(err);
            }
        });
    });

    it("method should have the correct displayName", (done) => {
        const name = getMethodName();
        glue.agm.register({
            name,
            displayName: "Fancy display name"
        }, () => {
            // DO NOTHING
        }).then(() => {
            const meth = glue.agm.methods().find((m) => m.name === name);
            try {
                expect(meth?.displayName).to.eql("Fancy display name");
                done();
            } catch (err) {
                done(err);
            }
        });
    });

    it("method should have the correct accepts", (done) => {
        const name = getMethodName();
        glue.agm.register({
            name,
            accepts: "String test"
        }, () => {
            // DO NOTHING
        }).then(() => {
            const meth = glue.agm.methods().find((m) => m.name === name);
            try {
                expect(meth?.accepts).to.eql("String test");
                done();
            } catch (err) {
                done(err);
            }
        });
    });
    it("method should have the correct description", (done) => {
        const name = getMethodName();
        glue.agm.register({
            name,
            description: "This is a description."
        }, () => {
            // DO NOTHING
        }).then(() => {
            const meth = glue.agm.methods().find((m) => m.name === name);
            try {
                expect(meth?.description).to.eql("This is a description.");
                done();
            } catch (err) {
                done(err);
            }
        });
    });

    it("getStreams should return streams only", (done) => {
        glue.agm.register(getMethodName(), () => {
            // DO NOTHING
        });
        glue.agm.createStream(getMethodName()).then((s) => {
            expect(glue.agm.instance.getStreams!().length).to.eql(1);
            done();
        }).catch(done);
    });

    it("invoking a method should call the handler with the correct caller Instance when invoked", (done) => {
        const name = getMethodName();
        const methodDefinition = {
            name,
        };

        glue.agm.register(methodDefinition, (args, instance) => {
            try {
                expect(instance).to.eql(glue.agm.instance);
                done();
            } catch (err) {
                done(err);
            }
        }).then(() => {
            glue.agm.invoke(methodDefinition);
        });
    });

    it("invoking should throw an error when the method/methodDefinition is undefined", (done) => {
        // FIX test return promise now
        const callbackNeverCalled = () => {
            // DO NOTHING
        };

        glue.agm.register(undefined as any, callbackNeverCalled).catch(() => {
            done();
        });
    });

    it("Should throw an error when the method/methodDefinition is undefined", (done) => {
        glue.agm.registerAsync(undefined as any, (args, caller, success) => {
            success({});
        }).catch(() => { done(); });
    });

    it("getServers returns only the servers that have registered the method", async () => {
        const glue2 = await createGlue();
        const methodName = getMethodName();
        await glue.interop.register(methodName, () => { /** DO NOTHING */ });
        await glue2.interop.register(methodName + "_2", () => { /** DO NOTHING */ });

        // local check
        const method = glue.interop.methods({ name: methodName })[0];
        const servers = method.getServers?.() || [];
        expect(servers.length, "local check").to.be.eq(1);

        // remote check
        const method2 = glue2.interop.methods({ name: methodName })[0];
        const servers2 = method2.getServers?.() || [];
        expect(servers2.length, "remote check").to.be.eq(1);

        return Promise.resolve();
    });

    it ("methods filter check", async () => {
        const glue2 = await createGlue();
        const name = getMethodName();
        const objectTypes = ["1", "2"];
        const accepts = "int a";
        const returns = "int b";
        const version = 1;
        const description = "description";
        const displayName = "displayName";
        const method = {
            name,
            objectTypes,
            accepts,
            returns,
            version,
            description,
            displayName,
        };
        await glue.interop.register(method, () => {/** DO NOTHING */ });

        const checkMethod = (filter: any, msg: string) => {
            // tslint:disable-next-line:no-console
            console.log(msg);
            const m1 = glue2.interop.methods(filter);
            expect(m1.length, `len - ${msg}`).to.be.eq(1);
            expect(m1[0].name, `name - ${msg}`).to.be.eq(name);
        };

        checkMethod(method, "full");
        checkMethod({ name }, "name");
        checkMethod({ displayName }, "displayName");
        checkMethod({ accepts }, "accepts");
        checkMethod({ returns }, "returns");
        checkMethod({ description }, "description");
        checkMethod({ displayName }, "displayName");
        checkMethod({ objectTypes }, "objectTypes");
        checkMethod({ name, version }, "name + version");
        checkMethod({ name, objectTypes }, "name + objectTypes");
    });

    it("methods filter should work with string", async () => {
        const glue2 = await createGlue();
        const method1Name = getMethodName();
        const method2Name = getMethodName();
        await glue.interop.register(method1Name, () => {/** DO NOTHING */ });
        await glue.interop.register({ name: method2Name }, () => {/** DO NOTHING */ });

        const m1 = glue2.interop.methods(method1Name);
        expect(m1.length).to.be.eq(1);
        expect(m1[0].name).to.be.eq(method1Name);

        const m2 = glue2.interop.methods(method2Name);
        expect(m2.length).to.be.eq(1);
        expect(m2[0].name).to.be.eq(method2Name);
    });
});
