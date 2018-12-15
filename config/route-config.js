const projectName='tcreadme'

const indexRouter = require('../routes/index');
const userRouter = require('../routes/user');
const uploadRouter = require('../routes/upload');
const resourceRouter = require('../routes/resource');
const roleRouter = require('../routes/role');
const roleResourceRelationRouter = require('../routes/role_resource_relation');
const userRoleRelationRouter = require('../routes/user_role_relation');




exports.useRouter = function (app) {//用来与express结合
    app.use(`/${projectName}`, indexRouter);
    app.use(`/${projectName}/user`, userRouter);
    app.use(`/${projectName}/upload`, uploadRouter);
    app.use(`/${projectName}/resource`, resourceRouter);
    app.use(`/${projectName}/role`, roleRouter);
    app.use(`/${projectName}/roleResourceRelation`, roleResourceRelationRouter);
    app.use(`/${projectName}/userRoleRelation`, userRoleRelationRouter);
}