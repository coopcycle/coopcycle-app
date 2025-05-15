.PHONY: setup start android ios reset test test-only e2e-build e2e-android e2e-android-only e2e-ios e2e-ios-only adb emulator

ENV_FILE ?= .env

# import and export env variables
ifneq (,$(wildcard ${ENV_FILE}))
	include ${ENV_FILE}
    export
endif

setup:
	@clear && yarn install

start:
	@clear && yarn start --reset-cache

android:
	@clear && yarn android
	@$(MAKE) adb

ios:
	@clear && yarn ios

reset:
	@rm -rf node_modules/
	@$(MAKE) setup start

test:
	@clear && yarn test
# You need to add 'testonly' to the test title/description, like:
#    it('testonly: should do something', () => { ... })
test-only:
	@clear && yarn test -t testonly --silent=false

e2e-build:
	@detox build -c android.emu.debug
	@detox build -c ios.sim.debug

e2e-android: ANDROID_SDK_ROOT?=~/Android/Sdk
e2e-android:
	@clear && ANDROID_SDK_ROOT=${ANDROID_SDK_ROOT} detox test -c android.emu.debug --retries 0
# You can set the `TESTFILE` env var when running the target, like:
#    make e2e-android-only TESTFILE=foodtech/checkout/customer__role_user__logged_in/success__payment__cash_on_delivery.spec.js
# Or just change here the `TESTFILE` env var to run the desired test
e2e-android-only: TESTFILE?=02_courier.spec.js
e2e-android-only: ANDROID_SDK_ROOT?=~/Android/Sdk
e2e-android-only:
	@clear && ANDROID_SDK_ROOT=${ANDROID_SDK_ROOT} detox test ./e2e/${TESTFILE} -c android.emu.debug --retries 0

e2e-ios:
	@clear && detox test -c ios.sim.debug --retries 0
# You can set the `TESTFILE` env var when running the target, like:
#    make e2e-ios-only TESTFILE=foodtech/checkout/customer__role_user__logged_in/success__payment__cash_on_delivery.spec.js
# Or just change here the `TESTFILE` env var to run the desired test
e2e-ios-only: TESTFILE?=02_courier.spec.js
e2e-ios-only:
	@clear && detox test ./e2e/${TESTFILE} -c ios.sim.debug --retries 0

adb:
	@adb reverse tcp:9090 tcp:9090

emulator: ANDROID_SDK_ROOT?=~/Android/Sdk
emulator:
	@clear && ${ANDROID_SDK_ROOT}/emulator/emulator -avd Pixel_6_API_28
