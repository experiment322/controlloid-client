export default superclass => class extends superclass {
  isTouchReceiver = true;

  // eslint-disable-next-line no-unused-vars, class-methods-use-this
  onTouchDown(id) {
    throw new Error('TouchReceiverMixin: onTouchDown is not implemented.');
  }

  // eslint-disable-next-line no-unused-vars, class-methods-use-this
  onTouchMove(touch) {
    throw new Error('TouchReceiverMixin: onTouchMove is not implemented.');
  }

  // eslint-disable-next-line no-unused-vars, class-methods-use-this
  onTouchUp(id) {
    throw new Error('TouchReceiverMixin: onTouchUp is not implemented.');
  }
};
