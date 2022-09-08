import { FontAwesome } from '@expo/vector-icons';
import React from 'react';

export default function DrawerIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>['name'];
  color: string;
}) {
  return <FontAwesome size={30} style={{ marginBottom: -3, width: 60 }} {...props} />;
}
