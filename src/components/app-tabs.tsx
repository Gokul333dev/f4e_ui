import { TabList, TabSlot, TabTrigger, Tabs } from 'expo-router/ui';

import { BottomNav, NavItem } from './bottom-nav';

export default function AppTabs() {
  return (
    <Tabs>
      <TabSlot />
      <TabList asChild>
        <BottomNav>
          <TabTrigger name="home" href="/" asChild>
            <NavItem ios="house" android="home" label="Home" />
          </TabTrigger>
          <TabTrigger name="requests" href="/requests" asChild>
            <NavItem ios="list.bullet.rectangle" android="list_alt" label="Request" />
          </TabTrigger>
          <TabTrigger name="new" href="/new" asChild>
            <NavItem ios="plus" android="add" label="New" />
          </TabTrigger>
          <TabTrigger name="rewards" href="/rewards" asChild>
            <NavItem ios="gift" android="redeem" label="Reward" />
          </TabTrigger>
          <TabTrigger name="profile" href="/profile" asChild>
            <NavItem ios="person" android="person" label="Profile" />
          </TabTrigger>
        </BottomNav>
      </TabList>
    </Tabs>
  );
}
