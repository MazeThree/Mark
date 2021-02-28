class Compiler {
    constructor(vm) {
      this.vm = vm // vm是vue实例
      this.$el = vm.$el
  
      // 编译模板
      this.compile(this.$el)
    }
  
    compile(el) {
      // 获取所有子节点
      let nodeList = el.childNodes
      Array.from(nodeList).forEach(node => {
        if(this.isTextNode(node)) { // 文本节点
          this.compileText(node)
        }else if(this.isElementNode(node)) { // 元素节点
          this.compileElement(node)
        }
  
        if(node.childNodes && node.childNodes.length) { // 如果节点下还有子节点，则递归
          this.compile(node)
        }
      })
    }
  
    isTextNode(node) {
      return node.nodeType === 3
    }
  
    isElementNode(node) {
      return node.nodeType === 1
    }
  
    isDirective(attrName) { // 是否是以'v-'开头的指令
      return attrName.startsWith('v-')
    }
  
    compileText(node) { // 编译文本节点
      const reg = /\{\{(.+)\}\}/
      const value = node.textContent // 文本内容
      if(reg.test(value)) {
        const key = RegExp.$1.trim() // 获取变量名
        node.textContent = value.replace(reg, this.vm[key]) // 把对应的变量替换
        // 创建一个 watcher，观察数据的变化
        new Watcher(this.vm, key, newValue => {
          node.textContent = newValue
        })
      }
    }
  
    compileElement(node) { // 编译元素节点
      // 获取元素的属性  Array.from把 伪数组转成数组
      Array.from(node.attributes).forEach(attr => {
        let attrName = attr.name
        // 是否是以'v-'开头的指令
        if(this.isDirective(attrName)) {
          let name = attrName.substr(2) // 指令名称
          let key = attr.value // 所赋值的变量
          // 根据指令执行对应的方法
          this.instructions(node, name, key)
        }
      })
    }
  
    instructions(node, name, key) {
      let instrucFn = ''
      let eventType = ''
      if(name.startsWith('on:')) { // 这里是v-on指令
        eventType = name.substr(3) // 事件名
        instrucFn = this.onInstrucFn
      }else {
        instrucFn = this[name + 'InstrucFn']
      }
      instrucFn && instrucFn.call(this, node, this.vm[key], key, eventType)
    }
  
    textInstrucFn(node, value, key) { // v-text对应的方法
      node.textContent = value
      // 每一个指令中创建一个 watcher，观察数据的变化
      new Watcher(this.vm, key, newValue => {
        node.textContent = newValue
      })
    }
  
    htmlInstrucFn(node, value, key) { // v-html对应的方法
      node.innerHTML = value
      // 每一个指令中创建一个 watcher，观察数据的变化
      new Watcher(this.vm, key, newValue => {
        node.innerHTML = newValue
      })
    }
  
    modelInstrucFn(node, value, key) { // v-model对应的方法
      node.value = value
      // 每一个指令中创建一个 watcher，观察数据的变化
      new Watcher(this.vm, key, newValue => {
        node.value = newValue
      })
  
      // 监听input事件，给对应的变量重新赋值
      node.addEventListener('input', ()=>{
        this.vm[key] = node.value
      })
    }
  
    onInstrucFn(node, value, key, eventType) { // v-on对应的方法
      node.addEventListener(eventType, ()=>{
        this.vm[key]()
      })
    }
  }