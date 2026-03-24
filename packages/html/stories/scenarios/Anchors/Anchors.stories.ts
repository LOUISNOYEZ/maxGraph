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

import type { Meta, StoryObj } from '@storybook/html-vite';
import { anchorsScenarioSetup } from './Anchors.js';
import { graphManager } from '#.storybook/graphManager.js';
import { RubberBandHandler, ConnectionHandler } from '@maxgraph/core';

const meta: Meta = {
  title: 'Scenarios/Connections/Anchors',
};

export default meta;

export const Anchors: StoryObj = {
  parameters: {
    scenarioSetup: anchorsScenarioSetup,
    test: {
      autoplay: false,
    },
  },
  argTypes: {
    rubberBand: {
      type: 'boolean',
      control: {
        type: 'boolean',
      },
      table: {
        category: 'Plugins',
      },
      defaultValue: true,
    },
    connection: {
      type: 'boolean',
      control: {
        type: 'boolean',
      },
      table: {
        category: 'Plugins',
      },
      defaultValue: true,
    },
  },
  args: {
    rubberBand: true,
    connection: true,
  },
  render: (args) => {
    graphManager
      .graph!.getPlugin<RubberBandHandler>('RubberBandHandler')
      ?.setEnabled(args.rubberBand);
    graphManager
      .graph!.getPlugin<ConnectionHandler>('ConnectionHandler')
      ?.setEnabled(args.connection);
    return graphManager.container!;
  },
  play: async ({ step, userEvent }) => {
    const graph = graphManager.graph!;
    const helloCell = graph.getDataModel().getCell('Hello')!;
    const helloState = graph.getView().getState(helloCell)!;
    const worldCell = graph.getDataModel().getCell('World')!;
    const worldState = graph.getView().getState(worldCell)!;
    const connectionHandler =
      graphManager.graph!.getPlugin<ConnectionHandler>('ConnectionHandler')!;
    const constraintHandler = connectionHandler.constraintHandler;

    await step('Hover over source cell', async () => {
      const elt = helloState.shape?.node;
      const { left, top, height, width } = elt!.getBoundingClientRect();
      const x = left + width / 2;
      const y = top + height / 2;
      await userEvent.pointer({
        target: elt,
        coords: { x: x, y: y },
      });
    });

    await step(
      'Start connection (hover connection point and hold mouse button',
      async () => {
        const sourceConnElt = constraintHandler.focusIcons[0].node;
        const sourceConnRect = sourceConnElt.getBoundingClientRect();
        const { left, top, width, height } = sourceConnRect;

        const connX = left + width / 2;
        const connY = top + height / 2;
        await userEvent.pointer({
          target: sourceConnElt,
          coords: {
            x: connX,
            y: connY,
          },
        });

        await userEvent.pointer({
          target: sourceConnElt,
          coords: {
            x: connX,
            y: connY,
          },
          keys: '[MouseLeft>]',
        });
      }
    );

    const worldRect = worldState.shape!.node.getBoundingClientRect();
    let { top, left, width, height } = worldRect;

    const worldX = left + width / 2;
    const worldY = top + height / 2;

    await step('Move mouse to center of World shape', async () => {
      await userEvent.pointer({
        target: worldState.shape?.node,
        coords: {
          x: worldX,
          y: worldY,
        },
      });
    });

    const targetConnRect = constraintHandler.focusIcons[3].node.getBoundingClientRect();
    ({ top, left, width, height } = targetConnRect);

    const connX = left + width / 2;
    const connY = top + height / 2;

    await step('Hover target connection point', async () => {
      await userEvent.pointer({
        target: constraintHandler.focusIcons[3].node,
        coords: {
          x: connX,
          y: connY,
        },
      });
    });

    await step('Release mouse, complete connection', async () => {
      await userEvent.pointer({
        target: constraintHandler.focusIcons[3].node,
        coords: {
          x: connX,
          y: connY,
        },
        keys: '[/MouseLeft]',
      });
    });
  },
};
