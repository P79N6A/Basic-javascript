const mapTest = new Map();
mapTest.set(Symbol.for('a'), { test: 'hello map' });
console.log('has - ', mapTest.has(Symbol.for('a')));
console.log('get - ', mapTest.get(Symbol.for('a')));
mapTest.set('1', [1,2,3]);
mapTest.delete(Symbol.for('a'));
console.log('map - ', mapTest);
mapTest.clear();
console.log('map - ', mapTest);