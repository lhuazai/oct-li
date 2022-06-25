const chalk = require('chalk')
const path = require('path')
const fs = require('fs')

// 用户与命令行交互的工具
const Prompt = require('inquirer')

const clone = require('./clone')

// gitlab仓库地址 #分支，不写默认master分支
const remote = 'direct:http://gitlab.lexue.inc/frontend/oct-tmp'

// 交互命令行
const initQuestions = (name) => [
  {
    type: 'confirm',
    name: 'isInit',
    message: `Make sure you create your ${chalk.green(name)} project in the Projects directory?`,
    prefix: '?',
  },
]
const initBranchQuestions = () => [
  {
    type: 'confirm',
    name: 'isLogin',
    message: `Is need required login function?`,
    prefix: '?',
  },
]
const reEnterProjectName = () => [
  {
    type: 'input',
    name: 'projectName',
    message: `The project you created already exists. Please re-enter the project name ___`,
    prefix: '⚠️⚠️⚠️ ',
  },
]

// 根据命令行交互结果初始化不同分支
const getBranch = async () => {
  const { isLogin } = await Prompt.prompt(initBranchQuestions())
  if (isLogin) {
    return '#login'
  }
  return ''
}

// 初始化项目
const init = async (name) => {
  try {
    const { isInit } = await Prompt.prompt(initQuestions(name))

    // 检测创建项目是否已存在
    const isProjectExists = fs.existsSync(path.join(path.resolve(__dirname, '..'), `projects/${name}`))
    if (isProjectExists) {
      const { projectName } = await Prompt.prompt(reEnterProjectName(name))
      projectName && init(projectName)
      return
    }

    if (isInit) {
      // 获取分支
      const branch = await getBranch()
      // 创建项目
      await clone(`${remote}${branch}`, `projects/${name}`, { clone: true, headers: { 'PRIVATE-TOKEN': 'FfiPmgCCjfPkniQxb-SV' } })
    } else {
      console.log(chalk.red('取消创建'))
    }
  } catch (error) {
    console.log(chalk.red(error))
  }
}

module.exports = init
