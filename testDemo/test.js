

//如果数据中的字段多可以先进行过滤，留下需要的字段就行
function filterData(data) {
  const newData = [];
  data.forEach(item => {
    const para = {
      id: item.id,
      name: item.name,
      parentId: item.parentId
    };
    if (!item.parentId) {
      delete para.parentId
    }
    newData.push(para);
  });
  return newData;
}

//如果数据中字段不多，直接使用下面的方法
// data是数组对象, 可以直接将后台返回的数据放进去
function translateDataToTree(data) {
  // 没有父节点的数据
  let parents = data.filter(value => value.parentId == 'undefined' || value.parentId == null || value.parentId == '');
  // 有父节点的数据
  let children = data.filter(value => value.parentId !== 'undefined' && value.parentId != null || value.parentId != '');
  let translator = (parents, children) => {
    parents.forEach((parent) => {
      children.forEach((current, index) => {
        if (current.parentId === parent.id) {
          let temp = JSON.parse(JSON.stringify(children))
          temp.splice(index, 1)
          translator([current], temp)
          typeof parent.children !== 'undefined' ? parent.children.push(current) : parent.children = [current]
        }
      })
    })
  }
  // 调用转换方法
  translator(parents, children)
  // 返回最终的结果 
  return parents;
};