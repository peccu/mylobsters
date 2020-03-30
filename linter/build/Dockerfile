FROM node:latest

WORKDIR /extra-addons

RUN npm i -g eslint

VOLUME ["/extra-addons"]
# CMD ["eslint", "--ignore-pattern", "'*/static/lib/*'", "$(git ls-files|grep /|grep \.js)"]
CMD ["/extra-addons/linter/build/lint.sh"]
