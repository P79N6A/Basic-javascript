let set = new Set([1, 2, 3, 4, 5, 6, 7]);
console.log('set-size ', set.size);
set.add({ test: 'hello set' });
console.log('add - ', set);
set.delete(1);
console.log('delete - ', set);
set.has(3);
console.log('has - ', set);
console.log('keys - ', set.keys());
console.log('values - ', set.values());
console.log('entries - ', set.entries());
set.forEach(item => {
  console.log(`forEach -- ${item}`);
});