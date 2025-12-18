import {
  CellEditorHandler,
  CellState,
  ConnectionHandler,
  ConnectionConstraint,
  Geometry,
  Graph,
  type GraphPluginConstructor,
  InternalMouseEvent,
  Point,
  RubberBandHandler,
  SelectionCellsHandler,
  SelectionHandler,
} from '@maxgraph/core';

import { configureImagesBasePath, createGraphContainer } from '../shared/configure.js';

// style required by RubberBand
import '@maxgraph/core/css/common.css';

const anchorsPluginsDefault: GraphPluginConstructor[] = [
  CellEditorHandler,
  SelectionCellsHandler,
  ConnectionHandler,
  SelectionHandler,
];

export class AnchorsGraph extends Graph {
  constructor(container: HTMLElement, rubberBand: boolean = true) {
    const plugins = rubberBand
      ? anchorsPluginsDefault.concat(RubberBandHandler)
      : anchorsPluginsDefault;
    super(container, undefined, plugins);

    this.getPlugin<ConnectionHandler>('ConnectionHandler')!.createEdgeState = function ( _me: InternalMouseEvent ) {
      const edge = this.graph.createEdge(null, null!, null, null, null);
      return new CellState(this.graph.view, edge, this.graph.getCellStyle(edge));
    }

    this.setConnectable(true);

    // Specifies the default edge style
    this.getStylesheet().getDefaultEdgeStyle().edgeStyle = 'orthogonalEdgeStyle';
  }
}

export const AnchorsDemo = (args: Record<string, string>) => {
  configureImagesBasePath();
  const container = createGraphContainer(args);

  class AnchorsGeometryClass extends Geometry {
    // Defines the default constraints for the vertices
    constraints = [
      new ConnectionConstraint(new Point(0.25, 0), true),
      new ConnectionConstraint(new Point(0.5, 0), true),
      new ConnectionConstraint(new Point(0.75, 0), true),
      new ConnectionConstraint(new Point(0, 0.25), true),
      new ConnectionConstraint(new Point(0, 0.5), true),
      new ConnectionConstraint(new Point(0, 0.75), true),
      new ConnectionConstraint(new Point(1, 0.25), true),
      new ConnectionConstraint(new Point(1, 0.5), true),
      new ConnectionConstraint(new Point(1, 0.75), true),
      new ConnectionConstraint(new Point(0.25, 1), true),
      new ConnectionConstraint(new Point(0.5, 1), true),
      new ConnectionConstraint(new Point(0.75, 1), true),
    ];
  }

  // Creates the graph inside the given container
  const graph: AnchorsGraph = new AnchorsGraph(container, Boolean(args.rubberBand));

  graph.getAllConnectionConstraints = (terminal: CellState | null, _source: boolean) => {
    // Overridden to define per-geometry connection points
    return (terminal?.cell?.geometry as AnchorsGeometryClass)?.constraints ?? null;
  };

  // Gets the default parent for inserting new cells. This
  // is normally the first child of the root (ie. layer 0).
  const parent = graph.getDefaultParent();

  // Adds cells to the model in a single step
  graph.batchUpdate(() => {
    const v1 = graph.insertVertex({
      parent,
      id: 'rect1',
      value: 'Hello,',
      position: [20, 20],
      size: [80, 30],
      geometryClass: AnchorsGeometryClass,
    });
    const v2 = graph.insertVertex({
      parent,
      id: 'rect2',
      value: 'World!',
      position: [200, 150],
      size: [80, 30],
      geometryClass: AnchorsGeometryClass,
    });
    graph.insertEdge({
      parent,
      value: '',
      source: v1,
      target: v2,
    });
  });

  container.firstElementChild?.setAttribute('role', 'img');
  container.firstElementChild?.setAttribute('aria-label', 'test');

  return container;
};

export default AnchorsDemo;
