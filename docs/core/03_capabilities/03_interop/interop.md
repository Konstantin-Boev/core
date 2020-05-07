## Overview

The [Interop API](../../../reference/core/latest/interop/index.html) enables applications to:

- **offer functionality** to other applications by **registering** Interop methods;
- **discover applications which offer methods**;
- **invoke** (call) registered Interop methods;
- **stream and subscribe to real-time data** using the Interop Streaming API;

We call applications which offer methods and streams *Interop servers*, and applications which consume them - *Interop clients*, and collectively - **Interop instances**.

*For detailed information on the Interop API (methods, streams, discovery and more), see the [**Interop**](../../../glue42-concepts/data-sharing-between-apps/interop/javascript/index.html) documentation.*

In the next sections, you can see examples of using the Interop API. You can open the embedded examples directly in [CodeSandbox](https://codesandbox.io) to see the code and experiment with it.

## Registering and Invoking Methods

The applications below demonstrate how to register and invoke Interop methods using the [`register()`](../../../reference/core/latest/interop/index.html#!API-register) and [`invoke()`](../../../reference/core/latest/interop/index.html#!API-invoke) methods of the Interop API. 

On load, App B registers a method called "G42Core.Basic". Click the "Invoke" button in App A to invoke this method and print the result from the method invocation (prints a timestamp and the message "Hello from App B.").

<!-- example 1 -->

## Targeting

The applications below demonstrate targeting Interop servers when invoking Interop methods. 

On load, Apps B and C register a method with the same name. Click one of the buttons in App A to invoke this method and print the result from the method invocation (prints a timestamp and a message from the respective app). There are four buttons - "Invoke Default" (invokes the method by targeting the server that has registered it first), "Invoke All" (invokes the method by targeting all servers offering it), "Invoke App B" (invokes the method by targeting App B) and "Invoke App C" (invokes the method by targeting App C). 

<!-- example 2 -->

## Discovery

### Methods

- #### Method Name

The applications below demonstrate discovering Interop methods by method name. 

Use App B and App C to register Interop methods by providing a method name. Input a method name in App A and click the "Invoke" button to invoke the method and print the result from the method invocation.

<!-- example 3 -->

- #### Method Events

The applications below demonstrate discovering Interop methods by subscribing to the [`serverMethodAdded()`](../../../reference/core/latest/interop/index.html#!API-serverMethodAdded) and the [`serverMethodRemoved()`](../../../reference/core/latest/interop/index.html#!API-serverMethodRemoved) events of the Interop API. 

On load, App A subscribes to the `serverMethodAdded()` and `serverMethodRemoved()` events and will print the names of the newly registered method and the server offering it. Use App B and App C to register Interop methods by providing a method name.

<!-- example 4 -->

### Servers

The applications below demonstrate discovering Interop servers by method name. 

Use App B and App C to register Interop methods by providing a method name. Input a method name in App A and click the "Find Servers" button to print the Interop servers that provide the method. 

<!-- example 5 -->

## Streaming

### Publishing and Subscribing

The applications below demonstrate publishing and subscribing for Interop streams. 

On load, App B registers an Interop stream called "G42Core.Stream.Basic". Click the "Subscribe" button in App A to subscribe to the registered stream. Each time App A receives data, it will be printed on the page (time stamp, message and counter). Click the "Start Publishing" button in App B to start publishing data to the stream every 3 seconds.

<!-- example 6 -->

### Events

The applications below demonstrate handling streaming events - adding/removing subscribers and closing the stream. 

Click the "Create Stream" button in App B to register an Interop stream called "G42Core.Stream.Basic". Click the "Subscribe" button in App A to subscribe to the registered stream - App B will print to the page when a new subscriber is added. Each time App A receives data, it will be printed on the page (time stamp, message and counter). Click the "Start Publishing" button in App B to start publishing data to the stream every 3 seconds. 

Click the "Unsubscribe" in App A to close the subscription to the stream - App B will print to the page when a subscriber is removed. Click the "Close Stream" button in App B to close the stream - App A will print to the page when the stream is closed.

<!-- example 7 -->

### Managing Subscriptions

The applications below demonstrate handling stream subscriptions - accepting/rejecting subscriptions, grouping subscribers on branches, pushing data to all subscribers or to a specific stream branch.

On load, App C registers an Interop stream called "G42Core.Stream.Basic". Click the "Subscribe" button in App A and App B to subscribe to the registered stream. App A and App B will print to the page subscription success or error messages, as well as the received data from the stream (time stamp, message and counter).

When App C receives a new subscription request, it will print the subscription info on the page and show three buttons for the subscription: "Accept", "Accept on Private" and "Reject".

- "Accept" - accepts the subscription on the default branch.
- "Accept on Private" - accepts the subscription on a branch called "Private".
- "Reject" - rejects the subscription.

Use the "Push" and "Push to Private" buttons to push stream data to the default streaming branch (to all subscriptions) or to the "Private" branch.

<!-- example 8 -->