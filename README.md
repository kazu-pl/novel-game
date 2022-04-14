# how to write REST API in Next.js and connect to database ONLY ONCE (not in every endpoint) using moongoose:

I was trying to implement a way to achieve single connection exactly like in plain `express` app but I could not figure it out. After some time I searched for it in google and I found an [article](https://www.prisma.io/docs/support/help-articles/nextjs-prisma-client-dev-practices) from official `Prisma` claiming that when dealing with `Prisma` you have to create connection that will assign the connection to `global` object and return that connection if it already exists on `global` object. I was trying to follow `Prisma` example but it didn't work since I use `mongoose`. After some more research I found an [article](https://itnext.io/using-mongoose-with-next-js-11-b2a08ff2dd3c) with working example and I found out it was took from official `Next.js` examples.
The official example is [here](https://github.com/vercel/next.js/tree/canary/examples/with-mongodb-mongoose).

HOW TO MAKE GLOBAL CONNECTION:

1 - Create global database connector like this:

```ts
// src/lib/dbConnection.ts

// /lib/dbConnect.js
import { MONGODB_URI } from "common/constants/env";
import mongoose from "mongoose";

/** 
Source : 
https://github.com/vercel/next.js/blob/canary/examples/with-mongodb-mongoose/utils/dbConnect.js 
**/

// source to official next.js example on how to use mongoose with  next.js:
// https://github.com/vercel/next.js/tree/canary/examples/with-mongodb-mongoose

if (!MONGODB_URI) {
  throw new Error(
    "Please define the MONGODB_URI environment variable inside .env.local"
  );
}

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */
// @ts-ignore
let cached = global.mongoose;

if (!cached) {
  // @ts-ignore
  cached = global.mongoose = { conn: null, promise: null };
}

async function dbConnect() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const options: mongoose.ConnectOptions = {
      retryWrites: true,
      w: "majority",
    };

    cached.promise = mongoose.connect(MONGODB_URI, options).then((mongoose) => {
      console.log({
        mongoose: "connected_to_mongoDB",
      });
      return mongoose;
    });
  }
  cached.conn = await cached.promise;
  return cached.conn;
}

export default dbConnect;

// found here: https://itnext.io/using-mongoose-with-next-js-11-b2a08ff2dd3c
```

2 - then await for that connector inside every of your endpoint handlers so it can establish new connection or return the existing one:

```ts
// src/pages/api/any_endpoint_handler.ts

import type { NextApiHandler } from "next";

import CharacterModel from "models/Character.model";

import dbConnect from "lib/dbConnect"; // import global db connector

const getAnything: NextApiHandler = async (_, res) => {
  await dbConnect(); // await for global connector

  // ... do something

  try {
    const allData = await CharacterModel.find().exec();

    return res.status(200).json({
      data: allData,
    });
  } catch (error) {
    return res.status(500).json({
      message: "An error occured",
      error,
    });
  }
};

export default getAnything;
```

3 - MAKE SURE your models checks if that models exists before exporting then by default. They need to be exported like this:

```ts
// src/models/CharacterModel.ts

export default mongoose.models.character ||
  mongoose.model<Character>(`character`, CharacterSchema);
```

Otherwise, you will see error `error - OverwriteModelError: Cannot overwrite `character` model once compiled.`.
Further explanation can be found below in next readme title:

# error `error - OverwriteModelError: Cannot overwrite `character` model once compiled.` when writing REST API with mongoose models in NExt.js:

If you have error like this:
`error - OverwriteModelError: Cannot overwrite `character` model once compiled.`

then you need to change export method in your model file like this:

```ts
import mongoose, { Schema, Document } from "mongoose";

export interface Character extends Document {
  title: string;
}

const CharacterSchema: Schema = new Schema(
  {
    title: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

// during run time first check if `character` model exists and if it exists, return it, in not, create new and return
export default mongoose.models.character ||
  mongoose.model<Character>(`character`, CharacterSchema);
```

found [here](https://nesin.io/blog/fix-mongoose-cannot-overwrite-model-once-compiled-error)

# runing `yarn build` fails:

If you got this error:

```
Error: EPERM: operation not permitted, open 'D:\MY-VISUAL-NOVEL-PROJECT\novel-game\.next\trace'
Emitted 'error' event on WriteStream instance at:
    at D:\MY-VISUAL-NOVEL-PROJECT\novel-game\node_modules\next\dist\compiled\@vercel\nft\index.js:1:287421
    at D:\MY-VISUAL-NOVEL-PROJECT\novel-game\node_modules\next\dist\compiled\@vercel\nft\index.js:1:287860
    at FSReqCallback.oncomplete (fs.js:179:23) {
  errno: -4048, // PAY ATTENTION TO THIS ERROR NUMBER
  code: 'EPERM',
  syscall: 'open',
  path: 'D:\\MY-VISUAL-NOVEL-PROJECT\\novel-game\\.next\\trace'
}

```

Then it means that you have runing server in the background and you try to build it at the same time. Just stop te server and run `yarn build` agian

# How to get rid of warning of not using useLayoutEffect:

If you use `useLayoutEffect` in `Next` on some page and you refresh page on that page you will get warning in console. It goes like this:

`warning: useLayoutEffect does nothing on the server, because its effect cannot be encoded into the server renderer's output format. This will lead to a mismatch between the initial, non-hydrated UI and the intended UI. To avoid this, useLayoutEffect should only be used in components that render exclusively on the client. See https://reactjs.org/link/uselayouteffect-ssr for common fixes.`

To fix this, you can visit that page `https://reactjs.org/link/uselayouteffect-ssr` and search for common fixes. To solve this, I use:

```
// src/pages/_app.tsx

import React from "react";

if (!process.browser) React.useLayoutEffect = React.useEffect;

```

# How to use yup and yupResolver with react-hook-form in Next.js v12 or later:

If you have error like this:

```
Server Error

SyntaxError: Named export 'set' not found. The requested module 'react-hook-form' is a CommonJS module, which may not support all module.exports as named exports.
CommonJS modules can always be imported via the default export, for example using:

import pkg from 'react-hook-form';
const {get: r,set: e}from"react-hook-form";var i=function(e,i){for(var a in i.fields){var f=i.fields[a];if(f&&f.ref&&"reportValidity"in f.ref){var t=r(e,a);f.ref.setCustomValidity(t&&t.message||""),f.ref.reportValidity()}}},a=function(a,f){f.shouldUseNativeValidation&&i(a,f);var t={};for(var o in a){var s=r(f.fields,o);e(t,o,Object.assign(a[o],{ref:s&&s.ref}))}return t};export{a: toNestError,i: validateFieldsNatively} = pkg;
This error happened while generating the page. Any console logs will be displayed in the terminal window.

```

then it means that you're importing `yup` like this:

```
import { yupResolver } from '@hookform/resolvers/yup';
```

but YOU SHOULD IMPORT IT LIKE THIS:

```
import { yupResolver } from '@hookform/resolvers/yup/dist/yup';
```

Solution found [here](https://stackoverflow.com/questions/69792558/react-hook-form-build-problem-when-upgrading-nextjs-to-version-12)

# How I actually installed this template:

I had node v12.x.x and I had to update it to 14.18.2 because some packages required 14.5.x or higher but lower than 15.x.x

### TypeScript & Styled Components Next.js example

This is a really simple project that show the usage of Next.js with TypeScript and Styled Components.

#### Preview

Preview the example live on [StackBlitz](http://stackblitz.com/):

[![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/github/vercel/next.js/tree/canary/examples/with-typescript-styled-components)

#### Deploy your own

Deploy the example using [Vercel](https://vercel.com?utm_source=github&utm_medium=readme&utm_campaign=next-example):

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/git/external?repository-url=https://github.com/vercel/next.js/tree/canary/examples/with-typescript-styled-components&project-name=with-typescript-styled-components&repository-name=with-typescript-styled-components)

#### How to use it?

Execute [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app) with [npm](https://docs.npmjs.com/cli/init) or [Yarn](https://yarnpkg.com/lang/en/docs/cli/create/) to bootstrap the example:

```bash
npx create-next-app --example with-typescript-styled-components with-typescript-styled-components-app
# or
yarn create next-app --example with-typescript-styled-components with-typescript-styled-components-app
```

Deploy it to the cloud with [Vercel](https://vercel.com/new?utm_source=github&utm_medium=readme&utm_campaign=next-example) ([Documentation](https://nextjs.org/docs/deployment)).

#### Notes

This is an amalgamation of the 2 existing examples:

- [with-typescript](https://github.com/vercel/next.js/tree/canary/examples/with-typescript)
- [with-styled-components](https://github.com/vercel/next.js/tree/canary/examples/with-styled-components)

---

Game menu background taken from [here](https://wallpaperaccess.com)
