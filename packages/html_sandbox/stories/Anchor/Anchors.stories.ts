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

import AnchorsDemo from './Anchors.ts';

import type { Meta, StoryObj } from '@storybook/html-vite';

import { within, userEvent } from '@storybook/test';

const meta = {
  title: 'Connections/Anchors',
  component: AnchorsDemo,
  parameters: {
    docs: {
      source: {
        type: 'code',
        language: 'ts',
        code: AnchorsDemo.toString(),
      },
    },
  },
} satisfies Meta<typeof AnchorsDemo>;
export default meta;

export const Anchors : StoryObj<typeof meta> = {
  play: async ({ canvasElement }) => {
    const helloTextElt = await within(canvasElement).getByText('Hello,').parentElement;
    await userEvent.hover(helloTextElt!);
    const connPoint = await canvasElement.firstChild?.firstChild?.firstChild?.childNodes.item(3).childNodes.item(2).firstChild as HTMLElement;
    console.log(connPoint);
    await userEvent.pointer({coords: {clientX: 2, clientY: 3}})
    await userEvent.pointer({target: connPoint})
    await userEvent.pointer({keys: '[MouseLeft]', coords: {clientX: 2, clientY: 3}})
//    await userEvent.pointer({keys: '[MouseLeft>]'})
//    await userEvent.pointer({keys: '[MouseLeft>]', target: connPoint})
//    const worldTestElt = await within(canvasElement).getByText('World!')
//    await userEvent.pointer({keys: '[/MouseLeft]', target: worldTestElt})
    //await userEvent.click(test);
  }
};
