import * as React from "react";

import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarRail,
} from "@/components/ui/sidebar";

const data = {
    navGroups: [
        {
            groupName: "Main",
            items: [
                {
                    title: "API Analyzer",
                    url: "/",
                    icon: "FileSearch",
                    description: "Extract and analyze API requests",
                    isActive: true,
                },
            ],
        },
        {
            groupName: "Library",
            items: [
                {
                    title: "Examples",
                    url: "/examples",
                    icon: "Lightbulb",
                    description: "Sample API requests",
                },
                {
                    title: "History",
                    url: "/history",
                    icon: "History",
                    description: "Recently analyzed APIs",
                },
            ],
        },
        {
            groupName: "Help & Settings",
            items: [
                {
                    title: "Documentation",
                    url: "/documentation",
                    icon: "BookOpen",
                    description: "Usage guides and help",
                },
                {
                    title: "Settings",
                    url: "/settings",
                    icon: "Settings",
                    description: "Configure your preferences",
                },
            ],
        },
    ],
};
export function MainSidebar({
    ...props
}: React.ComponentProps<typeof Sidebar>) {
    return (
        <Sidebar {...props}>
            <SidebarHeader></SidebarHeader>
            <SidebarContent>
                {data.navGroups.map((item) => (
                    <SidebarGroup key={item.groupName}>
                        <SidebarGroupLabel>{item.groupName}</SidebarGroupLabel>
                        <SidebarGroupContent>
                            <SidebarMenu>
                                {item.items.map((item) => (
                                    <SidebarMenuItem key={item.title}>
                                        <SidebarMenuButton
                                            asChild
                                            isActive={item.isActive}
                                        >
                                            <a href={item.url}>{item.title}</a>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                ))}
                            </SidebarMenu>
                        </SidebarGroupContent>
                    </SidebarGroup>
                ))}
            </SidebarContent>
            <SidebarRail />
        </Sidebar>
    );
}
