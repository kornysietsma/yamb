# yamb - Yet Another Mongodb Browser

This is initially a test for my lcwa_skeleton project - it seemed a good idea to build something "real"
to drive out the design of the app skeleton, and a simple mongo browser was an itch I could easily scratch.

It may grow into a more serious project if time permits.

See also [http://github.com/kornysietsma/lcwa_skeleton] - the readme there should cover architectural strangenesses

This branch is trying out jquery-bbq instead of sammy.js ...

## Goals / Direction
- simple things should be automatic - browse localhost on the server if it exists, otherwise let the user choose
- keep state in the browser - remember things like browsed hosts etc. client-side, for simplicity (and cause it's something I want to try)
- feed all useful learnings back into lcwa_skeleton
- don't try to do too much - other mongo guis want to be complete admin consoles; I just want to be able to browse and query

## TODO
- create github project
- fix indentation of coffeescript
- fix coding conventions - see http://javascript.crockford.com/code.html
- fix watch script; logging to file is pointless, we need instant feedback of failures.
- css!
- add a "getting started" section for building from scratch (especially installing coffeescript!)
- do we need multiple hosts? I don't think so, but might want to cache multiple hosts anyway
- let the user enter a host/port (and remember their choices)
- hide ports when they are the default port
- sort dbs, collections (do we need a grid control? yeurk! eschew complexity!)
- show collection contents (with dynamic scrolling)
-- find a nice json formatter - don't assume a schema!
- allow search filters
-- explicit by json filter
-- by example? by column? with handling of documents that don't match the filter?
- allow column filters
-- explicit list of columns?
-- hide individual columns?  (can we do this server-side and still handle any schema?)
- support caching of db info (with age indicators and a big clear 'reload' button) for speed
- add more todo items!