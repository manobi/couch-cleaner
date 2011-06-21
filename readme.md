# Couch Cleaner
`Relax` it's not an water based product or jet vacuum. This is a Couchdb Cleaner.
This project is highly inspired by https://github.com/emerleite/node-database-cleaner

Use it to reset your database, after tests.
## Features
* Clean all docs
* Filter docs from cleanup

## How to use
Removing all docs from database "starwars":


> couch-cleaner 127.0.0.1:5984/starwars --all

if your couchdb is in localhost, you can also do:


> couch-cleaner starwars --all

Filtering some docs from cleanup (pass IDs as argument):


> couch-cleaner 127.0.0.1:5984/starwars --filter `id_luke` `id_leia` `id_vader`



Use couchdb design/filter function to safe some docs from deletation `NOT IMPLEMENTED YET`:


> couch-cleaner 127.0.0.1:5984/starwars --filter _design/_id/filters/skywalkers

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