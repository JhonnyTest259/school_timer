class RingControl {
  constructor() {
    this.moduleUid = "";
    this.isRinging = false;
    this.isUpdated = false;
  }

  get module() {
    return this.moduleUid;
  }
  get isRingingState() {
    return this.isRinging;
  }
  get isUpdatedNow() {
    return this.isUpdated;
  }
  updateIsRingingState(state) {
    this.isRinging = state;
  }

  update(state) {
    this.isUpdated = state;
  }

  setValueToModule(value) {
    this.moduleUid = value;
  }
}

module.exports = RingControl;
