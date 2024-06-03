export const globalMessages = {
  fr: {
    success: {
      login: 'Connexion réussie',
      logout: 'Déconnexion réussie',
      register: 'Inscription réussie'
    },
    error: {
      missingPhoto: 'Il manque une photo dans la requete',

      unableToVerifyToken: 'Impossible de valider le jeton. Veuillez vous connecter de nouveau.',
      wrongCredentials:
        'Identifiants incorrects. Veuillez vérifier votre login et votre mot de passe.',
      accountLocked:
        "Compte verrouillé. Veuillez contacter l'administrateur pour obtenir de l'aide.",
      registrationFailed: "Échec de l'inscription. Veuillez réessayer plus tard.",
      passwordTooShort: 'Mot de passe trop court. Veuillez utiliser au moins 8 caractères.',
      loginAlreadyUsed: 'Ce login est déjà utilisé. Veuillez en choisir un autre.',
      userNotFound: "L'utilisateur n'existe pas.",
      modificationFailed: 'Modification échouée. Veuillez réessayer plus tard.',
      emptyValues: 'Veuillez renseigner tous les champs.',
      missingLanguage: 'Veuillez fournir une langue',
      unauthorized: '! L\'action n\'est pas autoriser  !',
      missingQuery: "La requête est manquante",
      noPostsFound: "Aucun post n'a été trouvé",
      missingId : "Id est manquant dans la requête",
    }
  },

  en: {
    success: {
      login: 'Logged in successfully',
      logout: 'Logged out successfully',
      register: 'Registration successful'
    },
    error: {
      missingPhoto: 'Photo is missing from the request',
      unableToVerifyToken: 'Unable to verify token. Please login again.',
      wrongCredentials: 'Incorrect credentials. Please check your username and password.',
      accountLocked: 'Account locked. Please contact the administrator for assistance.',
      registrationFailed: 'Registration failed. Please try again later.',
      passwordTooShort: 'Password too short. Please use at least 8 characters.',
      loginAlreadyUsed: 'This login is already used. Please choose another one.',
      userNotFound: 'User does not exist.',
      modificationFailed: 'Modification failed. Please try again later.',
      emptyValues: 'Please fill in all fields.',
      missingLanguage: 'Please provide a language',
      unauthorized: '! Unauthorized user',
      missingQuery: "Query is missing from the request",
      noPostsFound: "No posts found",
      missingId : "Id is missing from the request",
    }
  }
};
