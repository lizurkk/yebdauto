/// <reference types="react" />

import type * as React from 'react';

declare global {
  namespace JSX {
    type Element = React.ReactElement;
    type ElementClass = React.Component<any, any>;
    interface IntrinsicAttributes extends React.Attributes {}
    interface IntrinsicElements {
      [elemName: string]: any;
    }
    interface ElementChildrenAttribute {
      children: {};
    }
  }
}
