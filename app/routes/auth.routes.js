const {
  validEmailToken,
  verifyAccessToken,
  verifyStatus,
} = require('../middlewares/user.middleware');
const { verifyRequestBody } = require('../middlewares/request.middleware');
const controller = require('../controllers/auth.controller');
const { findUserByAttribute } = require('../middlewares/findes.middleware');

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      'Access-Control-Allow-Headers',
      'x-access-token, Origin, Content-Type, Accept'
    );
    next();
  });

  // Register a new user
  app.post(
    '/auth/signup',
    [verifyRequestBody(['password', 'email'])],
    controller.signUp
  );

  // Resend confirmation email
  app.put(
    '/auth/signup/resend',
    [
      verifyRequestBody(['email']),
      findUserByAttribute('email'),
      verifyStatus(['pending']),
    ],
    controller.resendConfirmation
  );

  // Confirm the email
  app.put(
    '/auth/signup/confirm',
    [
      verifyRequestBody(['emailToken']),
      validEmailToken,
      verifyStatus(['pending']),
    ],
    controller.confirmEmail
  );

  // Create a new token and send a reset password link
  app.put(
    '/auth/reset-password',
    [
      verifyRequestBody(['email']),
      findUserByAttribute('email'),
      verifyStatus(['active']),
    ],
    controller.resetPassword
  );

  // Get access to the token via email (to reset the password)
  app.put(
    '/auth/recover',
    [
      verifyRequestBody(['emailToken']),
      validEmailToken,
      verifyStatus(['active']),
    ],
    controller.recover
  );

  // Sign in the user
  app.post(
    '/auth/signin',
    [verifyRequestBody(['password', 'email'])],
    controller.signIn
  );

  // Get the user's basics infos
  app.get('/u', [verifyAccessToken], controller.getUserBoard);
};
