import React, { PureComponent } from 'react';
import * as PopperJS from 'popper.js';
import { Manager, Popper as ReactPopper, PopperArrowProps } from 'react-popper';
import { Portal } from '@grafana/ui';
import Transition from 'react-transition-group/Transition';
import { PopperContent } from './PopperController';

const defaultTransitionStyles = {
  transition: 'opacity 200ms linear',
  opacity: 0,
};

const transitionStyles: { [key: string]: object } = {
  exited: { opacity: 0 },
  entering: { opacity: 0 },
  entered: { opacity: 1, transitionDelay: '0s' },
  exiting: { opacity: 0, transitionDelay: '500ms' },
};

export type RenderPopperArrowFn = (
  props: {
    arrowProps: PopperArrowProps;
    placement: string;
  }
) => JSX.Element;

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  show: boolean;
  placement?: PopperJS.Placement;
  content: PopperContent<any>;
  referenceElement: PopperJS.ReferenceObject;
  wrapperClassName?: string;
  renderArrow?: RenderPopperArrowFn;
}

class Popper extends PureComponent<Props> {
  render() {
    const { show, placement, onMouseEnter, onMouseLeave, className, wrapperClassName, renderArrow } = this.props;
    const { content } = this.props;

    return (
      <Manager>
        <Transition in={show} timeout={100} mountOnEnter={true} unmountOnExit={true}>
          {transitionState => {
            return (
              <Portal>
                <ReactPopper
                  placement={placement}
                  referenceElement={this.props.referenceElement}
                  // TODO: move modifiers config to popper controller
                  modifiers={{ preventOverflow: { enabled: true, boundariesElement: 'window' } }}
                >
                  {({ ref, style, placement, arrowProps, scheduleUpdate }) => {
                    return (
                      <div
                        onMouseEnter={onMouseEnter}
                        onMouseLeave={onMouseLeave}
                        ref={ref}
                        style={{
                          ...style,
                          ...defaultTransitionStyles,
                          ...transitionStyles[transitionState],
                        }}
                        data-placement={placement}
                        className={`${wrapperClassName}`}
                      >
                        <div className={className}>
                          {typeof content === 'string'
                            ? content
                            : React.cloneElement(content, {
                                updatePopperPosition: scheduleUpdate,
                              })}
                          {renderArrow &&
                            renderArrow({
                              arrowProps,
                              placement,
                            })}
                        </div>
                      </div>
                    );
                  }}
                </ReactPopper>
              </Portal>
            );
          }}
        </Transition>
      </Manager>
    );
  }
}

export default Popper;
