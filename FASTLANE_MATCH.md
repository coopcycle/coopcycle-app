Using Fastlane Match to generate provisioning profiles
------------------------------------------------------

We use [Fastlane Match](https://docs.fastlane.tools/actions/match/) to generate provisioning profiles.

To renew provisioning profiles, do the following:

```sh
cd ios/
bundle exec fastlane match nuke
bundle exec fastlane match appstore
```

You can add the `-a` option to generate provisioning profiles for other bundle identifiers.

```sh
bundle exec fastlane match appstore -a org.coopcycle.Naofood
bundle exec fastlane match appstore -a org.coopcycle.Sicklo
```
