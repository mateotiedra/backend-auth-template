const {
  uniqueAttribute,
  validConfirmationToken,
} = require('../middlewares/verifySignUp');
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

  // Register a new user
  app.post('/auth/signup', [uniqueAttribute('email')], controller.signUp);

  // Confirm the signUp with a confirmation token
  /*   app.patch(
    '/auth/signup/confirm',
    [validConfirmationToken],
    controller.signInViaConfirmationCode
  );
 */

  // Get access to the token via email (update the status is needed)
  app.post(
    ['/auth/recover-token', '/auth/signup/confirm'],
    [validConfirmationToken],
    controller.signInViaEmailToken
  );

  // Send a reset password link
  app.put('/auth/password-reset', controller.signIn);

  // Sign in the user
  app.post('/auth/signin', controller.signIn);

  // Get the user's basics infos
  app.get('/u', [verifyToken], controller.getUserBoard);
};
