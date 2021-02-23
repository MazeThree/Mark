
Function.prototype.myCall = function (context) {
  if (typeof context === 'undefined' || typeof context === null) {
    context = window
  }
  context.fn = this
  let args = [...this.arguments].slice(1)
  let result = context.fn(...args)
  delete context.fn
  return result
}
/**
 * 原型链:每个函数都有一个prototype属性（显式原型），对象具有一个__proto__属性（隐式原型）
 * 当访问一个对象的某个属性时，会先在这个对象本身属性上查找，如果没有找到，则会去它的__proto__隐式原型上查找，即它的构造函数的prototype，如果还没有找到就会再在构造函数的prototype的__proto__中查找，这样一层一层向上查找就会形成一个链式结构，我们称为原型链。
 * a.__proto__ === b.prototype
 * Object.prototype.__proto__ === null
 * b.constructor = a
 */

/**
 * 实现一个new方法
 * 原理: 1.创建一个空对象
 *       2.将对象的原型链指向其构造函数
 *       3.改变this指向，将this指向新的实例对象
 *       4.返回该实例对象
 */
// function myNew () {
//   let obj = new Object()
//   let Constructor = [].shift.call(arguments)
//   obj.__proto__ = Constructor.prototype
//   let result = Constructor.apply(obj, arguments)
//   return typeof result === 'object' ? result : obj
// }

function myNew (fn, ...args) {
  let obj = Object.create(fn.prototype)
  let result = fn.call(obj, ...args)
  return typeof result === 'object' ? result : obj
}


/**
 * 定义一个类
 */
class Person {
  constructor(name, age) {
    this.name = name
    this.age = age
    this.class = 'javascript'
  }
  sayHi () {
    return `hi,我叫${this.name},今年${this.age},课程为${this.class}`
  }
}


/**
 * es6实现继承，super继承参数
 */
class Student extends Person {
  constructor(name, age, lessons) {
    super(name, age)
    this.lessons = lessons
  }
  sayLessons () {
    let str = this.lessons.join(',')
    return `hi,我叫${this.name},今年${this.age},课程有${str}`
  }
}

/**
 * es5定义一个构造函数
 */
function People (name, age) {
  this.name = name
  this.age = age
  this.sex = '男'
}
People.prototype.sayHi = function () {
  return `hi,我叫${this.name},今年${this.age},课程为${this.class}`
}
People.prototype.saySex = function () {
  return `hi,我叫${this.name},今年${this.age},性别${this.sex}`
}
/**
 * es5原型链继承
 * 缺点：由于所有Child实例原型都指向同一个Parent实例, 因此对某个Child实例的父类引用类型变量修改会影响所有的Child实例
在创建子类实例时无法向父类构造传参, 即没有实现super()的功能
参考链接： https://juejin.im/post/6844904116552990727#heading-12
 */
function Child () {
}
Child.prototype = new People()

let child = new Child('王五', '22')
console.log(child.sayHi())//拿不到参数
console.log(child.saySex())//拿不到参数，只能显示静态参数
let person = new Person('张三', '23')
console.log(person.sayHi())
let testNew = myNew(People, '张三', '23')
console.log(testNew.sayHi())
let student = new Student('李四', '10', ['语文', '数学', '英语'])
console.log(student.sayHi())

/**
 * es5构造函数继承
 * 构造函数继承，即在子类的构造函数中执行父类的构造函数，并为其绑定子类的this，让父类的构造函数把成员属性和方法都挂到子类的this上去，这样既能避免实例之间共享一个原型实例，又能向父类构造方法传参
 * 缺点： 继承不到父类原型上的属性和方法
 */
function Child1 () {
  People.call(this, ...arguments)
}
let child1 = new Child1('赵四', '12')
// console.log(child1.sayHi())//报错
console.log(child1.name)

/** 
 * es5组合继承
 * 在构造函数继承的基础上添加原型链继承，二者结合
 * 缺点：创建子类实例时，会有两份相同属性和方法
*/
Child1.prototype = new People()
Child1.prototype.constructor = Child1
let child2 = new Child1('王五', '22')
console.log(child2.sayHi())

/**
 * es5寄生式组合继承,es6转es5的继承实现就是用的这种方式，较为完善
 */
Child1.prototype = Object.create(People.prototype)
Child1.prototype.constructor = Child1
let child3 = new Child1('李六', '12')
console.log(child3.sayHi())

/***
* 查找最长公共子集
*/
// function findLongestWord(s, d) {
//   let result = ''
//   d.forEach(item => {
//     if (item.length > result.length) {
//       let arr = item.split('')
//       let index = -1
//       for (let i = 0; i < arr.length; i++) {

