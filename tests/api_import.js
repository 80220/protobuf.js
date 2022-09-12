const glob = require("glob");
const path = require('path');
const tape = require("tape");

const findAllProtoFiles = (rootDir) => {
    let files = glob.sync(path.resolve(__dirname, rootDir) + '/**/*');
    return files.filter((f) => f.endsWith('.proto'));
}

const util = require('util');
function look(_id, obj) { console.log(util.inspect({ ['BT->' + _id]: obj }, { colors: true, depth: 3 })); }

const protobuf = require("..");

tape.test.only("Imported message type resolution", function (test) {
    const files = findAllProtoFiles('data/duplicated_defs');
    const root = new protobuf.Root();
    files.forEach((file) => {
        root.loadSync(file, {
            alternateCommentMode: true,
            keepCase: true,
        });
    });

    const Message = root.lookup("CreateRouteRequest");
    MyMethod = Message.get("static_route").resolve(),
        look('MyMethod', MyMethod.type);
    test.same(MyMethod.type, 'a.b.c.d.StaticRoute', "should set fully qualified name of imported field type");
    const found = root.lookup(MyMethod.type);
    look('found', found.fullName);
    test.same(found.fullName, '.a.b.c.d.StaticRoute', "should find correct field type");
    test.end();
});
