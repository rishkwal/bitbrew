# Contributing

We welcome contributions to this project. Here is a step by step guide to help you get started.

## Installation

Before you start make sure you have `node` and `npm` installed on your machine. Alos make sure you have docker installed and running.

Remove any existing installations of the package:

```bash
npm remove -g bitbrew
```

1. Clone the repository and navigate to the project directory

```bash
git clone git@github.com:rishkwal/bitbrew.git
cd bitbrew
```

2. Install dependencies

```bash
npm install --legacy-peer-deps
```

3. Link the package

```bash
npm link
```

Now you can run the `bitbrew` command from anywhere in your terminal.

## Reporting Bugs

If you find a bug in the project, please open an issue on the [issues page](https://github.com/rishkwal/bitbrew/issues).
