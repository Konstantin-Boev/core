## Overview

The [**Glue42 React Hooks**](https://www.npmjs.com/package/@glue42/react-hooks) package is a library providing custom React hooks for the Glue42 Javascript libraries - [@glue42/web](../../../../reference/core/latest/glue42%20web/index.html), if you are working on a **Glue42 Core** project, or [@glue42/desktop](../../../../reference/glue/latest/glue/index.html), if you are working on a **Glue42 Enterprise** project. The examples below use the [Glue42 Web](../../../../reference/core/latest/glue42%20web/index.html) library. The Glue42 React Hooks library allows you to start using Glue42 features in your React apps idiomatically in the context of the React framework.

## Prerequisites

The Glue42 React Hooks library requires the Glue42 Web, React and ReactDOM libraries installed. To install the packages, navigate to the root directory of your project and run:

```cmd
npm install --save @glue42/react-hooks @glue42/web react react-dom
```

Your `package.json` file should now have the following dependencies:

```json
{
    "dependencies": {
        "@glue42/web": "^1.0.0",
        "@glue42/react-hooks": "1.0.0",
        "react": "^16.13.1",
        "react-dom": "^16.13.1"
    }
}
```

*Keep in mind that the versions of the dependencies will probably be different from the example here due to newer package releases.*

## Library Features

The Glue42 React Hooks library offers a way to consume the APIs of the [Glue42 Web](../../../../reference/core/latest/glue42%20web/index.html) library in your web applications via [React Hooks](https://reactjs.org/docs/hooks-intro.html) and [React Context](https://reactjs.org/docs/context.html). The Glue42 React Hooks library provides the following features described below.

### Context

- #### GlueProvider

The `GlueProvider` is a React context provider component. It invokes a factory function (with default or user-defined configuration) which initializes the Glue42 Web library. The `glue` object returned from the factory function is set as the context value.

Below is the signature of the `GlueProvider` component:

```typescript
GlueProviderProps {
    children: ReactNode;
    fallback?: NonNullable<ReactNode> | null;
    config?: Glue42Web.Config;
    glueFactory?: GlueWebFactoryFunction;
};

GlueProvider: FC<GlueProviderProps>;
```

- `children` - React components which may contain Glue42 related logic;
- `fallback` - *Optional*. A React component to display while initializing Glue42;
- `config` - *Optional*. A [Config](../../../../reference/core/latest/glue42%20web/index.html) object for the `GlueWeb()` factory function;
- `glueFactory` - *Optional*. Factory function used to initialize the Glue42 Web library. Defaults to `window.GlueWeb`.

- #### GlueContext

`GlueContext` is the React context which is used by the `GlueProvider` component. You can consume this context from anywhere inside you app with the default React hook `useContext()`.

```typescript
GlueContext: Context<Glue42Web.API>;
```

### Hooks

- #### useGlue()

The `useGlue()` hook is a React hook which will invoke the callback that you pass to it.

Below is the signature of `useGlue()`:

```typescript
<T = undefined>(
    cb: (glue: Glue42Web.API, ...dependencies: any[]) => void | T | Promise<T>,
    dependencies?: any[]
) => T;
```

- `cb` - **Required**. A sync/async callback function that will be invoked with the `glue` object and an array of user-defined `dependencies`. The callback may or may not include any Glue42-related code;
    - `glue` - the object returned from the initialization of the [Glue42Web](../../../../reference/core/latest/glue42%20web/index.html) library;
    - `dependencies` -  additional user-defined arguments for the callback;
- `dependencies` - *Optional*. An array of user-defined variables that will trigger the invocation of the provided callback based on whether the value of any of the specified variables has changed (same functionality as the [`useEffect()`](https://reactjs.org/docs/hooks-effect.html#tip-optimizing-performance-by-skipping-effects) React hook).

- #### useGlueInit()

**useGlueInit** is a React Hook which takes care of initializing Glue library. It can be used to customize the initialization logic for the Glue integration within you application.

| Property      | Type                          | Description                                                 | Default                            |
| ------------- | ----------------------------- | ----------------------------------------------------------- | ---------------------------------- |
| `config`      | [Glue42Web](../../../../reference/core/latest/glue42%20web/index.html)     | **Optional** Configuration object for Glue factory function | [Glue42Web](../../../../reference/core/latest/glue42%20web/index.html) |
| `glueFactory` | [Glue42Web](../../../../reference/core/latest/glue42%20web/index.html) | **Optional** Factory function used to initialize Glue       | `window.Glue`                      |

```typescript
useGlueInitProps = (
    config: Glue42Web.Config,
    glueFactory: GlueProviderProps["glueFactory"]
) => Glue42Web.API;

useGlueInit: useGlueInitProps;
```

## Usage

Below you can see some examples of using the Glue42 React Hooks library.

### GlueProvider

Add **GlueProvider** component by wrapping your other components inside (preferably the **Root** one):

```javascript
//index.js
import "glue42/web";
import { GlueProvider } from "glue42/react-hooks";

ReactDOM.render(
  <GlueProvider>
    <Root />
  </GlueProvider>,
  document.getElementById("root")
);
```

Example:

```javascript
import { GlueProvider } from "glue42/react-hooks";

ReactDOM.render(
  <GlueProvider fallback={<h2>Loading...</h2>}>
    <YourApplication />
  </GlueProvider>,
  document.getElementById("root")
);
```

### GlueContext

Using the built in React hook **useContext** you can get direct access to the global **glue** object and do whatever you want:

```javascript
import { useContext, useState, useEffect } from "react";
import { GlueContext } from "@glue42/react-hooks";

const Application = () => {
  const [context, setContext] = useState({});
  const glue = useContext(GlueContext);
  useEffect(() => {
    setContext(glue.windows.my().context);
  }, []);

  return (
    <div>
      <h2>My Window Context</h2>
      <pre>{JSON.stringify(context, null, 4)}</pre>
    </div>
  );
};

export default Application;
```

Example:

```javascript
import { GlueContext } from "glue42/react-hooks";
import { useContext } from "react";

export const App = () => {
  const glue = useContext(GlueContext);
  return <pre>{JSON.stringify(glue.windows.my().context)}</pre>;
};
```

### useGlue

Now you can start using Glue42 idiomatically in the context of ReactJS via hooks in your functional components:

```javascript
import { useGlue } from "@glue42/react-hooks";

const Application = () => {
  const openWindow = useGlue(glue => (name, url) => {
    glue.windows.open(name, url);
  });
  return (
    <table>
      <tr>
        <td> Client List </td>
        <td>
          <button
            onClick={() => {
              openWindow("ClientList", "http://localhost:8080/client-list");
            }}
          >
            Start
          </button>
        </td>
      </tr>
      <tr>
        <td> Client Portfolio </td>
        <td>
          <button
            onClick={() => {
              openWindow(
                "ClientPortfolio",
                "http://localhost:8080/client-portfolio"
              );
            }}
          >
            Start
          </button>
        </td>
      </tr>
      <tr>
        <td> Stock Details </td>
        <td>
          <button
            onClick={() => {
              openWindow("StockDetails", "http://localhost:8080/stock-details");
            }}
          >
            Start
          </button>
        </td>
      </tr>
    </table>
  );
};

export default Application;
```

Example:

```javascript
import { useGlue } from "@glue42/react-hooks";

export const Application = () => {
  const openWindow = useGlue(glue => (name, url) => {
    glue.windows.open(name, url);
  });
  return (
    <button
      onClick={() => {
        openWindow("ClientList", "http://localhost:8080/client-list");
      }}
    >
      Start
    </button>
  );
};
```

```javascript
import { useGlue } from "@glue42/react-hooks";
import { useState } from "react";

export const Application = () => {
  const [title, setTitle] = useState("");
  const getTitle = useGlue(glue => methodName => {
    glue.interop.invoke(methodName).then(r => setTitle(r.returned._result));
  });
  return (
    <>
      <h2>{title}</h2>
      <button
        onClick={() => {
          getTitle("T42.Demo.GetTitle");
        }}
      >
        Get Title
      </button>
    </>
  );
};
```

### useGlueInit

Example:

```javascript
import "glue42/web";
import { useGlueInit } from "@glue42/react-hooks";

export const Application = () => {
  const glue = useGlueInit();
  return glue ? <App glue={glue} /> : <Loader />;
};
```

### **useGlueInit** hook so you can render conditionally your app when glue is initialized:

```javascript
import "glue42/web";
import { useGlueInit } from "@glue42/react-hooks";

export const Application = () => {
  const glue = useGlueInit();
  return glue ? <App glue={glue} /> : <Loader />;
};
```

_You need to take care of the way you provide glue object to your nested components (with React Context or attaching it to the window variable)._


### Use your own glue factory function for initializing glue. Useful in jest/enzyme tests when you are mocking glue:

```javascript
//index.js
import "glue42/web";
import { mount } from "enzyme";
import { GlueProvider } from "glue42/react-hooks";

// url location of the shared worker
const glueFactory = () => {
  const glueObject = {
    interop: { invoke: jest.fn(), register: jest.fn() },
    contexts: { subscribe: jest.fn(), update: jest.fn() },
    windows: { open: jest.fn(), my: jest.fn() }
  };
  return Promise.resolve(glueObject);
};

describe("Mock Glue", () => {
  it("should mock glue", () => {
    const wrapper = mount(
      <GlueProvider glueFactory={glueFactory}>
        <Root />
      </GlueProvider>
    );
    // do whatever you want
  });
});
```

_You might also checkout the "@testing-library/react-hooks" for testing your react hooks_