// TrustedDevice.stories.tsx
import type { Meta, StoryObj } from "@storybook/react";
import { createKcPageStory } from "../KcPageStory";

const { KcPageStory } = createKcPageStory({ pageId: "trusted-device.ftl" });

const meta = {
    title: "login/trusted-device.ftl",
    component: KcPageStory
} satisfies Meta<typeof KcPageStory>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
    render: () => (
        <KcPageStory
            kcContext={{
                auth: {
                    showUsername: true,
                    showResetCredentials: false,
                    attemptedUsername: "john.doe@example.com"
                }
            }}
        />
    )
};

export const WithoutUsername: Story = {
    render: () => (
        <KcPageStory
            kcContext={{
                auth: undefined
            }}
        />
    )
};
