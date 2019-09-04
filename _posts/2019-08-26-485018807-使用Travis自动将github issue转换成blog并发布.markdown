# 使用Travis自动将github issue转换成blog并发布 
 # 原因

# 使用

# 实现
- Travis相关配置，参考其他博客
增加环境变量 GH_USER, GH_TOKEN
- 定时触发travis构建，参考官方文档
- 调用 generate.js 脚本生成 blog  & 自动将变更 commit & push 会repository

.travis.yml
```yaml
language: node_js
node_js:
script: node generate.js
after_success:
  - .travis/push.sh
```
.travis/push.sh
```bash
#!/bin/sh

setup_git() {
  git config --global user.email "travis@travis-ci.org"
  git config --global user.name "Travis CI"
}

commit_website_files() {
  git checkout master
  git add ./_posts/ *.markdown
  git commit --message "Travis build: $TRAVIS_BUILD_NUMBER"
  git push
}

upload_files() {
  git remote rm origin
  git remote add origin https://{GH_USER}:${GH_TOKEN}@github.com/lotosbin/lotosbin.github.io.git > /dev/null 2>&1
  git push --quiet origin master
}

setup_git
commit_website_files
upload_files
```
# TODO
- [] issue更新自动触发travis构建
# 参考[ref]:
- http://www.ruanyifeng.com/blog/2017/12/travis_ci_tutorial.html
travis 自动 commit& push  https://gist.github.com/willprice/e07efd73fb7f13f917ea