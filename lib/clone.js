// node的 util 模块 promisify可以把回调promise化
const { promisify } = require('util')

// 进度显示工具
const ora = require('ora')

// 颜色显示工具
const chalk = require('chalk')

// 下载git 仓库代码工具
const download = promisify(require('download-git-repo'))

/**
 *
 * @param {string} repo 仓库地址
 * @param {string}  dir 文件夹
 * @param {object}  opotions 配置项
 */
const clone = async function (repo, dir, opotions = {}) {
  const process = ora(`开始初始化 ${chalk.blue(repo)}`)
  process.start()
  process.color = 'yellow'
  process.text = `正在初始化..... ${chalk.yellow(repo)} `

  try {
    await download(repo, dir, opotions)
    process.color = 'green'
    process.text = `${chalk.green(dir)} 初始化成功`
    process.succeed()
  } catch (error) {
    process.color = 'red'
    process.text = '初始化失败'
    process.fail()
  }
}

module.exports = clone
