## Overview

Now, we will take a look at how to get all the files you need bundled up and ready for deployment.

We are going to quickly explain how to do that using the CLI only. If you decided to go down the Manual path you should already know what you need, where everything is located and how to deploy it using your custom setup.

## CLI

There isn't that much to deploying because it all comes down to a simple:

```javascript
gluec build
```

This command will gather the Glue42 Core assets as defined in the `glue.config.dev.json` or from the default locations and produce a `/glue` directory at the root level of the current working directory. All that is left for you is to build your app or apps using the tools you use and deploy them to you production server.

Just a quick reminder of what the Glue42 Client defaults are:
- `/glue/worker.js` for the shared worker
- `/glue/gateway.js` for the gateway
- `/glue/glue.config.json` for the configuration

In case you need to overwrite these defaults, head over to the [**Glue42 Client**](../../core-concepts/glue42-client/overview/index.html) for detailed explanation and examples.