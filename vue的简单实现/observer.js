class Observer {
  constructor(data) {
    this.walk(data)
  }
  walk(data) {
    if (!data || typeof data !== 'object') return
    Object.keys(data).forEach(key => {
      this.defineReactive(data, key, data[key])
    })
  }
  defineReactive(data, key, val) {
    let _this = this
    // 创建dep，收集观察者依赖
    let dep = new Dep()
    // 递归遍历值，如果是对象，监听内部数据
    this.walk(val)
    Object.defineProperty(data, key, {
      configurable: true,
      enumerable: true,
      get() {
        Dep.target && dep.addSub(Dep.target)
        return val
      },
      set(newVal) {
        if(val === newVal) return
        // 新值是对象，添加监听
        _this.walk(newVal)
        // 通知观察者
        dep.notify()
      }
    })
  }
}