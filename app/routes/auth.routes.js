const verifySignUp = require('../middlewares/verifySignUp');
const { verifyToken } = require('../middlewares/authJwt');
const controller = require('../controllers/auth.controller');

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      'Access-Control-Allow-Headers',
      'x-access-token, Origin, Content-Type, Accept'
    );
    next();
  });

  // Rerister a new user
  app.post(
    '/auth/signup',
    [verifySignUp.uniqueAttribute('email')],
    controller.signUp
  );

  // Confirm the signUp with a confirmation token
  app.post(
    '/auth/signup/confirm',
    [verifySignUp.validConfirmationToken],
    controller.confirmSignUp
  );

  // Sign in the user
  app.post('/auth/signin', controller.signIn);

  // Get the user's basics infos
  app.get('/u', [verifyToken], controller.getUserBoard);
};
