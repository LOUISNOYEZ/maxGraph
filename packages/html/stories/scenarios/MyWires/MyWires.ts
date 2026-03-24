/*
Copyright 2021-present The maxGraph project Contributors
Copyright (c) 2006-2020, JGraph Ltd

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

import {
  type AbstractCanvas2D,
  type AbstractGraph,
  type Cell,
  cellArrayUtils,
  CellEditorHandler,
  CellHighlight,
  type CellState,
  type CellStateStyle,
  cloneUtils,
  ConnectionConstraint,
  ConnectionHandler,
  ConnectionHandlerCellMarker,
  ConstraintHandler,
  CylinderShape,
  DomHelpers,
  domUtils,
  EdgeSegmentHandler,
  type EdgeStyleFunction,
  EdgeStyleRegistry,
  type EventObject,
  EventSource,
  eventUtils,
  Graph,
  type GraphPluginConstructor,
  GraphView,
  Guide,
  ImageBox,
  InternalEvent,
  InternalMouseEvent,
  mathUtils,
  PanningHandler,
  Point,
  Rectangle,
  RubberBandHandler,
  SelectionCellsHandler,
  SelectionHandler,
  ShapeRegistry,
  StyleDefaultsConfig,
  styleUtils,
  TooltipHandler,
  UndoManager,
} from '@maxgraph/core';

import '@maxgraph/core/css/common.css'; // style required by RubberBand

const backgroundImageWiresGrid = 'url("./images/wires-grid.gif")';

export const myWiresScenarioSetup = (container: HTMLElement) => {

  const graph = new Graph(container);
  const parent = graph.getDefaultParent();
  graph.batchUpdate(() => {
    const v1 = graph.insertVertex(parent, null, 'J1', 80, 40, 40, 80, {
      verticalLabelPosition: 'top',
      verticalAlign: 'bottom',
      shadow: true,
    });
    v1.setConnectable(false);

    const v11 = graph.insertVertex(v1, null, '1', 0, 0, 10, 16, {
      shape: 'line',
      align: 'left',
      verticalAlign: 'middle',
      fontSize: 10,
      routingCenterX: -0.5,
      spacingLeft: 12,
    });
    v11.geometry!.relative = true;
    v11.geometry!.offset = new Point(-v11.geometry!.width, 2);
    const v12 = v11.clone();
    v12.value = '2';
    v12.geometry!.offset = new Point(-v11.geometry!.width, 22);
    v1.insert(v12);
    const v13 = v11.clone();
    v13.value = '3';
    v13.geometry!.offset = new Point(-v11.geometry!.width, 42);
    v1.insert(v13);
    const v14 = v11.clone();
    v14.value = '4';
    v14.geometry!.offset = new Point(-v11.geometry!.width, 62);
    v1.insert(v14);

    const v15 = v11.clone();
    v15.value = '5';
    v15.geometry!.x = 1;
    v15.style = {
      shape: 'line',
      align: 'right',
      verticalAlign: 'middle',
      fontSize: 10,
      routingCenterX: 0.5,
      spacingRight: 12,
    };
    v15.geometry!.offset = new Point(0, 2);
    v1.insert(v15);
    const v16 = v15.clone();
    v16.value = '6';
    v16.geometry!.offset = new Point(0, 22);
    v1.insert(v16);
    const v17 = v15.clone();
    v17.value = '7';
    v17.geometry!.offset = new Point(0, 42);
    v1.insert(v17);
    const v18 = v15.clone();
    v18.value = '8';
    v18.geometry!.offset = new Point(0, 62);
    v1.insert(v18);

    const v19 = v15.clone();
    v19.value = 'clk';
    if (v19.geometry) {
      v19.geometry.x = 0.5;
      v19.geometry.y = 1;
      v19.geometry.width = 10;
      v19.geometry.height = 4;
    }
    // NOTE: portConstraint is defined for east direction, so must be inverted here
    v19.style = {
      shape: 'triangle',
      direction: 'north',
      spacingBottom: 12,
      align: 'center',
      // @ts-expect-error - portConstraint not used as usual, we should use a dedicated routing property
      portConstraint: 'horizontal',
      fontSize: 8,
      routingCenterY: 0.5,
    };
    v19.geometry!.offset = new Point(-4, -4);
    v1.insert(v19);

    const v2 = graph.insertVertex(parent, null, 'R1', 220, 220, 80, 20, {
      shape: 'resistor',
      verticalLabelPosition: 'top',
      verticalAlign: 'bottom',
    });

    // Uses implementation of connection points via constraints (see above)
    const connectionPointsWithConstraints = true;
    if (connectionPointsWithConstraints) {
      v2.setConnectable(false);

      const v21 = graph.insertVertex(v2, null, 'A', 0, 0.5, 10, 1, {
        shape: 'none',
        spacingBottom: 11,
        spacingLeft: 1,
        align: 'left',
        fontSize: 8,
        fontColor: '#4c4c4c',
        strokeColor: '#909090',
      });
      v21.geometry!.relative = true;
      v21.geometry!.offset = new Point(0, -1);

      const v22 = graph.insertVertex(v2, null, 'B', 1, 0.5, 10, 1, {
        // shape: 'none',
        spacingBottom: 11,
        spacingLeft: 1,
        align: 'left',
        fontSize: 8,
        fontColor: '#4c4c4c',
        strokeColor: '#909090',
      });
      v22.geometry!.relative = true;
      v22.geometry!.offset = new Point(-10, -1);
    }

    const v3 = graph.addCell(cellArrayUtils.cloneCell(v1)!); // cloneCell returns null only if the cell is null, which is not the case here
    v3.value = 'J3';
    v3.geometry!.x = 420;
    v3.geometry!.y = 340;

    // Connection constraints implemented in edges, alternatively this can be implemented using references, see the PortRefs story
    if (!connectionPointsWithConstraints) {
      const e1 = graph.insertEdge({
        parent,
        value: 'e1',
        source: v1.getChildAt(7),
        target: v2,
        style: {
          entryX: 0,
          entryY: 0.5,
          entryPerimeter: false,
        },
      });
      e1.geometry!.points = [new Point(180, 110)];

      const e2 = graph.insertEdge({
        parent,
        value: 'e2',
        source: v1.getChildAt(4),
        target: v2,
        style: {
          entryX: 1,
          entryY: 0.5,
          entryPerimeter: false,
        },
      });
      e2.geometry!.points = [new Point(320, 50), new Point(320, 230)];

      const e3 = graph.insertEdge({ parent, value: 'crossover', source: e1, target: e2 });
      e3.geometry!.setTerminalPoint(new Point(180, 140), true);
      e3.geometry!.setTerminalPoint(new Point(320, 140), false);
    } else {
      const e1 = graph.insertEdge({
        parent,
        value: 'e1',
        source: v1.getChildAt(7),
        target: v2.getChildAt(0),
      });
      e1.geometry!.points = [new Point(180, 140)];

      const e2 = graph.insertEdge({
        parent,
        source: v1.getChildAt(4),
        target: v2.getChildAt(1),
      });
      e2.geometry!.points = [new Point(320, 80)];

      const e3 = graph.insertEdge({ parent, value: 'crossover', source: e1, target: e2 });
      e3.geometry!.setTerminalPoint(new Point(180, 160), true);
      e3.geometry!.setTerminalPoint(new Point(320, 160), false);
    }

    const e4 = graph.insertEdge(parent, null, 'e4', v2, v3.getChildAt(0), {
      exitX: 1,
      exitY: 0.5,
      entryPerimeter: false,
    });
    e4.geometry!.points = [new Point(380, 230)];

    const e5 = graph.insertEdge(parent, null, 'e5', v3.getChildAt(5), v1.getChildAt(0));
    e5.geometry!.points = [new Point(500, 310), new Point(500, 20), new Point(50, 20)];

    const e6 = graph.insertEdge(parent, null, '');
    e6.geometry!.setTerminalPoint(new Point(100, 500), true);
    e6.geometry!.setTerminalPoint(new Point(600, 500), false);

    const e7 = graph.insertEdge(parent, null, 'e7', v3.getChildAt(7), e6);
    e7.geometry!.setTerminalPoint(new Point(500, 500), false);
    e7.geometry!.points = [new Point(500, 350)];
  });

  return graph;
};
