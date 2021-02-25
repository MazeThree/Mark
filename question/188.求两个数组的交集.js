// Problem: 求两个数组的交集
const firstArray = [2, 2, 4, 1];
const secondArray = [1, 2, 0, 2];
intersection(firstArray, secondArray);
实现intersection函数
// @interview start

```javascript
intersection(firstArray, secondArray) {
  return firstArray.filter(item => secondArray.has(item))
}
```

// @interview end
