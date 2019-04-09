import {def, ref, type, numberType, objectType, stringType} from './util';

import autosize from './autosize';
import axis from './axis';
import background from './background';
import bind from './bind';
import data from './data';
import encode from './encode';
import expr from './expr';
import layout from './layout';
import legend from './legend';
import mark from './mark';
import marktype from './marktype';
import onEvents from './on-events';
import onTrigger from './on-trigger';
import padding from './padding';
import projection from './projection';
import scale from './scale';
import scope from './scope';
import selector from './selector';
import signal from './signal';
import source from './source';
import stream from './stream';
import title from './title';
import transform from './transform';

function extend(target, source) {
  for (var key in source) {
    target[key] = source[key];
  }
}

function addModule(schema, module) {
  if (module.refs) extend(schema.refs, module.refs);
  if (module.defs) extend(schema.defs, module.defs);
}

export default function(definitions) {
  var schema = {
    $schema: 'http://json-schema.org/draft-06/schema#',
    title: 'Vega Visualization Specification Language',
    defs: {},
    refs: {},
    type: 'object',
    allOf: [
      def('scope'),
      {
        properties: {
          $schema: type('string', {format: 'uri'}),
          usermeta: objectType,
          config: objectType,
          description: stringType,
          width: numberType,
          height: numberType,
          padding: def('padding'),
          autosize: def('autosize'),
          background: def('background'),
          style: ref('style')
        }
      }
    ]
  };

  [
    autosize,
    axis,
    background,
    bind,
    data,
    encode,
    expr,
    layout,
    legend,
    mark,
    marktype,
    onEvents,
    onTrigger,
    padding,
    projection,
    scale,
    scope,
    selector,
    signal,
    source,
    stream,
    title,
    transform(definitions)
  ].forEach(function(module) {
    addModule(schema, module);
  });

  return schema;
}
