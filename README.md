# IteratifBARKER
The place to become riche ?


## set up environement

``npm update``

## tsconfig
```
target: this option specifies the version of ECMAScript that the compiler will output when generating JavaScript files. By setting this to es6, we can make use of all the features introduced in ES6/ES2015.

module: this option specifiees the module system that we are using in the generated code. By setting this to commonjs, we've ensured that our code can run in Node.js.

typeRoots: this option specifies the directory where TypeScript should search for global types. We set it here to our local node_modules/@types to prevent accidentally inheriting types from parent directories (which is the default behavior).

esModuleInterop: this option ensures that we have compatibility between CommonJS and ES Modules (more on this in the Compiler Options chapter).

forceConsistentCasingInFileNames: this option ensures that we don't introduce bugs by accidentally importing a module using incorrect casing (i.e. importing MyProduct.ts as myproduct.ts).
```