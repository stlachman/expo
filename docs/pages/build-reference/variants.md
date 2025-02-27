---
title: Installing app variants on the same device
---

import ImageSpotlight from '~/components/plugins/ImageSpotlight';

When creating [development, preview, and production builds](../eas-json.md#common-use-cases), it's common to want to install one of each build on your device at the same time. This allows you to do development work, preview the next version of your app, and run the production version all on the same device, without needing to uninstall and reinstall the app.

In order to be able to have multiple instances of an app installed on your device, each instance must have a unique Application ID (Android) or Bundle Identifier (iOS).

**If you have a bare project**, you can accomplish this using flavors (Android) and targets (iOS). To configure which flavor is used, use the `gradleCommand` field on your build profile; to configure which target is used, use the `scheme` field for iOS.

**If you have a managed project**, this can be accomplished by using **app.config.js** and environment variables in **eas.json**.

## Example: configuring development and production variants in a managed project

Let's say we wanted a development build and production build of our managed Expo project. Your **eas.json** might look like this:

```json
{
  "build": {
    "development": {
      "developmentClient": true
    },
    "production": {}
  }
}
```

And your **app.json** might look like this:

```json
{
  "expo": {
    "name": "MyApp",
    "slug": "my-app",
    "ios": {
      "bundleIdentifier": "com.myapp"
    },
    "android": {
      "package": "com.myapp"
    }
  }
}
```

Let's convert this to **app.config.js** so we can make it more dynamic:

```javascript
export default {
  name: 'MyApp',
  slug: 'my-app',
  ios: {
    bundleIdentifier: 'com.myapp',
  },
  android: {
    package: 'com.myapp',
  },
};
```

Now let's switch out the iOS `bundleIdentifier` and Android `package` (which becomes the Application ID) based on the presence of an environment variable in **app.config.js**:

```js
const IS_DEV = process.env.APP_VARIANT === 'development';

export default {
  // You can also switch out the app icon and other properties to further
  // differentiate the app on your device.
  name: IS_DEV ? 'MyApp (Dev)' : 'MyApp',
  slug: 'my-app',
  ios: {
    bundleIdentifier: IS_DEV ? 'com.myapp.dev' : 'com.myapp',
  },
  android: {
    package: IS_DEV ? 'com.myapp.dev' : 'com.myapp',
  },
};
```

> **Note**: if you are using any libraries that require you to register your application identifier with an external service to use the SDK, such as Google Maps, you will need to have a separate configuration for that API for the iOS Bundle Identifier and Android Package. You can also swap this configuration in using the same approach as above.

To automatically set the `APP_VARIANT` environment variable when running builds with the "development" profile, we can use `env` in **eas.json**:

```json
{
  "build": {
    "development": {
      "developmentClient": true,
      "env": {
        "APP_VARIANT": "development"
      }
    },
    "production": {}
  }
}
```

Now when you run `eas build --profile development`, the environment variable `APP_VARIANT` will be set to `"development"` when evaluating **app.config.js** both locally and on the EAS Build worker. When you start your development server, you will need to run `APP_VARIANT=development expo start` (or the platform equivalent if you use Windows); a shortcut for this could be to add a script to your **package.json** such as `"dev": "APP_VARIANT=development expo start"`.

When you run `eas build --profile production` the `APP_VARIANT` variable environment will not be set, and the build will run as the production variant.

> **Note**: if you use EAS Update to publish JavaScript updates of your app, you should be cautious to set the correct environment variables for the app variant that you are publishing for when you run the `eas update` command. Refer to the EAS Build ["Environment variables and secrets" guide](/build/updates.md) for more information.

## Example: configuring development and production variants in a bare project

### Android

In **android/app/build.gradle**, create a separate flavor for every build profile from **eas.json** that you want to build.

```groovy
android {
    ...
    flavorDimensions "env"
    productFlavors {
        production {
            dimension "env"
            applicationId 'com.myapp'
        }
        development {
            dimension "env"
            applicationId 'com.myapp.dev'
        }
    }
    ...
}
```

> **Note**: Currently, EAS CLI supports only the `applicationId` field. If you use `applicationIdSuffix` inside `productFlavors` or `buildTypes` sections then this value will not be detected correctly.

Assign Android flavors to EAS build profiles by specifying a `gradleCommand` in the **eas.json**:

```json
{
  "build": {
    "development": {
      "android": {
        "gradleCommand": ":app:assembleDevelopmentDebug"
      }
    },
    "production": {
      "android": {
        "gradleCommand": ":app:bundleProductionRelease"
      }
    }
  }
}
```

By default, every flavor can be built in either debug or release mode. If you want to restrict some flavor to a specific mode, see the snippet below, and modify **build.gradle**.

```groovy
android {
    ...
    variantFilter { variant ->
        def validVariants = [
                ["production", "release"],
                ["development", "debug"],
        ]
        def buildTypeName = variant.buildType*.name
        def flavorName = variant.flavors*.name

        def isValid = validVariants.any { flavorName.contains(it[0]) && buildTypeName.contains(it[1]) }
        if (!isValid) {
            setIgnore(true)
        }
    }
    ...
}
```

The rest of the configuration at this point is not specific to EAS, it's the same as it would be for any Android project with flavors. There are a few common configurations that you might want to apply to your project:

- To change the name of the app built with the development profile, create a **android/app/src/development/res/value/strings.xml** file.
  ```xml
  <resources>
      <string name="app_name">MyApp - Dev</string>
  </resources>
  ```
- To change the icon of the app built with the development profile, create `android/app/src/development/res/mipmap-*` directories with appropriate assets (you can copy them from **android/app/src/main/res** and replace the icon files).
- To specify **google-services.json** for a specific flavor put it in a **android/app/src/&lbrace;flavor&rbrace;/google-services.json** file.
- To configure sentry, add `project.ext.sentryCli = [ flavorAware: true ]` to **android/app/build.gradle** and name your properties file `android/sentry-{flavor}-{buildType}.properties` (e.g. **android/sentry-production-release.properties**)

### iOS

Assign a distinct scheme to every build profile in **eas.json**:

```json
{
  "build": {
    "development": {
      "ios": {
        "buildConfiguration": "Debug",
        "scheme": "myapp-dev"
      }
    },
    "production": {
      "ios": {
        "buildConfiguration": "Release",
        "scheme": "myapp"
      }
    }
  }
}
```

`Podfile` should have a target defined like this:

```ruby
target 'myapp' do
    ...
end
```

Replace it with an abstract target, where common configuration can be copied from the old target.

```ruby
abstract_target 'common' do
  # put common target configuration here

  target 'myapp' do
  end

  target 'myapp-dev' do
  end
end
```

Open project in Xcode, click on the project name in the navigation panel, right click on the existing target, and click "Duplicate":

<ImageSpotlight alt="Duplicate Xcode target" src="/static/images/eas-build/variants/1-ios-duplicate-target.png" style={{maxWidth: 720}} />

Rename the target to something more meaningful, e.g. `myapp copy` -> `myapp-dev`.

Configure a scheme for the new target:

- Go to `Product` -> `Scheme` -> `Manage schemes`.
- Find scheme `myapp copy` on the list.
- Change scheme name `myapp copy` -> `myapp-dev`.
- By default, the new scheme should be marked as shared, but Xcode does not create `.xcscheme` files. To fix that, uncheck the "Shared" checkbox and check it again, after that new `.xcscheme` file should show up in the **ios/myapp.xcodeproj/xcshareddata/xcschemes** directory.

<ImageSpotlight alt="Xcode scheme list" src="/static/images/eas-build/variants/2-scheme-list.png" style={{maxWidth: 720}} />

By default, the newly created target has separate **Info.plist** file (in our case it's **ios/myapp copy-Info.plist**). To simplify your project we recommend using the same file for all targets:

- Delete **./ios/myapp copy-Info.plist**.
- Click on the new target.
- Go to `Build Settings` tab.
- Find `Packaging` section.
- Change **Info.plist** value - **myapp copy-Info.plist** -> **myapp/Info.plist**.
- Change `Product Bundle Identifier`.

<ImageSpotlight alt="Xcode build settings" src="/static/images/eas-build/variants/3-target-build-settings.png" style={{maxWidth: 720}} />

To change the display name:

- Open **Info.plist** and add key `Bundle display name` with value `$(DISPLAY_NAME)`.
- Open `Build Settings` for both targets and find `User-Defined` section.
- Add key `DISPLAY_NAME` with the name you want to use for that target.

To change the app icon:

- Create a new image set (you can create it from the existing image set for the current icon, it's usually named `AppIcon`)
- Open `Build Settings` for the target that you want to change icon.
- Find `Asset Catalog Compiler - Options` section.
- Change `Primary App Icon Set Name` to the name of the new image set.
