class Vue {
  constructor(options) {
    this.$options = options || {}
    this.$el = typeof options.el === 'string' ? document.querySelector(options.el) : options.el
    this.$data = options.data || {}
    let methods = this.$options.methods || {}
    // 数据劫持
    this.defineData(this.$data)
    // 添加方法
    this.addMethods(methods)
    // 添加发布订阅者
    new Observer(this.$data)
    new Compiler(this)
  }
  defineData(data) {
    Object.keys(data).forEach(key => {
      Object.defineProperty(this, key, {
        configurable: true,
        enumerable: true,
        get() {
          return data[key]
        },
        set(val) {
          if (val === data[key]) return
          data[key] = val
        }
      })
    })
  }
  addMethods(methods) {
    for (const handle in methods) {
      this[handle] = methods[handle]
    }
  }
}