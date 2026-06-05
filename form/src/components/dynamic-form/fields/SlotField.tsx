import { memo } from 'react';

function SlotField({ render, ...extraProps }: { render?: Function }) {
  return render?.(extraProps);
}

export default memo(SlotField);
