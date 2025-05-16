type Callback = (action: Action) => void;

export interface Action {
  type: string;
  payload?: any;
}

class Dispatcher {
  private callbacks: Callback[] = [];

  register(callback: Callback) {
    this.callbacks.push(callback);
  }

  dispatch(action: Action) {
    for (const cb of this.callbacks) {
      cb(action);
    }
  }
}

export default new Dispatcher();
