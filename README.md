# superjson-remix

<p align="center">
  <img alt="superjson" src="./docs/superjson-remix.png" width="400" />
</p>

A solution for Remix that allows you to send binary data from your `loader` function to your React client app. It uses the awesome [`superjson`](https://github.com/blitz-js/superjson) package to serialize/deserialize your data automatically.

## Problem

With the existing Remix approach, only JSON parsable data can be sent to the client. This is a problem for binary data such as `Date`, `Map`, `Set` or `BigInt`.

Say you have a `loader` function and would like to send this to the client:

```ts
import { json } from 'remix';

const loader: LoaderFunction = () => {
  const obj = {
    set: new Set([1, 2, 3]),
    now: new Date(),
    largeNumber: BigInt(9007199254740991),
  };

  return json(obj);
};
```

Well you're out of luck! On the client, `Set` will parse to an empty object.

```
set: {},
```

`Date` will parse as an ISO-8601 string — not the end of the world, but certainly inconvenient.

```
now: '2022-03-13T16:47:37.521Z'
```

And you just can't send `BigInt` to the client, period.

```
TypeError: Do not know how to serialize a BigInt
```

## Solution

With `superjson-remix`, you can easily send our example data to the client. Just replace the `json` helper function that you normally would import from `remix` with an import from `superjson`.

```diff
- import { json } from 'remix';
+ import { json } from 'superjson-remix';
```

## What about the client?

We do the same thing on the client. We import `useLoaderData` from `superjson-remix` instead of from `remix`, just like we did with `json` on the server.

```diff
- import { useLoaderData } from 'remix';
+ import { useLoaderData } from 'superjson-remix';
```

## Complete example

Here is an example route that uses `superjson-remix` to send our data to the client.

```js
import { json, useLoaderData } from 'superjson-remix';

export const loader = () => {
  const obj = {
    set: new Set([1, 2, 3]),
    now: new Date(),
    largeNumber: BigInt(9007199254740991),
  };

  return json(obj);
};

const MyComponent = () => {
  const { set, now, largeNumber } = useLoaderData();

  return (
    <div>
      <p>Our set: {Array.from(set).join(', ');}</p>
      <p>Server time: {now.toLocaleString()}</p>
      <p>A large number: {largeNumber.toString()}</p>
    </div>
  );
};

export default MyComponent;
```

It renders the following.

```
Our set: 1, 2, 3

Server time: 3/13/2022, 1:05:20 PM

A large number: 9007199254740991
```

## Oh, yeah. The `meta` function.

We provide a `withSuperJSON` higher-order function that wraps your `meta` function and will automatically deserialize the `data` argument.

```js
import { withSuperJSON } from 'superjson-remix';

export const meta = withSuperJSON(({ data }) => {
  return {
    title: 'Sample App',
    description: `Created on ${data.now.toLocaleString()}`,
  };
});
```

## Getting Started

Install the library with your package manager of choice, e.g.:

```

npm i superjson-remix

```

or

```

yarn add superjson-remix

```

## License

&copy; 2022 Donavon West. Released under [MIT license](./LICENSE).
