# wti

> A WebTranslateIt command-line tool in Node.js.

[![npm](https://img.shields.io/npm/v/wti?style=flat-square)](https://www.npmjs.com/package/wti)
[![build status](https://github.com/Pegase745/wti/workflows/Node.js%20CI/badge.svg?branch=master)](https://github.com/Pegase745/wti/actions)
[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg?style=flat-square)](http://commitizen.github.io/cz-cli/)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg?style=flat-square)](https://github.com/semantic-release/semantic-release)

![screenshot](screenshot.png 'How to use wti')

# Usage

**Installation**

```sh
$ yarn global add @treatwell/wti
```

**Configuration**

Basically, `wti` is to be run on a project root directory, and looks for a `wti-config.json` file containing your project's informations.

The command `wti init` lets you create this file.

```sh
$ wti init
What is your project's api key?: <your private key>
Initializing...... [SUCCESS] Project is initialized
```

You can find the API token in your project settings.

**Usage**

Execute `wti help` to see the usage:

```sh
USAGE
  $ wti [COMMAND]

COMMANDS
  add        create and push a new master language file
  addLocale  add a new locale to the project
  help       display help for wti
  init       configure the project to sync with
  pull       pull target language file(s)
  push       push master language file
  rm         delete a master language file from a project

See `wti help <command>` for more information on a specific command.
```

# Sample commands

| Command                            | Action                                |
| ---------------------------------- | ------------------------------------- |
| wti add <path/to/master/file.json> | Upload a new **master** language file |
| wti rm <path/to/master/file.json>  | Delete a **master** language file     |
| wti push                           | Update a **master** language file     |
| wti pull                           | Download target language files        |
| wti addLocale fr                   | Add a new locale to the project       |
| wti rmLocale fr                    | Remove a locale from the project      |
| wti status                         | View project statistics               |

# i18next example

**1. Prerequisite**

- Create a project on WebTranslateIt with a source language (such as english)
- Bootstrap a React app

**2. Install and configure i18next**

```sh
$ yarn add i18next react-i18next
$ yarn add -D i18next-parser

// Extract locales
$ i18next --config i18next-parser.config.js
```

**3. Install and configure WTI client**

```sh
$ yarn add -D wti
$ wti init
$ wti add locale fr
$ ... add other languages
$ wti add locales/en/translation.json
$ wti push
```

**4. Translate keys on WebTranslateIt, and then pull translations**

```sh
$ wti pull
```

**5. Add or remove translation keys**

```sh
$ i18next --config i18next-parser.config.js
$ wti push
```
