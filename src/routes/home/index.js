// import { Tabs } from 'antd-mobile'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import {Tabs, Tab} from 'material-ui/Tabs'
import React from 'react'
import { connect } from 'dva'
import styles from './index.less'
import { ListView } from 'components'
import { listViewProps } from 'utils'

// const { TabPane } = Tabs

const Home = ({ loading, dispatch, location, home }) => {
  const { list, pagination } = home
  const { limit, offset, total } = pagination
  const { query } = location

  const renderRow = (item, sectionID, index) => {
    return (
      <section key={index} className={styles.item}>
        <div className={styles.main}>
          <div className={styles.maintext}>
            <h3 className={styles.title}>{item.title}</h3>
            <summary className={styles.summary}>{item.summary}</summary>
          </div>
          <div>
            <img className={styles.banner} src={item.banner}/>
          </div>
        </div>
        <div className={styles.date}>{item.createTime}</div>
      </section>
    )
  }

  const listProps = listViewProps({
    dataSource: list,
    hasMore: offset + limit < total,
    loading: loading.models['home/query'],
    emptyContent: '暂无',
    renderRow,
    onScroll() {
      dispatch({
        type: 'home/query',
        payload: {
          offset: offset + limit,
          limit,
          ...query,
        },
      })
    },
  })

  return (
    <MuiThemeProvider>
      <div className={styles.home}>
      <Tabs>
        {
          Array.from({length:3}).map((item,key) => (
            <Tab label={`选项${key}`} key={key}>
              <ListView {...listProps} />
            </Tab>
          ))
        }
      </Tabs>
      </div>
    </MuiThemeProvider>
  )
}

export default connect(({ home, loading }) => ({ home, loading }))(Home)