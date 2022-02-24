const {
  uniqueAttribute,
  validEmailToken,
} = require('../middlewares/verifySignUp.middleware');
const {
  verifyAccessToken,
  verifyStatus,
  findUser,
} = require('../middlewares/user.middleware');
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

  // Resend confirmation email
  app.put(
    '/auth/signup/resend',
    [findUser('email'), verifyStatus(['pending'])],
    controller.resendConfirmation
  );

  // Confirm the email
  app.put(
    '/auth/signup/confirm',
    [validEmailToken, verifyStatus(['pending'])],
    controller.confirmEmail
  );

  // Create a new token and send a reset password link
  app.put(
    '/auth/reset-password',
    [findUser('email'), verifyStatus(['active'])],
    controller.resetPassword
  );

  // Get access to the token via email (to reset the password)
  app.put(
    '/auth/recover',
    [validEmailToken, verifyStatus(['active'])],
    controller.recover
  );

  // Sign in the user
  app.post('/auth/signin', controller.signIn);

  // Get the user's basics infos
  app.get('/u', [verifyAccessToken], controller.getUserBoard);
};
