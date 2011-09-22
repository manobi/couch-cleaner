# Couch Cleaner
`Relax` it's not an water based product or jet vacuum. This is a Couchdb Cleaner.
This project is highly inspired by https://github.com/emerleite/node-database-cleaner

Use it to reset your database, after tests.
## Features
* Clean all docs // --all
* Filter some docs from cleanup // --filter
* Filter all design docs from cleanup // --gestalt

## How to use (In terminal)
> couch-cleaner http://127.0.0.1:5984/starwars

#### Removing all docs:
> couch-cleaner http://127.0.0.1:5984/starwars --all

 or (in localhost)

> couch-cleaner starwars --all

#### Filtering some docs from cleanup (pass IDs as argument):
> couch-cleaner http://127.0.0.1:5984/starwars --filter luke, leia, vader

#### Filter all design docs from cleanup
> couch-cleaner http://127.0.0.1:5984/starwars --gestalt

#### Authentication is suported in all options

> couch-cleaner http://admin:password@127.0.0.1:5984/starwars --filter luke, leia, vader

or

> couch-cleaner http://127.0.0.1:5984/starwars --filter luke, leia, vader --login admin
'Will ask for password as input'

## How to use (As node.js module)
Read the specs, to see how your can use as node.js module. I will document it later.

## How to install 
> npm install -g couch-cleaner


## How run the tests
> npm install -g jasmine-node

and run

> jasmine-node spec

If is it green, it's ok.


# License:
(The MIT License)

Copyright (c) 2011 copyright github.com/manobi

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.