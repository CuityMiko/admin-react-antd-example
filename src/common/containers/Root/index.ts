/**
 * @author yanxiaodi
 * @email 929213769@qq.com
 * @create date 2017-10-09 02:13:19
 * @modify date 2017-10-09 02:13:19
 * @desc 判断环境, 输出配置好的 <Root />组件
 */
if (process.env.NODE_ENV === 'production') {
  module.exports = require('./Root.prod')
} else {
  module.exports = require('./Root.dev')
}
