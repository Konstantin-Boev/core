## Introduction

This tutorial is going to show your how to use Glue42 Core in an Angular application using the `@glue42/ng` package. If you haven't checked out the [Vanilla JS]("../vanilla-js/index.html") tutorial, we recommend going through that one first, as there you will get a better understanding of Glue42 Core without the added complexity level of a web framework. 

The goal now is to show how you can integrate and extend a couple of existing Angular applications into an awesome Glue42 Core project. We will cover all major aspects of Glue42 Core, including **interop**, **windows** and **contexts**.

The business scenario and requirements are identical to the the [Vanilla JS]("../vanilla-js/index.html") tutorial. We are part of the IT department of a big multi-national back and our task is to create an application which will be used by the bank's asset management team. This will be a multi-app project consisting of two applications:
- **clients** - displays a full list of clients and their details
- **stocks** - displays a full list of stocks with prices; whenever a stock is clicked the user should see that stock's details

Those two applications must be hosted on the same domain where
- /clients resolves to **clients**
- /stocks resolves to **stocks**

As an end result our users want to be able to run the two apps as Progressive Web Apps in separate windows, in order to take advantage of their multi-monitor setups. Also, our users want those apps, even though in separate windows, to be able to communicate with each other. For example, whenever a client is selected, the stocks app should show only that client's stocks and more, which you will learn along the way.

## Prerequisites

Before we get into the interesting part, there are few things you need to be comfortable with:
- Angular 2+ - this tutorial assumes that you have general Angular knowledge.
- JS array methods.
- Asynchronous programming with Promises.

It is also a good idea to keep our [**Glue42 Core CLI**](../../glue42-core/what-is-glue42-core/core-concepts/cli/index.html), [**Glue42 Client**](../../glue42-core/what-is-glue42-core/core-concepts/glue42-client/index.html) and [**Glue42 Web Reference API**](../../reference/core/latest/glue42%20web/index.html) sections close by for reference.


## Tutorial Structure