//         index = s.indexOf(arr[i])
//         if (index == -1) {
//           break
//         } else {
//           s = s.slice(index + 1)
//         }
//       }
//       if (index != -1) {
//         result = item
//       }
//     }
//   })
//   return result
// };
// findLongestWord("abpcplea", ["ale", "apple", "monkey", "plea"])

/**
 * 判断有序二位递增数组是否包含某个值
 * @param {Array} arr 
 * @param {Number} num 
 */

function hasNums (arr, num) {
  let index = arr.length - 1
  let flag = false
  for (let i = 0; i < arr.length; i++) {
    if (flag) {
      break
    }
    for (let j = 0; j <= index; j++) {
      if (arr[i][j] = num) {
        flag = true
        break
      }
      if (arr[i][j] > num) {
        index = j
        break
      }
    }
  }
  return flag
}
/**
 * 输入一个正整数n，是偶数减半，是奇数3n+1减半，如此循环，计算n到1所需的步骤
 */
function getStep (n, step = 0) {
  if (n === 1) return step
  if (n % 2 === 0) {
    n = n / 2
    step++
    return getStep(n, step)
  } else {
    n = (3 * n + 1) / 2
    step++
    return getStep(n, step)
  }
}
/**
 
 */

/**
* 给定两个以字符串形式表示的非负整数 num1 和 num2，返回 num1 和 num2 的乘积，它们的乘积也表示为字符串形式。
* 思路：字符串拆分倒序为数组，用arr1*arr2遍历计算结果，用数组记录每一位的对应结果
* @param {string} num1
* @param {string} num2
* @return {string}
*/
var multiply = function (num1, num2) {
  let arr = [], arr1 = num1.split('').reverse(), arr2 = num2.split('').reverse()
  arr1.forEach((item1, i) => {
    arr2.forEach((item2, j) => {
      let index = i + j //位数,起始位置为0
      let val1 = 0, val2 = 0
      if (item1 * item2 > 9) {
        val1 = (item1 * item2) % 10 //当前位结果
        val2 = parseInt((item1 * item2) / 10)//下一位结果，为0不处理
      } else {
        val1 = item1 * item2
      }
      if (arr[index]) {
        if (arr[index] + val1 > 9) {
          arr[index] = (arr[index] + val1) % 10
          val2 += 1
        } else {
          arr[index] = arr[index] + val1
        }
      } else {
        arr[index] = val1
      }
      if (arr[index + 1]) {
        if (arr[index + 1] + val2 > 9) {
          arr[index + 1] = (arr[index + 1] + val2) % 10
          arr[index + 2] = arr[index + 2] + 1 || 1 //再进一位
        } else {
          arr[index + 1] = arr[index + 1] + val2
        }
      } else {
        arr[index + 1] = val2
      }
    })
  })
  while (arr[arr.length - 1] == 0) arr.pop()
  return arr.reverse().join('') || "0"
};

multiply('2', '456')

/**
 * 计算任何时间时针和分针的夹角
 * 思路：计算时针与分针与12点的夹角，取差值的绝对值
 */
function calcAngle (hour, minutes) {
  let minutesAngle = minutes * (360 / 60)
  let hourAngle = hour * (360 / 12) + minutes * (360 / 12 / 60)
  return Math.abs(minutesAngle - hourAngle)
}

calcAngle(5, 30)

/**
 * js实现一个快排算法
 * 思路：分治法，选定一个基点，拆分为两个数组，小于在左，大于在右，递归直到无法继续拆分
 * @param {Array} arr
 * @returns {Array}
 */
function quickSort (arr) {
  if (arr.length <= 1) return arr
  let point = arr.splice([Math.ceil(arr.length / 2)], 1)[0]
  let left = [], right = []
  arr.forEach(item => {
    item > point ? right.push(item) : left.push(item)
  })
  return quickSort(left).concat(point, quickSort(right))
}

quickSort([5, 6, 3, 4, 7, 9])

// 数据类型判断
// Object.prototype.toString.call('aaa')
// typeof，判断null为object，属于js底层bug
// constructor == String,无法判断null和undefined
// 判断是否为数组，es6的isArray()

// 首先 instanceof 左侧必须是对象, 才能找到它的原型链
// instanceof 右侧必须是函数, 函数才会prototype属性
// 迭代 , 左侧对象的原型不等于右侧的 prototype时, 沿着原型链重新赋值左侧
function myInstanceof(L, R) {
  const baseType = ['string', 'number', 'boolean', 'null', 'undefined', 'symbol', 'bigint']
  if(baseType.includes(L)) return false
  let RP = R.prototype
  L = L.__proto__
  while(true) {
    if (L === null) return false
    if (L === RP) return true
    L = L.__proto__
  }
}

/**
 * 原生ajax请求
 * @param {String} url 
 * @param {String} type 
 */
