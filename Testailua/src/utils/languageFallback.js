const supportedLanguages = ['fi', 'sv', 'en'];

const getLanguage = (req) => {
  const lang = req.query.lang || req.headers['accept-language'] || 'fi';
  return supportedLanguages.includes(lang) ? lang : 'fi';
};

const getLanguageFallback = (lang) => {
  if (supportedLanguages.includes(lang)) {
    return lang;
  }
  return 'fi';
};

module.exports = { getLanguage, getLanguageFallback, supportedLanguages };