The tutorial code is located in our [**GitHub repo**](https://github.com/Glue42/core). Inside the repo you wil find a directory `/tutorials` with the following structure:

```cmd
/tutorials
  /guides
    /vanilla-js
    /react
    /angular
  /rest-server
  /vanilla-js
    /solution
    /start
  /react
    /solution
    /start
  /angular
    /solution
    /start
```

The `/guides` directory holds the `.md` files used to display this text information that you are reading right now.
The `/vanilla-js`, `/react` and `/angular` directories hold the **start** files for each respective tutorial. This is your starting point. There is also **solution** directories, in case you would like to see our approach to the problems ahead.
The `/rest-server` is a simple server which we use in the tutorials to serve us the `json` data that we need.

As you know Glue42 Core is an open-source project, so we welcome all feedback and contributions both to our code base and tutorials.


## 1. Setting Up

### 1.1. Getting Started with the Tutorial Files

First you need to get the tutorial code and get your self familiar with it. Clone our GitHub repo at `https://github.com/Glue42/core` and navigate to `/tutorials/rest-server`. This server is going to serve the data for our applications. All you need to do is:

```cmd
npm i

npm start
```

This will launch the server at port **8080** and that's it, we will not be touching it any more.

Now, go to `/tutorials/angular/start`. There are the start files for you project. You can either work directly there or you can copy-paste then somewhere else. To keep it simple, we will be working with the start files directly.

Let's have a brief overview of the files inside the start directory:
- `/clients` - this is the clients app. It is a standalone Angular application and was scaffolded with the Angular CLI without any custom settings.
- `/stock` - this is the stocks app. It is also a standalone Angular application, also scaffolded with the Angular CLI with one one custom setting: inside `angular.json` we have set `port: 4100`. The reason is that we can't run both our apps using the default `ng serve` command, because both listen to port **4200** by default.

Both start applications are configured as **installable** [**PWA**](https://developer.mozilla.org/nl/docs/Web/Progressive_web_apps). Therefore you can see in both a `manifest.json` and `service-worker.js` files inside the respective `src` directories.

Now, let's launch the apps and see what we have. To do that go to both `/clients` and `/stocks`, open a terminal and:

```cmd
npm i

npm start
```

This will execute `ng serve` as is the default from Angular CLI.

Open the browser at `localhost:4200` and check out the app. It is pretty straight forward - just a list of clients, fetched from the **rest server** we started before. Clicking on a client does nothing right now. But more importantly, if you look at the right side of the address bar, you will see an `install` icon, allowing you to install the app. Once installed you can launch it by going to `chrome://apps` (if you use Google Chrome) and clicking on the icon.

Repeat this process with `localhost:4100`. Again, this is straight forward, nothing special, just a list of stocks. Once again we have the `install` icon, go ahead and install the app, just like the you did for `clients`. The only difference here is that whenever you click on a stock, you are redirected to the stock details view of the app.

Great! So far we have gotten ourselves acquainted with the start files, we launched all the apps and installed them as PWAs. Next, we are now going to set up our Glue42 Core Environment using the CLI.


### 1.2. Getting Started with the Glue42 Core CLI

The first step in building our project is to set up our development environment for a Glue42 Core. As a prerequisite for Glue42 Core, our apps should be located at the same origin (protocol, host and port) in order for them to communicate with each other. This means that we should access the clients app from **/clients** and the stocks app from **/stocks**. Furthermore we need to set up the [**Glue42 Core Environment**](../../glue42-core/what-is-glue42-core/core-concepts/environment/index.html). All of this is very straight-forward with the [**Glue42 Core CLI**](../../glue42-core/what-is-glue42-core/core-concepts/cli/index.html).

First, we need to install the Glue42 Core CLI. You can do that globally:

```cmd
npm install --global @glue42/cli-core
```

Alternatively you can use `npx` to call CLI commands. It is up to you, but for consistency in this tutorial, we will assume that we have it globally.

Next, we go to `/start` and call the `init` command:

```cmd
gluec init
```

This command fetched all the necessary packages and scaffolded all the config files we need with the default settings. Next, we need to somehow serve our existing apps under the same origin. The built-in dev server in the Glue42 Core CLI allows us to not only serve our apps under the same origin, but also maintain the automatic bundle rebuild and page refresh when we make a change (standard for `ng serve`). To do all of that, we need to open `glue.config.dev.json` and register our apps. Your config file should look like this:

```json
{
    "glueAssets": ...,
    "server": {
        "settings": ...,
        "apps": [
            {
                "route": "/clients/",
                "localhost": {
                    "port": 4200
                }
            },
            {
                "route": "/stocks/",
                "localhost": {
                    "port": 4100
                }
            }
        ],
        "sharedAssets": []
    },
    "logging": "default"
}
```

We are effectively using the Glue42 Core CLI as a reverse proxy to the original Angular servers that we have running from `npm start` (`ng serve`).

Finally, we need to tell our Angular apps that they are no longer served from `root`, but from a specific route. By default all Angular apps resolve their assets and client-side routing relative to `root`, but since our apps are not longer served from root, we need to make one small change. Go to each `angular.json` and set the `baseHref` property, like this:

```json
{
    "projects": {
        ...
        "stocks":{ // or "clients"
            ...
            "architect": {
                ...
                "build": {
                    ...
                    "options": {
                        ...
                        "baseHref": "/stocks/" // or "/clients/"
                        ...
                    }
                }
            }
        }
    }
}
```

**NOTE!** You need to have a slash both at the end and at the start of the base href, otherwise it will not be registered.
**NOTE!** The value you give to the `baseHref` must be identical to the value used in as `route` in `glue.config.dev.json`. Otherwise, the client-side routing will not work correctly.

Let's serve our apps. To do that go to each app's root and start the default Angular servers

```cmd
npm start
```

Then go to our project root (at `/start`) and call the `serve` command of the CLI:

```cmd
gluec serve
```

Now all the necessary Glue42 Core Environment assets are served at the default locations and our apps are accessible from a single origin:
- `localhost:4242/clients`
- `localhost:4242/stocks`

Even better, because the default Angular servers are used to build, watch and refresh the apps, we have file-watching, auto-refresh and any other setting we like from the Angular dev arsenal.

Not it is a good momenta ot remove the PWAs you installed in the previous section, because they point to the default `:4100` and `:4200` apps and install the new ones.

### 1.3. Getting Started with the Solution files

Before we continue with the fun part, we will take a look at how to run the solution. You have a full solution at your disposal as a reference point incase you what to see the end result beforehand, or if you get lost somewhere along the way.

First install all dependencies - run `npm i` at `/solution`, `/solution/clients` and `/solution/stocks`. Next start both apps by running `npm start` inside `/solution/clients` and `/solution/stocks`. Finally, (assuming that you have the Glue42 Core CLI globally installed) go to `/solution` and run `gluec serve`.

You can open your browser of choice and access the apps at:
- `localhost:4242/clients`
- `localhost:4242/stocks`

## 2. Initializing Glue Web For Angular



## 3. Interop

### 3.1. Overview

### 3.2. Methods and Streams registration

### 3.3. Methods discovery

### 3.4. Methods invocation


## 4. Window Management

### 4.1. Overview

### 4.2. Opening windows at runtime

### 4.3. Window Settings

### 4.4. Window Context


## 5. Shared Contexts


## Congratulations

