/*
 *
 * Table reducer
 *
 */

import { fromJS } from 'immutable';

import {
  SHOW_DIALOG,
  HIDE_DIALOG,
  CREATE_TABLE_SUCCESS,
  SET_TABLE_PENDING_DELETE,
  DELETE_TABLE_SUCCESS,
  LOAD_TABLE_LIST,
  LOAD_TABLE_LIST_SUCCESS,
  LOAD_TABLE_RECORDS,
  LOAD_TABLE_RECORDS_SUCCESS,
  LOAD_MORE_TABLE_RECORDS,
  LOAD_MORE_TABLE_RECORDS_SUCCESS,
  SAVE_TABLE_RECORDS,
  SAVE_TABLE_RECORDS_SUCCESS,
  ADD_TABLE_FIELD,
  SET_FIELD_PENDING_REMOVE,
  ISSUE_TOKEN_SUCCESS,
  REVOKE_TOKEN_SUCCESS,
  RENAME_TABLE,
  UPDATE_CACHE,
  SET_TOKEN_WRITABILITY,
  SET_TOKEN_FOR_DETAIL,
  EXPORT_CSV,
  EXPORT_CSV_SUCCESS,
} from './constants';

const initialState = fromJS({
  dialog: {
    createTable: false,
    deleteTable: false,
    addField: false,
    removeField: false,
    getEndPoint: false,
    endPointDetail: false,
    renameTable: false,
    preview: false,
    export: false,
  },
  list: [],
  page: 1,
  hasMore: true,
  data: {
    name: 'Loading ...',
    page: 1,
    hasMore: false,
    records: [],
    recordCount: 0,
  },
  loading: true,
  saving: false,
  pendingDeleteTable: false,
  pendingRemoveField: [],
  cache: {
    changes: {},
    createdRecords: {},
    deletedRecords: [],
  },
  tokenForDetail: {
    token: '',
    writable: false,
  },
  exportData: [],
});

function tableReducer(state = initialState, action) {
  switch (action.type) {
    case SHOW_DIALOG:
      return state
        .setIn(['dialog', action.payload.name], true);
    case HIDE_DIALOG:
      return state
        .setIn(['dialog', action.payload.name], false);
    case CREATE_TABLE_SUCCESS:
      return state
        .updateIn(['list'], (list) => list.unshift(fromJS(action.payload.table)));
    case SET_TABLE_PENDING_DELETE:
      return state
        .set('pendingDeleteTable', fromJS(action.payload));
    case DELETE_TABLE_SUCCESS:
      return state
        .set('pendingDeleteTable', false)
        .updateIn(['list'], (list) => list.filter((table) => table.get('id') !== action.payload.id));
    case LOAD_TABLE_LIST:
      return state
        .set('page', action.payload.page)
        .updateIn(['list'], (list) => list.filter(() => action.payload.page !== 1))
        .set('loading', true);
    case LOAD_TABLE_LIST_SUCCESS:
      return state
        .set('loading', false)
        .set('hasMore', action.payload.hasMore)
        .updateIn(['list'], (list) => list.concat(fromJS(action.payload.list)));
    case LOAD_TABLE_RECORDS:
      return state
        .set('loading', true)
        .setIn(['data', 'page'], 1);
    case LOAD_TABLE_RECORDS_SUCCESS:
      return state
        .set('loading', false)
        .set('data', fromJS({
          id: action.payload.id,
          name: action.payload.name,
          fields: action.payload.fields,
          records: action.payload.records,
          tokens: action.payload.tokens,
          updatedAt: action.payload.updatedAt,
          page: state.getIn(['data', 'page']),
          hasMore: action.payload.hasMore,
          recordCount: action.payload.recordCount,
        }));
    case LOAD_MORE_TABLE_RECORDS:
      return state
        .set('loading', true)
        .setIn(['data', 'page'], action.payload.page);
    case LOAD_MORE_TABLE_RECORDS_SUCCESS:
      return state
        .set('loading', false)
        .updateIn(['data', 'records'], (records) => (state.getIn(['data', 'page']) === 1) ? fromJS(action.payload.records) : records.concat(fromJS(action.payload.records)))
        .setIn(['data', 'hasMore'], action.payload.hasMore)
        .setIn(['data', 'recordCount'], action.payload.recordCount);
    case SAVE_TABLE_RECORDS:
      return state
        .set('saving', true);
    case SAVE_TABLE_RECORDS_SUCCESS:
      return state
        .setIn(['data', 'updatedAt'], fromJS(new Date()))
        .set('saving', false);
    case ADD_TABLE_FIELD:
      return state
        .updateIn(['data', 'fields'], (fields) => fields.push(fromJS({
          name: action.payload.name,
          type: action.payload.type,
          allowEmpty: action.payload.allowEmpty,
          data: action.payload.data,
        })));
    case SET_FIELD_PENDING_REMOVE:
      return state
        .set('pendingRemoveField', fromJS(action.payload.fieldNames));
    case ISSUE_TOKEN_SUCCESS:
      return state
        .updateIn(['data', 'tokens'], (tokens) => tokens.unshift(fromJS({ token: action.payload.token, writable: false })));
    case REVOKE_TOKEN_SUCCESS:
      return state
        .updateIn(['data', 'tokens'], (tokens) => tokens.filter((token) => token.get('token') !== action.payload.token));
    case RENAME_TABLE:
      return state
        .setIn(['data', 'name'], action.payload.name);
    case UPDATE_CACHE:
      return state
        .set('cache', fromJS(action.payload.cache));
    case SET_TOKEN_WRITABILITY:
      return state
        .updateIn(['data', 'tokens'], (tokens) => tokens.map((token) => ((token.get('token') === action.payload.token) ? fromJS(action.payload) : token)));
    case SET_TOKEN_FOR_DETAIL:
      return state
        .set('tokenForDetail', fromJS(action.payload));
    case EXPORT_CSV:
      return state
        .set('loading', true);
    case EXPORT_CSV_SUCCESS:
      return state
        .set('exportData', fromJS(action.payload.exportData))
        .set('loading', false);
    default:
      return state;
  }
}

export default tableReducer;
