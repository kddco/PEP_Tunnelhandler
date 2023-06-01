// 创建全局哈希表对象
global.myHashMap = {};

// 设置键值对
global.myHashMap['key1'] = {
  name: 'John',
  displayName: 'John Doe',
  token: 'xyz123'
};

global.myHashMap['key2'] = {
  name: 'Jane',
  displayName: 'Jane Smith',
  token: 'abc456'
};

// 删除键值对
delete global.myHashMap['key2'];

console.log(global.myHashMap); // 输出: { key1: { name: 'John', displayName: 'John Doe', token: 'xyz123' } }
