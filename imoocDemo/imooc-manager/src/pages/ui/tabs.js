import React , { Component } from 'react';
import { Card, Button, Tabs, Icon } from 'antd';

const { TabPane } = Tabs;

export default class TabsDemo extends Component {
  
  constructor() {
    super();
    const pane = [
      { title: 'Tab 1', content: 'Content of Tab 1', key: '1' },
      { title: 'Tab 2', content: 'Content of Tab 2', key: '2' },
      { title: 'Tab 3', content: 'Content of Tab 3', key: '3', closable: false },
    ];
    this.state = {
      pane,
      activeKey: pane[0].key,
    };
  }
  handleChange = (activeKey) => {
    console.log('handleChange', activeKey);
    this.setState({ activeKey });
  }
  handleEdit = (targetKey, action) => {
    this[action](targetKey);
  }
  add = () => {
    const panes = this.state.pane || [];
    const activeKey = (+panes[panes.length - 1].key + 1 + '') || '0';
    panes.push({ title: `Tab ${activeKey}`, content: `Content of Tab ${activeKey}`, key: activeKey });
    this.setState({
      pane: panes,
      activeKey,
    });
  }
  remove = (targetKey) => {
    /**
     * 思路：当关闭的是正被选中的tab标签时，就往后退， 而其他的被关闭的时候，key可以保持不变，数组发生变化，效果就形成了
     */
    let activeKey = this.state.activeKey;
    let lastIndex;
    this.state.pane.forEach((pane, i) => {
      if (pane.key === targetKey) {
        lastIndex = i - 1;
      }
    });
    const panes = this.state.pane.filter(pane => pane.key !== targetKey);
    console.log('panes', panes);
    //当选择tab被关闭的进行判断
    if(panes.length && activeKey === targetKey) {
      if (lastIndex >= 0) {
        activeKey = panes[lastIndex].key;
      } else {
        activeKey = panes[0].key;
      }
    }
    this.setState({ pane: panes, activeKey });
  }
  render() {
    return (
      <div>
        <Card title="基本tabs标签" className="card-warp">
          <Tabs>
            <TabPane tab="Tab 1" key="1">
              <div>
                Content Demo Show
              </div>
            </TabPane>
            <TabPane tab="Tab 2" key="2">
              <div>
                Content Demo Show
              </div>
            </TabPane>
            <TabPane tab="Tab 3" key="3">
              <div>
                Content Demo Show
              </div>
            </TabPane>
          </Tabs>
        </Card>
        <Card title="带图标tabs标签" className="card-warp">
          <Tabs>
            <TabPane tab={<span><Icon type="plus" />好吃</span>} key='1'>
              超级超级好吃
            </TabPane>
            <TabPane tab={<span><Icon type="edit"/>饮料</span>} key='2'>
              可以编辑的饮料
            </TabPane>
            <TabPane tab={<span><Icon type="cloud"/>食物</span>} key='3'>
              不能吃~
            </TabPane>
          </Tabs>
        </Card>
        <Card title="动态tabs标签" className="card-warp">
          <Tabs
            activeKey={this.state.activeKey}
            type="editable-card"
            onChange={this.handleChange}
            onEdit={this.handleEdit}
          >
            {
              this.state.pane.map(item => 
                <TabPane tab={item.title} key={item.key} closable={item.closable}>
                  {item.content}
                </TabPane>
              )
            }
          </Tabs>
        </Card>
      </div>
    );
  }
}