function ajax (url, type, boolean) {
  let xhr = new XMLHttpRequest()
  xhr.open(type, url, boolean) // 方式，地址，是否异步
  xhr.send()
  xhr.onreadystatechange = () => {
    if (xhr.readyState === 4 && xhr.status === 200) {
      let res = xhr.responseText
      return res
    }
  }
}

/**
 * 手写一个promise
 * 参见地址：https://www.cnblogs.com/Joe-and-Joan/p/11206579.html
 */
class Promise {
  // 构造器
  constructor(executor) {
    // 初始状态
    this.state = 'pedding'
    this.value = undefined
    this.reason = undefined
    this.onResolvedCallback = []
    this.onRejectedCallback = []
    let resolve = (value) => {
      if (this.state === 'pending') {
        this.state = 'fulfilled'
        this.value = value
        this.onResolvedCallback.forEach(fn => fn())
      }
    }
    let reject = (reason) => {
      if (this.state === 'pending') {
        this.state = 'rejected'
        this.reason = reason
        this.onRejectedCallback.forEach(fn => fn())
      }
    }
    try {
      executor(resolve, reject)
    } catch (err) {
      reject(err)
    }
  }
  // then方法，携带两个参数
  then (onFulfilled, onRejected) {
    let promise2 = new Promise((resolve, reject) => {
      if (this.state === 'fulfilled') {
        onFulfilled(this.value)
      }
      if (this.state === 'rejected') {
        onRejected(this.reason)
      }
      if (this.state === 'pending') {
        this.onResolvedCallback.push(() => {
          onFulfilled(this.value)
        })
        this.onRejectedCallback.push(() => {
          onRejected(this.reason)
        })
      }
    })
    return promise2
  }
}


/**
 * 数组乱序（洗牌）
 * 思路：在数组长度范围内，随机生成一个index与当前数索引交换
 * @param {Array} arr 
 */
function shuffle (arr) {
  if (!arr.length || arr.length === 1) return arr
  for (let i = 0; i < arr.length; i++) {
    index = parseInt(Math.random() * (arr.length - i) + i)
    if (index !== i) {
      [arr[i], arr[index]] = [arr[index], arr[i]]
    }
  }
  return arr
}

//for in 和for of的区别
//遍历数组时for in遍历的是数组的字符串索引，for of遍历的是数组的元素值
//遍历对象时for in遍历的是对象的所有可枚举属性，包括原型链上的属性，可加个hasOwnProperty判断剔除原型链上属性，而for of不会

/**
 * 实现add(1)(2)(3),函数柯里化
 * 函数柯里化概念： 柯里化（Currying）是把接受多个参数的函数转变为接受一个单一参数的函数，并且返回接受余下的参数且返回结果的新函数的技术。
 */
function currying () {
  let args = [...arguments]
  temp.getValue = () => {
    return args.reduce((a, b) => a + b, 0)
  }
  function temp (...arg) {
    if (arg.length) {
      args = [...args, ...arg]
      return temp
    }
  }
  return temp
}

currying(1)(2)(3)()


/**
 * 深拷贝对象，可以正确序列化日期
 * @param {*} obj
 */
function deepClone (obj) {
  let objClone = Array.isArray(obj) ? [] : {}
  if (obj && typeof obj === 'object') {
    for (let key in obj) {
      if (obj.hasOwnProperty(key)) {
        // 判断ojb子元素是否为对象，如果是，递归复制
        if (obj[key] && typeof obj[key] === 'object') {
          // 深拷贝日期类型
          if (obj[key] instanceof Date) {
            objClone[key] = new Date(obj[key].valueOf())
            // console.log('deepClone', objClone[key])
          } else {
            objClone[key] = DEEP_CLONE(obj[key])
          }
        } else {
          // 如果不是，简单复制
          objClone[key] = obj[key]
        }
      }
    }
  }
  return objClone
}

// 利用filter去重
function unique4(arr) {
  return arr.filter(function (item, index, arr) {
    //当前元素，在原始数组中的第一个索引==当前索引值，否则返回当前元素
    return arr.indexOf(item, 0) === index;
  });
}

const arr = [1, '1', '1', 'NaN',NaN,'NaN', {a: 1}, '{a: 1}', {a: 1}]
unique4(arr)

// 各类设计模式简介
// 单例模式
// 一个类只能构造出唯一实例
// Redux/Vuex的store

// 工厂模式
// 对创建对象逻辑的封装
// jQuery的$(selector)
function createPerson (name, age, sex) {
  let obj = new Object()
  obj.name = name
  obj.age = age
  obj.sex = sex
  obj.getMessage = function () {
    console.log(this.obj)
  }
  return obj
}
let person1 = createPerson('张三', 23, '男')
// 观察者模式
// 当一个对象被修改时，会自动通知它的依赖对象
// Redux的subscribe、Vue的双向绑定

