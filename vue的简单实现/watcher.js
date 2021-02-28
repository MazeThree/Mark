class Watcher {
    constructor(vm, key, callback) {
      this.vm = vm
      this.key = key // data 中的属性名称
      this.cb = callback // 当数据变化的时候，调用 cb 更新视图
  
      Dep.target = this // 在 Dep 的静态属性上记录当前 watcher 对象，当访问数据的时候把 watcher 添加到 dep 的 subs 中
      this.oldValue = vm[key] // 记录改变之前的变量值
      Dep.target = null // 重置，以防重复添加
    }
  
    update() {
      const newValue = this.vm[this.key]
      if(newValue === this.oldValue) return
      this.cb(newValue)
    }
  }