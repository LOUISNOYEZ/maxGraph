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

export const Anchors : StoryObj<typeof meta> = {};
