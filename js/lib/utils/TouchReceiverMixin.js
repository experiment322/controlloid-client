export default (superclass) =>
  class TouchReceiverMixin extends superclass {
    isTouchReceiver = true;

    onTouchDown() {
      throw new Error(`${this.constructor.name}: ${this.onTouchDown.name} is not implemented.`);
    }

    onTouchMove() {
      throw new Error(`${this.constructor.name}: ${this.onTouchMove.name} is not implemented.`);
    }

    onTouchUp() {
      throw new Error(`${this.constructor.name}: ${this.onTouchUp.name} is not implemented.`);
    }
  };
