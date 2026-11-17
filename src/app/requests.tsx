import { ScreenPlaceholder } from '@/components/screen-placeholder';

export default function RequestsScreen() {
  return (
    <ScreenPlaceholder
      title="My Requests"
      description="Track your device repairs and pick up right where you left off."
      ios="list.bullet.rectangle"
      android="list_alt"
    />
  );
}
