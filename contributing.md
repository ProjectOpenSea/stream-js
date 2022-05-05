# Contributing to OpenSea Stream API JS SDK

## Developing

We PR off of feature branches that get submitted to `main`. This is the branch that all pull
requests should be made against. Version releases are bumped using `npm version patch`. Make sure to include the `Developer-Experience` team on any PR you submit.

To develop locally:

1. [clone](https://help.github.com/articles/cloning-a-repository/) this repo to your local device.

   ```sh
   git clone https://github.com/ProjectOpenSea/stream-js
   ```

2. Create a new branch:
   ```
   git checkout -b MY_BRANCH_NAME
   ```
3. If you have Node Version Manager, run `nvm use` to ensure a compatible version is being used.

4. Install the dependencies with:
   ```
   npm install
   ```
5. Start developing and watch for code changes:
   ```
   npm run dev
   ```
6. Look into `package.json` to see what other run configurations (such as `test`, `check-types`, and `lint:check`) you can use.

## Building

You can build the project, including all type definitions, with:

```bash
npm run build
```

### Running tests

```sh
yarn test
```

### Linting

To check the formatting of your code:

```sh
npm run prettier
```

If you get errors, you can fix them with:

```sh
npm run prettier:fix
```

### Set as a local dependency in package.json

While developing and debugging changes to this SDK, you can 'test-run' them locally inside another package using `npm link`.

1. Inside this repo, run

   ```sh
   npm link
   ```

2. In your other package's root directory, make sure to remove `@opensea/stream-js` from `node_modules` with:

   ```sh
   rm -rf ./node_modules/@opensea/stream-js
   ```

3. In your other package's root directory, run:

   ```sh
   npm link @opensea/stream-js
   ```

   to re-install all of the dependencies.

   Note that this SDK will be copied from the locally compiled version as opposed to from being downloaded from the NPM registry.

4. Run your application as you normally would.

## Publishing

Repository admins can use `npm version patch` to create a new patch version.

- For minor version updates, use `npm version minor`.
- For major version updates, use `npm version major`.

When creating a new version, submit a PR listing all the chanages that you'd like to roll out with this change (since the last major version).
