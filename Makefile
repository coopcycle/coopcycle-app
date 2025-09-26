.PHONY: setup start start-fresh android ios test test-only e2e-build-android e2e-build-ios e2e-android e2e-android-only e2e-ios e2e-ios-only lint adb emulator

ENV_FILE ?= .env

# import and export env variables
ifneq (,$(wildcard ${ENV_FILE}))
	include ${ENV_FILE}
    export
endif

setup:
	@clear && yarn install

start:
	@clear && yarn start --reset-cache --client-logs

start-fresh:
	@cd android && ./gradlew clean && ./gradlew --stop
	@rm -rf node_modules/ ~/.gradle/caches/
	@yarn cache clean
	@$(MAKE) setup start

android:
	@clear && yarn android
	@$(MAKE) adb

ios:
	@clear && yarn ios

test:
	@clear && APP_ENV=test yarn test
# You need to add 'testonly' to the test title/description, like:
#    it('testonly: should do something', () => { ... })
test-only:
	@clear && APP_ENV=test yarn test -t testonly --silent=false

e2e-build-android:
	@APP_ENV=test detox build -c android.emu.debug
e2e-build-ios:
	@APP_ENV=test detox build -c ios.sim.debug

e2e-android: ANDROID_SDK_ROOT?=~/Android/Sdk
e2e-android:
	@clear && ANDROID_SDK_ROOT=${ANDROID_SDK_ROOT} APP_ENV=test detox test -c android.emu.debug --retries 0
# You can set the `TESTFILE` env var when running the target, like:
#    make e2e-android-only TESTFILE=foodtech/checkout/customer__role_user__logged_in/success__payment__cash_on_delivery.spec.js
# Or just change here the `TESTFILE` env var to run the desired test
e2e-android-only: TESTFILE?=02_courier.spec.js
e2e-android-only: ANDROID_SDK_ROOT?=~/Android/Sdk
e2e-android-only:
	@clear && ANDROID_SDK_ROOT=${ANDROID_SDK_ROOT} APP_ENV=test detox test ./e2e/${TESTFILE} -c android.emu.debug --retries 0

e2e-ios:
	@clear && APP_ENV=test detox test -c ios.sim.debug --retries 0
# You can set the `TESTFILE` env var when running the target, like:
#    make e2e-ios-only TESTFILE=foodtech/checkout/customer__role_user__logged_in/success__payment__cash_on_delivery.spec.js
# Or just change here the `TESTFILE` env var to run the desired test
e2e-ios-only: TESTFILE?=02_courier.spec.js
e2e-ios-only:
	@clear && APP_ENV=test detox test ./e2e/${TESTFILE} -c ios.sim.debug --retries 0

lint:
	@clear && yarn lint

adb:
	@adb reverse tcp:9090 tcp:9090

emulator: ANDROID_SDK_ROOT?=~/Android/Sdk
emulator:
	@clear && ${ANDROID_SDK_ROOT}/emulator/emulator -avd Pixel_6_API_28
