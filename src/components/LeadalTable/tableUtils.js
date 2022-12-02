import ElementUI from 'element-ui'
export const scientificNotation = (val) => {
  // 转科学技数法
  if (!/^(\+|-)?(\d+)(\.\d+)?$/.test(val)) {
    return val
  }
  const begin = RegExp.$1
  let center = RegExp.$2
  const end = RegExp.$3
  const re = new RegExp().compile('(\\d)(\\d{3})(,|$)')
  while (re.test(center)) center = center.replace(re, '$1,$2$3')
  return begin + '' + center + '' + end
}

export const imgsData = (url) => {
  // 显示图片
  if (url !== undefined && url !== null) {
    if (url.toString().indexOf('.') !== -1) {
      const site = url.lastIndexOf('.')
      // 截取最后一个/后的值
      if (
        ['jpg', 'png', 'jpeg', 'gif', 'bmp', 'webp'].includes(
          url.substring(site + 1, url.length)
        )
      ) {
        return true
      }
    }
  }
  return false
}

export const setWidths = (col) => {
  // 计算表格头长度 按比例乘以指定的数
  const len = strlen(col.label)
  if (col.width) {
    return col.width + 'px'
  } else {
    if (len < 4 && col.tip) {
      return len * 11 + 50
    } else {
      return len * 11 + 50
    }
  }
}

const strlen = (str) => {
  let len = 0
  for (let i = 0; i < str.length; i++) {
    const c = str.charCodeAt(i)
    // 单字节加1
    if ((c >= 0x0001 && c <= 0x007e) || (c >= 0xff60 && c <= 0xff9f)) {
      len++
    } else {
      len += 2
    }
  }
  return len
}

export const renderHeader = (h, { column }, col) => {
  return h(
    'el-tooltip',
    {
      props: {
        content: (function() {
          if (col?.tip !== '') {
            return col.tip
          }
        })(),
        placement: col.tip ? 'top' : ''
      },
      domProps: {
        innerHTML: question(column, col)
      },
      class: col.sort ? 'sort-header' : col.tip ? 'sort-header' : ''
    },
    [h('span')]
  )
}

export const question = (column, col) => {
  if (col.tip !== undefined && col.tip !== '') {
    return column.label + '<span class="el-icon-question"></span>'
  } else {
    return column.label
  }
}

export const copyData = (data) => {
  // 复制公用方法
  const oInput = document.createElement('input')
  oInput.value = data
  document.body.appendChild(oInput)
  oInput.select() // 选择对象;
  console.log(oInput.value)
  document.execCommand('Copy') // 执行浏览器复制命令
  ElementUI.Message({
    message: '复制成功',
    type: 'success'
  })
  oInput.remove()
}
