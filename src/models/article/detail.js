import modelExtend from 'dva-model-extend'
import { model } from 'models'
import { article } from 'services'
import pathToRegexp from 'path-to-regexp'

const { query } = article

export default modelExtend(model, {
  namespace: 'articleDetail',
  state: {
    current: 0,
    title: '',
    body: '',
    createTime: '',
  },

  subscriptions: {
    setup({ dispatch, history }) {
      history.listen((location) => {
        const match = pathToRegexp('/platform/:platform/article/:id').exec(location.pathname)
        if (match) {
          const platform = match[1]

          dispatch({
            type: 'updateState',
            payload: {
              platform,
            },
          })

          dispatch({
            type: 'preQuery',
            payload: {
              platform,
              id: match[2],
            },
          })
        }
      })
    },
  },

  effects: {
    *preQuery({
      payload,
    }, { put, select }) {
      const { current } = yield select(_ => _.articleDetail)
      if (current !== payload.id) {
        window.scrollTo(0, 0)
        yield put({
          type: 'query',
          payload,
        })
      }
    },

    *query({
    payload,
  }, { call, put }) {
      const result = yield call(query, payload)
      const { success, data } = result
      if (success) {
        yield put({
          type: 'updateState',
          payload: {
            ...data,
            createTime: new Date(data.createTime).format('MM月dd日  hh:mm'),
          },
        })
      } else {
        result.type = 'queryArticle'
        throw result
      }
    },
  },
})
