import { alertConstants, walletConstants } from '../../constants';

export const alertActions = {
  request,
  success,
  error,
  clear
}

function request(message) {
  return {type: alertConstants.REQUEST, message};
}

function success(message) {
  return {type: alertConstants.SUCCESS, message};
}

function error(message) {
  return {type: alertConstants.ERROR, message};
}

function clear() {
  return {type: alertConstants.CLEAR};
}
