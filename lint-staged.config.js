module.exports = {
  '*.{js?(x),ts?(x)}': (filenames) => {
    const spaceSeparatedFilenames = filenames.join(' ');
    return [
      `import-sort --write ${spaceSeparatedFilenames}`,
      `eslint --quiet --fix ${spaceSeparatedFilenames}`,
    ];
  },
  '!(*package-lock).json': ['prettier --write'],
  'package.json': ['sort-package-json'],
};
