#!/bin/bash
if $(git ls-files|grep /|grep \.js >/dev/null)
then
  eslint --quiet --no-color --ignore-pattern '*/static/lib/*' $(git ls-files|grep /|grep \.js);
fi
