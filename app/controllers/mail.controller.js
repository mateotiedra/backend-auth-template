const config = require('../config/email.config');

const from = `${
  config.WEBSITE_NAME
} <no-reply@${config.WEBSITE_NAME.toLocaleLowerCase()}.ch>`;

const sendConfirmation = (params) => {
  const emailData = {
    from: from,
    to: params.email,
    subject: 'Lien de confirmation',
    html: `<h1>Vérification de l'adresse email</h1>
            <h2>Bonjour${params.name ? ' ' + params.name : ''},</h2>
            <p>Afin de finaliser la création de votre compte, merci de confirmer votre adresse email en cliquant sur le lien suivant : <a href=${
              config.CONFIRMATION_ROUTE
            }/${params.emailToken}>créer mon compte</a>
            <br/>Si ne n'est pas vous qui a créé de compte sur ${
              config.WEBSITE_NAME
            }, merci d'ignorer cet email.
            <br/>Contact : <a href="mailto:${config.CONTACT_EMAIL}">${
      config.CONTACT_EMAIL
    }</a></p>`,
  };

  // This line must be deleted when the real email sender is implemented
  console.log('\nEmail token : ' + params.emailToken + '\n');

  params.success();
};

const sendResetPassword = (params) => {
  const emailData = {
    from: from,
    to: params.email,
    subject: 'Mot de passe oublié',
    html: `<h1>Nouveau mot de passe</h1>
            <h2>Bonjour${params.name ? ' ' + params.name : ''},</h2>
            <p>Vous pouvez vous connecter afin de changer votre mot de passe en cliquant sur le lien suivant : <a href=${
              config.RESET_PASSWORD_ROUTE
            }/${params.emailToken}>change mon mot de passe</a>
            <br/>Si ne n'est pas vous qui avez demandé à réinitialiser votre mot de passe, merci d'ignorer cet email.
            <br/>Contact : <a href="mailto:${config.CONTACT_EMAIL}">${
      config.CONTACT_EMAIL
    }</a></p>`,
  };

  // This line must be deleted when the real email sender is implemented
  console.log('\nEmail token : ' + params.emailToken + '\n');

  params.success();
};

module.exports = { sendConfirmation, sendResetPassword };
