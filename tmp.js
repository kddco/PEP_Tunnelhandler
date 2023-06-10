const myMap = new Map();

myMap.set('age', 30);
console.log(myMap.get('age'))
// 更新已存在的键的值
myMap.set('age', 31);
console.log(myMap.get('age'))