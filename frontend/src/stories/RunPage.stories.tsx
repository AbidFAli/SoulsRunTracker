import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, userEvent, within } from 'storybook/test';
import { MockedProvider } from "@apollo/client/testing/react";
import type { MockLink } from '@apollo/client/testing';

import RunPage from '@/app/user/[userId]/runs/[runId]/page'
import {RootLayoutBody} from "@/app/rootLayoutBody"
import { GetRunDocument} from "@/generated/graphql/graphql"
import type { GetRunQuery, GetRunQueryVariables } from '@/generated/graphql/graphql';

const meta = {
  component: RunPage,
  parameters: {
    // More on how to position stories at: https://storybook.js.org/docs/configure/story-layout
    layout: 'fullscreen',
  },
} satisfies Meta<typeof RunPage>;
 
export default meta;
type Story = StoryObj<typeof meta>;


const routeParams = {
  userId: "123",
  runId: "1234",
}

const mockedErrorResponse: MockLink.MockedResponse<GetRunQuery, GetRunQueryVariables> = {
  request: {
    query: GetRunDocument,
    variables: {
      where: {
        id: routeParams.runId
      }
    }
  },
  error: new Error("an error has occured")
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const mocks: MockLink.MockedResponse<any, any>[] = [mockedErrorResponse];

export const FirstStory: Story = {
  name: "Shows error",
  args: {
    params: new Promise((resolve) => {
      resolve(routeParams)
    }),
    searchParams: new Promise((resolve) => {
      resolve({})
    }),
  },
  render: (args) => {
    return <RootLayoutBody>
      <MockedProvider mocks={mocks}>
        <RunPage {...args} />
      </MockedProvider>
    </RootLayoutBody>
  }
};