/* global location */
/* eslint no-restricted-globals: ["off", "location"] */
export const ORIGIN_NAME = 'http://test.gemii.cc:58080'
export const SUB_API_PATH = '/lizcloud/api'
export const SUB_WS_PATH = '/lizcloud/ws'
export const WS_NAME = (location.protocol =='https:'?'wss://':'ws://')+ORIGIN_NAME+SUB_WS_PATH
export const API_PATH = location.protocol+'//'+ORIGIN_NAME+ SUB_API_PATH
export const GD_PATH = location.protocol+'//'+ORIGIN_NAME+'/skui/GDScope/'