// 装饰器模式
// 对类的包装，动态地拓展类的功能
// React高阶组件、ES7 装饰器

// 适配器模式
// 兼容新旧接口，对类的包装
// 封装旧API

// 代理模式
// 控制对象的访问
// 事件代理、ES6的Proxy

// git和svn的区别
// git是分布式的，svn不是

// 为什么组件的data必须是一个函数
// 一个组件可能在很多地方使用，也就是会创建很多个实例，
// 如果data是一个对象的话，对象是引用类型，一个实例修改了data会影响到其他实例，所以data必须使用函数，为每一个实例创建一个属于自己的data，使其同一个组件的不同实例互不影响。

// 除了 v-for， 在使用 Vue-router 做项目时，会遇到如 /path/:id 这样只改变 id 号的场景，但渲染不同的组件。由于 router-view 是复用的，单纯的改变 id 号并不会刷新 router-view，这并不是我们所期望的结果
// 这个时候，我们可以给每个 router-view 添加一个不相同 key 值，让 Vue 每次切换路由参数的时候，认为是不同的组件，从而得到更新

// 父子组件传值的方法
// props，emit
// provide，inject
// this.$refs.parent,this.$refs.child
//vueBus
// vuex
// v-bind="$attrs":接收父作用域 prop 被识别 (且获取) 的特性绑定，包含了父作用域中的 (不含 .native 修饰器的) v-on 事件监听器。它可以通过v-on="$listeners"传入内部组件

// 将字符串转为一个可执行函数
// eval（）
export const evil = (fn) => {
  const Fn = Function // 一个变量指向Function，防止有些前端编译工具报错
  return new Fn('return ' + fn)()
}

// 获取特定范围内的随机数
let a = Math.floor(Math.random() * (max - min + 1) + min)

/**
 * 洗牌算法
 * 思路：在数组长度范围内，随机生成一个index与当前数索引交换
 * @param {Array} arr 
 */
function shuffle (arr) {
  if (!arr.length || arr.length === 1) return arr
  for (let i = 0; i < arr.length; i++) {
    index = parseInt(Math.random() * (arr.length - i) + i)
    if (index !== i) {
      [arr[i], arr[index]] = [arr[index], arr[i]]
    }
  }
  return arr
}

/**
 * 冒泡排序
 * 思路：遍历数组，如当前数大于/小于后一位，则交换，一轮遍历出一个最大/最小值,直到结束
 * @param {Array} arr 
 */
function bubble (arr) {
  if (!arr.length || arr.length === 1) return arr
  for(let i = 1; i < arr.length; i++) {
    let flag = true //优化判断，没有交换跳出循环
    for (let j = 0; j < arr.length - i; j++) {
      if (arr[j] > arr[j + 1]) {
        flag = false
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]]
      }
    }
    if (flag) break
  }
  return arr
}


// 数组取并集交集补集差集
const arr1 = [1,2,3,4,5], arr2 = [5,6,7,8,9], _arr1Set = new Set(arr1), _arr2Set = new Set(arr2);
// 交集
let intersection = arr1.filter(item => _arr2Set.has(item))
// 并集
let union = Array.from(new Set([...arr1, ...arr2]))
// 补集 两个数组各自没有的集合
let complement = [...arr1.filter(item => !_arr2Set.has(item)), ...arr2.filter(item => !_arr1Set.has(item))]
// 差集 数组arr1相对于arr2所没有的
let diff = arr1.filter(item => !_arr2Set.has(item))
console.log('arr1: ', arr1);
console.log('arr2: ', arr2);
console.log('交集', intersection);
console.log('并集', union);
console.log('补集', complement);
console.log('差集', diff);

// 实现一个事件触发器，包含简单的事件注册、触发及销毁
class eventEmiter {
  constructor () {
    this.events = {}
    // this.events = {
    //   test: [
    //     (data) => {
    //       console.log(data)
    //     },
    //     data => data * data
    //   ]
    // }
  }
  on (name, fn) {
    if (this.events[name]) {
      this.events[name].push(fn)
    } else {
      this.events[name] = [fn]
    }
  }
  emit (name, ...args) {
    if (this.events[name]) {
      this.events[name].forEach(item => {
        item.call(this, ...args)
      })
    } else {
      console.log('请先注册该事件！')
    }
  }
  remove (name) {
    delete this.events[name]
  }
}
let myEvent = new eventEmiter()
myEvent.on('getData', data => {
  console.log(data)
})
myEvent.emit('getData', 22)

// 字段过滤的一种方法
let a = {q: 1, w: 2, e: 3}
b = JSON.parse(JSON.stringify(a, ['q']))
// b = {q: 1}