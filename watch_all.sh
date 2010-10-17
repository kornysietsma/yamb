#!/bin/bash
# run precompile apps in the background
#  you could do this manually in separate terminals,
#  or kick this off from rake...
# no longer sends output to log files - too hard to see compile failures!
sass --watch views/scss:public/stylesheets &
coffee -o public/javascript --watch views/coffee/ &

