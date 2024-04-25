# end to end tests with playwright and minikube

```
npx playwright install
```

The instructions below assume Headlamp is running locally in-cluster with minikube.

```bash
# Determine if the headlamp addon is enabled
minikube addons list

# If the addon is not already enabled run the following command
minikube addons enable headlamp

# Generate the URL needed for the HEADLAMP_TEST_URL environment variable
# note: Make sure to use the URL created after the " Starting tunnel for service headlamp. " message
minikube service headlamp -n headlamp

# Open the browser to the URL generated above, it should direct you to a page waiting for a token

# run in a separate terminal...
export HEADLAMP_TEST_URL= # from the "minikube service headlamp -n headlamp" command directly above.

# Create a token for the tests to use
export HEADLAMP_TOKEN=$(kubectl create token headlamp --duration 24h -n headlamp)

# To see the token to login via the web browser
echo $HEADLAMP_TOKEN
```

Now with those two environment variables set we can run the tests.

IMPORTANT: Make sure that the following npx commands are ran in the same terminal session as the environment variables were set.

## Run all tests

- from the terminal navigate to the e2e-tests directory within the headlamp repository
  `cd headlamp/e2e-tests`

- run the following command

```bash
npx playwright test
```

## Run a single test

You can run a single test with the grep flag:

- from the terminal navigate to the e2e-tests directory within the headlamp repository
  `cd headlamp/e2e-tests`

- run the following command

```shell
npx playwright test -g "404 page is present"
```

## If there is a failure, run it in a real browser?

```shell
npx playwright test -g "404 page is present" --headed
```

## Optional configuration

### Headed vs Headless

- If you wish to see the test run in a real browser, you can add the `--headed` flag to the command.

- You can also modify the playwright.config.js file to change the browser that is used for the tests. You must be sure not to add this change to the repository when you push.
  - within the playwright.config.js file locate the `const config: PlaywrightTestConfig` object. within the object, modify the use object to contain a field for headless set to false ex. `use: { ..., headless: false }` property to run the tests in a real browser.

### Slow down the tests

- You can modify the playwright.config.js file to slow down the tests. You must be sure not to add this change to the repository when you push.
  - within the playwright.config.js file locate the `const config: PlaywrightTestConfig` object. within the object, modify the use object to contain a field for `launchOptions: { slowMo: }` set to a number of milliseconds ex. `use: { ..., launchOptions: { slowMo: 1000 }` property to slow down the tests to take 1 second between each step.
