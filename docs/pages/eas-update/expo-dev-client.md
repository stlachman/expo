---
title: Using expo-dev-client with EAS Update
---

> ⚠️ This guide is likely to change as we continue to work on EAS Update.

The [`expo-dev-client`](/development/introduction) library allows us to launch different versions of our project. One of the most popular use-cases is to preview a published update inside a development build, using the `expo-dev-client` library.

The `expo-dev-client` library supports loading published EAS Updates through channels. Below, learn how to load a specific channel to preview an update in a development build.

## How to load a published EAS Update inside a development build

1. Create a [development build](/development/getting-started) of the project.
2. Next, make non-native changes locally, then publish them using `eas update --branch ...`. The branch specified should correspond to a channel. You can see how channels are linked to branches with `eas channel:list`.
3. After publishing an update, it's time to load the update in the development build. All development builds that have the `expo-updates` package installed include an Extensions tab where you can select an update:

<img src="/static/images/dev-client/extensions-panel.png" style={{ display:"block", maxWidth: 300, margin: "12px auto" }} />

Alternatively, you can construct a specific URL to open your EAS Update. The URL will look like this:

```bash
exp+[project-slug]://expo-development-client/?url=[https://u.expo.dev/project-id]?channel-name=[channel]

# Example
exp+form-duo://expo-development-client/?url=https://u.expo.dev/675cb1f0-fa3c-11e8-ac99-6374d9643cb2?channel-name=preview
```

Let's break down the parts of this URL:

- `exp+`: The beginning of the URL.
- `form-duo`: This is the project slug found in **app.json**/**app.config.js**.
- `://expo-development-client/`: necessary for the deep link to work with the `expo-dev-client` library.
- `?url=`: Defines a `url` query parameter.
- `https://u.expo.dev/675cb1f0-fa3c-11e8-ac99-6374d9643cb2`: This is the updates URL, which is inside the project's app config (**app.json**/**app.config.js**) under `updates.url`.
- `?channel-name=`: Defines a channel query parameter.
- `preview`: The name of the channel to request.

4. Once we've constructed the URL, we can either copy/paste it directly into the `expo-dev-client`'s launcher screen. Alternatively, we could create a QR code of the URL, then scan it. Scanning this URL should open up the development build to the specified channel.

If you'd like to see a working example, check out this [demo repo](https://github.com/jonsamp/test-expo-dev-client-eas-update).
