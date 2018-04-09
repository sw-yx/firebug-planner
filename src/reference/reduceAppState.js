const slug = () =>
  Math.random()
    .toString(32)
    .substring(2, 7);

const cleanUpState = state => {
  let cleanUpRoutine = routine => {
    if (!routine.completed) {
      routine.completed = {};
    }
  };

  if (state.backlog == null) state.backlog = [];
  if (state.logs == null) state.logs = [];
  if (state.weeklyRoutines == null) state.weeklyRoutines = [];
  if (state.monthlyRoutines == null) state.monthlyRoutines = [];

  state.weeklyRoutines.forEach(cleanUpRoutine);
  state.monthlyRoutines.forEach(cleanUpRoutine);
};

export default (state, action) => {
  if (action.type === "HOLY_CRAP") {
    return { ...action.state, key: slug() };
  }

  if (action.type === "FIREBASE_CHANGE") {
    if (action.state != null) {
      cleanUpState(action.state);
      return { ...action.state, key: slug() };
    } else {
      return state;
    }
  }

  if (action.type === "ADD_NOTE") {
    let notes = state.logs.slice(0);
    let index = action.fromNote ? notes.indexOf(action.fromNote) + 1 : notes.length;
    notes.splice(index, 0, {
      content: "",
      id: slug(),
      created: Date.now(),
      day: action.dayKey,
      todo: false,
      completed: null
    });
    return {
      ...state,
      logs: notes
    };
  }

  if (action.type === "ADD_TODO") {
    let notes = state.logs.slice(0);
    let index = action.fromNote ? notes.indexOf(action.fromNote) + 1 : notes.length;
    notes.splice(index, 0, {
      content: "",
      id: slug(),
      created: Date.now(),
      day: action.dayKey,
      todo: true,
      completed: false
    });
    return {
      ...state,
      logs: notes
    };
  }

  if (action.type === "REMOVE_NOTE") {
    return {
      ...state,
      logs: state.logs.filter(alleged => alleged.id !== action.note.id)
    };
  }

  if (action.type === "UPDATE_NOTE") {
    return {
      ...state,
      logs: state.logs.map(note => {
        if (note.id === action.note.id) {
          return Object.assign({}, note, action.updates);
        } else {
          return note;
        }
      })
    };
  }

  if (action.type === "ADD_BACKLOG_NOTE") {
    let notes = state.backlog.slice(0);
    let index = action.fromNote ? notes.indexOf(action.fromNote) + 1 : notes.length;
    notes.splice(index, 0, {
      id: slug(),
      created: Date.now(),
      todo: true,
      completed: false
    });
    return {
      ...state,
      backlog: notes
    };
  }

  if (action.type === "COMPLETE_CHANGE_BACKLOG_NOTE") {
    return {
      ...state,
      backlog: state.backlog.map(note => {
        if (note.id === action.note.id) {
          return { ...note, completed: action.completed };
        } else {
          return note;
        }
      })
    };
  }

  if (action.type === "UPDATE_BACKLOG_NOTE") {
    return {
      ...state,
      backlog: state.backlog.map(note => {
        if (note.id === action.note.id) {
          return { ...note, ...action.updates };
        } else {
          return note;
        }
      })
    };
  }

  if (action.type === "REMOVE_BACKLOG_NOTE") {
    return {
      ...state,
      backlog: state.backlog.filter(note => note.id !== action.note.id)
    };
  }

  if (action.type === "MOVE_NOTE_TO_DAY") {
    return {
      ...state,
      backlog: state.backlog.filter(note => note.id !== action.note.id),
      logs: state.logs.concat([{ ...action.note, day: action.day }])
    };
  }

  if (action.type === "MOVE_NOTE_TO_BACKLOG") {
    return {
      ...state,
      logs: state.logs.filter(note => note.id !== action.note.id),
      backlog: state.backlog.concat([{ ...action.note, day: null }])
    };
  }

  if (action.type === "TOGGLE_WEEKLY_ROUTINE") {
    return {
      ...state,
      weeklyRoutines: state.weeklyRoutines.map(routine => {
        if (routine === action.routine) {
          let newRoutine = { ...routine };
          if (!newRoutine.completed[action.weekKey]) {
            newRoutine.completed[action.weekKey] = [];
          }
          newRoutine.completed[action.weekKey][action.index] = action.completed;
          return newRoutine;
        } else {
          return routine;
        }
      })
    };
  }

  if (action.type === "TOGGLE_MONTHLY_ROUTINE") {
    return {
      ...state,
      monthlyRoutines: state.monthlyRoutines.map(routine => {
        if (routine === action.routine) {
          let newRoutine = { ...routine };
          if (!newRoutine.completed[action.monthKey]) {
            newRoutine.completed[action.monthKey] = [];
          }
          newRoutine.completed[action.monthKey][action.index] = action.completed;
          return newRoutine;
        } else {
          return routine;
        }
      })
    };
  }

  if (action.type === "ADD_WEEKLY_ROUTINE") {
    let routines = state.weeklyRoutines.slice(0);
    let index = action.fromRoutine ? routines.indexOf(action.fromRoutine) + 1 : routines.length;
    routines.splice(index, 0, {
      id: slug(),
      created: Date.now(),
      title: "",
      frequency: 2,
      completed: {}
    });
    return {
      ...state,
      weeklyRoutines: routines
    };
  }

  if (action.type === "ADD_MONTHLY_ROUTINE") {
    let routines = state.monthlyRoutines.slice(0);
    let index = action.fromRoutine ? routines.indexOf(action.fromRoutine) + 1 : routines.length;
    routines.splice(index, 0, {
      id: slug(),
      created: Date.now(),
      title: "",
      frequency: 2,
      completed: {}
    });
    return {
      ...state,
      monthlyRoutines: routines
    };
  }

  if (action.type === "UPDATE_MONTHLY_ROUTINE") {
    return {
      ...state,
      monthlyRoutines: state.monthlyRoutines.map(routine => {
        if (routine === action.routine) {
          return Object.assign({}, routine, action.updates);
        } else {
          return routine;
        }
      })
    };
  }

  if (action.type === "UPDATE_WEEKLY_ROUTINE") {
    return {
      ...state,
      weeklyRoutines: state.weeklyRoutines.map(routine => {
        if (routine === action.routine) {
          return Object.assign({}, routine, action.updates);
        } else {
          return routine;
        }
      })
    };
  }

  if (action.type === "DELETE_MONTHLY_ROUTINE") {
    return {
      ...state,
      monthlyRoutines: state.monthlyRoutines.filter(routine => routine.id !== action.routine.id)
    };
  }

  if (action.type === "DELETE_WEEKLY_ROUTINE") {
    return {
      ...state,
      weeklyRoutines: state.weeklyRoutines.filter(routine => routine !== action.routine)
    };
  }

  if (action.type === "INCREASE_WEEKLY_ROUTINE_FREQUENCY") {
    return {
      ...state,
      weeklyRoutines: state.weeklyRoutines.map(routine => {
        if (routine === action.routine) {
          return { ...routine, frequency: routine.frequency + 1 };
        } else {
          return routine;
        }
      })
    };
  }

  if (action.type === "INCREASE_MONTHLY_ROUTINE_FREQUENCY") {
    return {
      ...state,
      monthlyRoutines: state.monthlyRoutines.map(routine => {
        if (routine === action.routine) {
          return { ...routine, frequency: routine.frequency + 1 };
        } else {
          return routine;
        }
      })
    };
  }

  if (action.type === "DECREASE_WEEKLY_ROUTINE_FREQUENCY") {
    return {
      ...state,
      weeklyRoutines: state.weeklyRoutines.map(routine => {
        if (routine === action.routine) {
          return { ...routine, frequency: routine.frequency - 1 };
        } else {
          return routine;
        }
      })
    };
  }

  if (action.type === "DECREASE_MONTHLY_ROUTINE_FREQUENCY") {
    return {
      ...state,
      monthlyRoutines: state.monthlyRoutines.map(routine => {
        if (routine === action.routine) {
          return { ...routine, frequency: routine.frequency - 1 };
        } else {
          return routine;
        }
      })
    };
  }

  return state;
};
