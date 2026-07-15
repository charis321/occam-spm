export const ATTENDANCE_MAP = {
  0: {
    title: '未點名',
    color: 'grey',
    class: 'unrollcall',
  },
  1: {
    title: '點名中',
    color: 'green',
    class: 'rollcalling',
  },
  2: {
    title: '已點名',
    color: 'blue',
    class: 'rollcalled',
  },
};
export const ATTENDANCE_STATUS_MAP = {
  0: {
    title: '點名尚未開始',
  },
  1: {
    title: '點名進行中...',
  },
  2: {
    title: '點名已結束',
  },
};

export const ROLLCALL_MAP = {
  0: {
    title: '點名尚未開始',
    color: 'blue',
    bg: 'gray',
    class: 'unrollcall',
  },
  1: {
    title: '點名進行中...',
    color: 'green',
    bg: '#fff',
    class: 'rollcalling',
  },
  2: {
    title: '點名已結束',
    color: 'red',
    bg: '#fff',
    class: 'rollcalled',
  },
};
