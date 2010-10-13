# yamb - Yet Another Mongodb Browser

This is initially a test for my lcwa_skeleton project - it seemed a good idea to build something "real"
to drive out the design of the app skeleton, and a simple mongo browser was an itch I could easily scratch.

It may grow into a more serious project if time permits.

See also [http://github.com/kornysietsma/lcwa_skeleton] - the readme there should cover architectural strangenesses

## Goals / Direction
- simple things should be automatic - browse localhost on the server if it exists, otherwise let the user choose
- keep state in the browser - remember things like browsed hosts etc. client-side, for simplicity (and cause it's something I want to try)
- feed all useful learnings back into lcwa_skeleton
- don't try to do too much - other mongo guis want to be complete admin consoles; I just want to be able to browse and query

## TODO
- add a "getting started" section for building from scratch (especially installing coffeescript!)
- add more todo items!