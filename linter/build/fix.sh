#!/bin/bash
if $(git ls-files|grep /|grep \.js >/dev/null)
then
  eslint --fix --ignore-pattern '*/static/lib/*' $(git ls-files|grep /|grep \.js);
fi
